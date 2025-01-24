package cron

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"log"
	"os"
	"os/exec"
	"sync"
	"time"

	"gorm.io/gorm"
)

type Cron struct {
	srv                   *service.Service
	rtmpURL, hlsURL       string
	scheduledVideosFolder string
	logFolder             string
	liveFolder            string
	mCtx                  context.Context
	wsWG                  *sync.WaitGroup
}

var (
	streamStopChannels = make(map[uint]chan bool)
	mu                 sync.Mutex
)

func NewCron(srv *service.Service, ctx context.Context, wg *sync.WaitGroup) *Cron {
	c := &Cron{
		srv:                   srv,
		rtmpURL:               conf.GetStreamServerConfig().RTMPURL,
		hlsURL:                conf.GetStreamServerConfig().HLSURL,
		logFolder:             conf.GetFileStorageConfig().LogFolder,
		liveFolder:            conf.GetFileStorageConfig().LiveFolder,
		scheduledVideosFolder: conf.GetFileStorageConfig().ScheduledVideosFolder,
		mCtx:                  ctx,
		wsWG:                  wg,
	}

	go c.run()

	return c
}

func (c *Cron) run() {
	go c.checkScheduledStream()
	go c.cleanupScheduledVideos()
	go c.cleanupScheduledVideosBeforeLast7days()
	go c.cleanupEndedLiveVideos()
	go c.cleanupEndedLiveVideosBeforeLast7days()
}
func (c *Cron) checkScheduledStream() {
	ticker := time.NewTicker(time.Minute * 1)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("checking scheduled streams")

		scheduledStreams, err := c.srv.Stream.CheckScheduledStream()
		if err != nil {
			log.Println(err)
			continue
		}

		for _, stream := range scheduledStreams {
			go c.streamVideo(stream)
		}
	}

}

func (c *Cron) streamVideo(scheduledStream *model.ScheduleStream) {
	streamID := scheduledStream.Stream.ID

	mu.Lock()
	stopChan := make(chan bool)
	streamStopChannels[streamID] = stopChan
	mu.Unlock()

	defer func() {
		mu.Lock()
		delete(streamStopChannels, streamID)
		mu.Unlock()
		close(stopChan)
	}()

	token, err := c.srv.StreamServer.GetChannelKey(scheduledStream.Stream.StreamKey)
	if err != nil {
		log.Println(err)
		return
	}

	scheduledStream.Stream.StreamToken = sql.NullString{
		String: token,
		Valid:  true,
	}

	pushURL := utils.MakePushURL(c.rtmpURL, token)

	videoPath := utils.MakeVideoPath(c.scheduledVideosFolder, scheduledStream.VideoName)

	broadCastURL := utils.MakeBroadcastURL(c.hlsURL, scheduledStream.Stream.StreamKey)
	log.Println(broadCastURL)

	log.Println(pushURL, videoPath)

	scheduledStream.Stream.Status = model.STARTED
	scheduledStream.Stream.StartedAt = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	if err := c.srv.Stream.Update(&scheduledStream.Stream); err != nil {
		log.Println(err)
		return
	}

	if err := c.srv.Stream.InitializeStreamAnalytics(&scheduledStream.Stream); err != nil {
		log.Println(err)
		return
	}

	ffmpegCmd := exec.Command("ffmpeg",
		"-i", videoPath,
		"-c:v", "libx264",
		"-c:a", "aac",
		"-f", "flv",
		pushURL)

	// Capture standard output and error
	// var stderr bytes.Buffer
	// ffmpegCmd.Stdout = &stdout
	// ffmpegCmd.Stderr = &stderr

	// Start the command
	if err := ffmpegCmd.Start(); err != nil {
		log.Println("Failed to start FFmpeg:", err)
		// log.Println("FFmpeg stderr:", stderr.String())
		return
	}

	pStreamCloseChan := make(chan bool)
	closeChan := make(chan bool)

	defer func() {
		pStreamCloseChan <- true
		closeChan <- true
		log.Println("Send close message to wsCloseChan")
	}()

	isEndByAdmin := make(chan bool)

	go func() {
		c.srv.Stream.IsEndByAdminWithCloseChan(scheduledStream.Stream.ID, context.Background(), isEndByAdmin, closeChan)
	}()

	c.wsWG.Add(1)
	go func() {
		defer func() {
			c.wsWG.Done()
			log.Println("Prerecord Live Stream ended")
		}()

		for {
			select {
			case <-c.mCtx.Done():
				log.Println("Pre Record Live Stream ending by main CTx")

				if err := c.srv.Stream.FinishLiveStream(&scheduledStream.Stream, true); err != nil {
					log.Println("Failed to finish live stream:", err)
				}

				return
			case <-pStreamCloseChan:
				log.Println("Pre Record Live Stream ended by channel")

				if err := c.srv.Stream.FinishLiveStream(&scheduledStream.Stream, false); err != nil {
					log.Println("Failed to finish live stream:", err)
				}
				return
			case <-isEndByAdmin:
				log.Println("Pre Record Live Stream ended by admin")
				ffmpegCmd.Process.Kill() // Kill the FFmpeg process
				if err := c.srv.Stream.FinishLiveStream(&scheduledStream.Stream, false); err != nil {
					log.Println("Failed to finish live stream:", err)
				}
				return

			}
		}

	}()

	// Wait for the command to complete
	//err = ffmpegCmd.Wait()

	select {
	case <-stopChan:
		log.Printf("Stream %s stopped by API", streamID)
		if err := ffmpegCmd.Process.Kill(); err != nil {
			log.Printf("Failed to kill FFmpeg process for stream %s: %v", streamID, err)
		}
	case err := <-waitForProcess(ffmpegCmd):
		if err != nil {
			log.Printf("FFmpeg exited with error for stream %s: %v", streamID, err)
		} else {
			log.Printf("FFmpeg process completed successfully for stream %s.", streamID)
		}
	}

	if err != nil {
		log.Println("FFmpeg process exited with error:", err)
		// log.Println("FFmpeg stderr:", stderr.String())
	} else {
		log.Println("FFmpeg process completed successfully.")
	}

	// Log the output
	// log.Println("FFmpeg stdout:", stdout.String())
	// log.Println("FFmpeg stderr:", stderr.String())

	log.Println("Video streaming process finished.")

}

// Helper: Wait FFmpeg process
func waitForProcess(cmd *exec.Cmd) <-chan error {
	errChan := make(chan error, 1)
	go func() {
		errChan <- cmd.Wait()
	}()
	return errChan
}

func StopStream(streamID uint) {
	mu.Lock()
	stopChan, exists := streamStopChannels[streamID]
	mu.Unlock()

	if exists {
		log.Printf("Stopping stream %s...", streamID)
		stopChan <- true
	} else {
		log.Printf("No active stream found for ID %s", streamID)
	}
}

func (c *Cron) cleanupScheduledVideos() {
	// run every 3 days
	ticker := time.NewTicker(time.Hour * 24 * 3)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("Cleaning up scheduled videos Every 3 days")

		scheduledStreams, err := c.srv.Stream.GetScheduleStreamsBetweenLast5And3DaysUTC()
		if err != nil {
			log.Println(err)
			continue
		}

		deletedVideos := make(map[uint]string)

		for _, scheduledStream := range scheduledStreams {
			videoPath := utils.MakeVideoPath(c.scheduledVideosFolder, scheduledStream.VideoName)
			if err := os.Remove(videoPath); err != nil {
				log.Println(err)
				continue
			}

			log.Println("Deleted video:", videoPath)

			deletedVideos[scheduledStream.ID] = scheduledStream.VideoName
		}

		// why use go routine, cause wants to use defer effetively
		c.deletedVideosLog(deletedVideos, "video_deleted_by_3days_cron")
	}
}

// double check
func (c *Cron) cleanupScheduledVideosBeforeLast7days() {
	now := time.Now()
	next3AM := time.Date(
		now.Year(), now.Month(), now.Day(),
		3, 0, 0, 0, now.Location(),
	)
	if now.After(next3AM) {
		// If it's already past 3 AM today, schedule for tomorrow
		next3AM = next3AM.Add(24 * time.Hour)
	}

	// Wait until the next 3 AM
	time.Sleep(time.Until(next3AM))

	ticker := time.NewTicker(time.Hour * 24 * 7)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("Cleaning up scheduled videos before last 7 days")

		files, err := utils.GetFilesModifiedBeforeLast7Days(c.scheduledVideosFolder)
		if err != nil {
			log.Println(err)
			continue
		}

		deletedVideos := make(map[string]bool)

		for _, file := range files {
			log.Println("Deleting file:", file)
			if err := os.Remove(file); err != nil {
				log.Println(err)
				continue
			}

			deletedVideos[file] = true
		}

		c.deletedVideosBeforeLast7daysLog(deletedVideos, "video_deleted_by_7days_cron")
	}
}

func (c *Cron) cleanupEndedLiveVideos() {
	ticker := time.NewTicker(time.Hour * 24 * 3)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("Cleaning up ended live videos")

		streams, err := c.srv.Stream.GetEndedLiveStreamsBetweenLast5And3DaysUTC()
		if err != nil {
			log.Println(err)
			continue
		}

		deletedVideos := make(map[uint]string)

		for _, stream := range streams {
			liveVideoPath, err := utils.MakeLiveVideoPath(c.liveFolder, stream.StreamKey)
			if err != nil {
				log.Println(err)
				continue
			}

			if err := os.Remove(liveVideoPath); err != nil {
				log.Println(err)
				continue
			}

			log.Println("Deleted video:", liveVideoPath)

			deletedVideos[stream.ID] = liveVideoPath

		}

		c.deletedVideosLog(deletedVideos, "live_video_deleted_by_3days_cron")
	}

}

func (c *Cron) cleanupEndedLiveVideosBeforeLast7days() {
	now := time.Now()
	next3AM := time.Date(
		now.Year(), now.Month(), now.Day(),
		3, 0, 0, 0, now.Location(),
	)
	if now.After(next3AM) {
		// If it's already past 3 AM today, schedule for tomorrow
		next3AM = next3AM.Add(24 * time.Hour)
	}

	// Wait until the next 3 AM
	time.Sleep(time.Until(next3AM))

	ticker := time.NewTicker(time.Hour * 24 * 7)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("Cleaning up ended live videos before last 7 days")

		files, err := utils.GetFilesModifiedBeforeLast7Days(c.liveFolder)
		log.Println(files, err)
		if err != nil {
			log.Println(err)
			continue
		}

		deletedVideos := make(map[string]bool)

		for _, file := range files {
			streamKey, err := utils.ExtractUUIDFromFilePath(file)
			if err != nil {
				log.Println(err)
				continue
			}

			stream, err := c.srv.Stream.GetStreamByStreamKey(streamKey)
			if err != nil {
				// shouldn't come here if data are right
				log.Println(err)
				if !errors.Is(err, gorm.ErrRecordNotFound) {
					continue
				}
			}

			if stream != nil {
				if stream.Status != model.ENDED {
					log.Println("Stream is not ended:", streamKey, "ID:", stream.ID, " Need to manually end")
					continue
				}

			}

			if err := os.Remove(file); err != nil {
				log.Println(err)
				continue
			}

			log.Println("Deleted video:", file)

			deletedVideos[file] = true
		}

		c.deletedVideosBeforeLast7daysLog(deletedVideos, "live_video_deleted_by_7days_cron")
	}

}

func (c *Cron) deletedVideosLog(videos map[uint]string, name string) {
	if len(videos) > 0 {
		file := utils.CreateTxtFile(c.logFolder, name)
		if file == nil {
			return
		}

		defer file.Close()

		for id, VideoName := range videos {
			if _, err := file.WriteString(fmt.Sprintf("%d,%s\n", id, VideoName)); err != nil {
				log.Println(err)
				return
			}

		}
	}
}

func (c *Cron) deletedVideosBeforeLast7daysLog(videos map[string]bool, name string) {
	if len(videos) > 0 {
		file := utils.CreateTxtFile(c.logFolder, name)
		if file == nil {
			return
		}

		defer file.Close()

		for videoPath := range videos {
			if _, err := file.WriteString(fmt.Sprintf("%s\n", videoPath)); err != nil {
				log.Println(err)
				return
			}
		}
	}
}
