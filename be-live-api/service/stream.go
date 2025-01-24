package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/cache"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"
	"log"
	"os/exec"
	"time"

	"gorm.io/gorm"
)

type StreamService struct {
	repo         *repository.Repository
	redisStore   cache.RedisStore
	streamServer *streamServerService

	liveFolder            string
	scheduledVideosFolder string
	videoFolder           string

	// [filepath, isEncoding]
}

func newStreamService(repo *repository.Repository, redis cache.RedisStore, streamServer *streamServerService) *StreamService {
	return &StreamService{
		repo:                  repo,
		redisStore:            redis,
		streamServer:          streamServer,
		liveFolder:            conf.GetFileStorageConfig().LiveFolder,
		scheduledVideosFolder: conf.GetFileStorageConfig().ScheduledVideosFolder,
		videoFolder:           conf.GetFileStorageConfig().VideoFolder,
	}
}

func (s *StreamService) CreateStream(req *dto.StreamRequest) (*model.Stream, error) {
	channelKey := utils.MakeUniqueID()
	token, err := s.streamServer.GetChannelKey(channelKey)
	if err != nil {
		return nil, err
	}

	stream := &model.Stream{
		UserID:      req.UserID,
		Title:       req.Title,
		Description: req.Description,
		Status:      model.PENDING,
		StreamToken: sql.NullString{
			String: token,
			Valid:  true,
		},
		StreamKey:         channelKey,
		StreamType:        req.StreamType,
		ThumbnailFileName: req.ThumbnailFileName,
	}

	if err := s.repo.Stream.CreateStreamAndStreamCategory(stream, req.CategoryIDs); err != nil {
		return nil, err
	}

	return stream, nil
}

func (s *StreamService) GetStreamByID(id uint) (*model.Stream, error) {
	return s.repo.Stream.GetByID(id)
}

func (s *StreamService) GetStreamByIDAndStatus(id uint, status model.StreamStatus) (*model.Stream, error) {
	return s.repo.Stream.GetByIDAndStatus(id, status)
}

func (s *StreamService) Update(stream *model.Stream) error {
	return s.repo.Stream.Update(stream)
}

func (s *StreamService) endStream(stream *model.Stream) error {
	return s.repo.Stream.EndStreamByID(stream.ID)
}

func (s *StreamService) GetComments(streamID uint, userID uint, page int, limit int) (*utils.PaginationModel[dto.LiveCommentDto], error) {
	pagination, err := s.repo.Interaction.GetComments(streamID, page, limit)
	if err != nil {
		return nil, err
	}
	var newPage = new(utils.PaginationModel[dto.LiveCommentDto])
	avtFolder := conf.GetFileStorageConfig().AvatarFolder
	newPage.Page = utils.Map(pagination.Page, func(e model.Comment) dto.LiveCommentDto {
		avtURL := ""
		if e.User.AvatarFileName.String != "" {
			avtURL = utils.GetFileUrl(avtFolder, e.User.AvatarFileName.String)
		}

		return dto.LiveCommentDto{
			ID:          e.ID,
			DisplayName: e.User.DisplayName,
			AvatarURL:   avtURL,
			Content:     e.Comment,
			CreatedAt:   e.CreatedAt,
			IsEdited:    e.CreatedAt != e.UpdatedAt,
			IsMe:        e.UserID == userID,
		}
	})
	newPage.BasePaginationModel = pagination.BasePaginationModel
	return newPage, err
}

func (s *StreamService) FinishLiveStream(stream *model.Stream, isServerClosing bool) error {
	if err := s.endStream(stream); err != nil {
		log.Println("Failed to end stream:", err)
		return err
	}

	cacheKeyEndingAdmin := fmt.Sprintf(cache.IS_ENDING_LIVE_PREFIX, stream.ID)
	if err := s.redisStore.RemoveWithDefaultCtx(cacheKeyEndingAdmin); err != nil {
		log.Println(err)
	}

	videoName := stream.StreamKey + ".mp4"

	cacheKeyEncoding := fmt.Sprintf(cache.VIDEO_ENCODING_PREFIX, videoName)
	s.redisStore.SetWithDefaultCtx(cacheKeyEncoding, true, time.Hour*5)
	defer s.redisStore.RemoveWithDefaultCtx(cacheKeyEncoding)

	// go func() {
	inputVideoPath, err := utils.MakeLiveVideoPath(s.liveFolder, stream.StreamKey)
	if err != nil {
		log.Println(err)
		return err
	}

	outputVideoPath := utils.MakeVideoPath(s.videoFolder, stream.StreamKey+".mp4")
	if err := s.EncodeToMp4(inputVideoPath, outputVideoPath, isServerClosing); err != nil {
		log.Println("Failed to encode video:", err)
	}
	// }()

	if err := s.analyzeStream(stream); err != nil {
		log.Println("Failed to analyze stream:", err)
		return err
	}

	return nil
}

func (s *StreamService) EncodeToMp4(inputVideoPath, outputVideoPath string, isServerClosing bool) error {
	var cmd *exec.Cmd

	if isServerClosing {
		cmd = exec.Command("ffmpeg", "-i", inputVideoPath, "-c:v", "copy", "-c:a", "copy", outputVideoPath)
	} else {
		cmd = exec.Command("ffmpeg", "-i", inputVideoPath, "-c:v", "libx264", "-c:a", "aac", outputVideoPath)
	}

	// cmd := exec.Command("sh", "-c", command)

	log.Println("Encoding video...")

	// Run the command
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to encode video: %w", err)
	}

	log.Println("Video encoded successfully")

	return nil

}

func (s *StreamService) InitializeStreamAnalytics(stream *model.Stream) error {
	analytics := &model.StreamAnalytics{
		StreamID:  stream.ID,
		Views:     0,
		Likes:     0,
		Comments:  0,
		VideoSize: 0,
	}

	return s.repo.Stream.CreateStreamAnalytics(analytics)
}

func (s *StreamService) analyzeStream(stream *model.Stream) error {
	analytics, err := s.repo.Stream.GetStreamAnalyticsByStreamID(stream.ID)
	if err != nil {
		log.Println("error getting analytics", err)
		return err
	}

	views, err := s.repo.Interaction.CountViewsByStreamID(stream.ID)
	if err != nil {
		log.Println("error counting views", err)
		return err
	}
	analytics.Views = uint(views)

	likes, err := s.repo.Interaction.CountLikesByStreamID(stream.ID)
	if err != nil {
		log.Println("error counting likes", err)
		return err
	}
	analytics.Likes = uint(likes)

	comments, err := s.repo.Interaction.CountCommentsByStreamID(stream.ID)
	if err != nil {
		log.Println("error counting comments", err)
		return err
	}
	analytics.Comments = uint(comments)

	videoPath := utils.MakeVideoPath(s.videoFolder, stream.StreamKey+".mp4")
	videoSize, err := utils.GetfileSize(videoPath)
	if err != nil {
		log.Println("error getting video size", err)
	}

	log.Println(videoSize)
	analytics.VideoSize = uint(videoSize)

	duration, err := utils.GetDurationInMicroSeconds(videoPath)
	if err != nil {
		log.Println("error getting video duration", err)

		if stream.EndedAt.Valid && stream.StartedAt.Valid {
			analytics.Duration = uint(stream.EndedAt.Time.Sub(stream.StartedAt.Time).Microseconds())
		} else {
			log.Println("shouldn't reach here", stream.EndedAt.Valid, stream.StartedAt.Valid)
		}

	} else {
		analytics.Duration = duration
	}

	shares, err := s.repo.Interaction.CountSharesByStreamID(stream.ID)
	if err != nil {
		log.Println("error counting shares", err)
		return err
	}
	analytics.Shares = uint(shares)

	return s.repo.Stream.UpdateStreamAnalytics(analytics)
}

func (s *StreamService) AddViewForLive(streamID uint, userID uint) error {
	view := &model.View{
		UserID:    userID,
		StreamID:  streamID,
		ViewType:  model.ViewTypeLiveView,
		IsViewing: true,
	}

	_, err := s.repo.Stream.GetViewByStreamIDAndUserID(streamID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return s.repo.Stream.CreateView(view)
		}
		return err
	}

	return s.repo.Stream.UpdateViewStatus(streamID, userID, true)
}

func (s *StreamService) QuitView(streamID uint, userID uint) error {
	return s.repo.Stream.UpdateViewStatus(streamID, userID, false)
}

func (s *StreamService) GetStreams(filter *dto.StreamQuery) (*utils.PaginationModel[dto.Stream], error) {
	return s.repo.Stream.GetStreams(filter)
}

func (s *StreamService) GetStream(id uint, userId uint) (*dto.Stream, error) {
	return s.repo.Stream.GetStream(id, userId)
}

func (s *StreamService) CheckScheduledStream() ([]*model.ScheduleStream, error) {
	return s.repo.Stream.CheckScheduledStream()
}

func (s *StreamService) UpdateStreamAndStreamCategory(stream *model.Stream, categoryIDs []uint) error {
	return s.repo.Stream.UpdateStreamAndStreamCategory(stream, categoryIDs)
}

func (s *StreamService) GetScheduleStreamsBetweenLast5And3DaysUTC() ([]*model.ScheduleStream, error) {
	return s.repo.Stream.GetScheduleStreamsBetweenLast5And3DaysUTC()
}

func (s *StreamService) GetEndedLiveStreamsBetweenLast5And3DaysUTC() ([]*model.Stream, error) {
	return s.repo.Stream.GetEndedLiveStreamsBetweenLast5And3DaysUTC()
}

func (s *StreamService) GetStreamByStreamKey(streamKey string) (*model.Stream, error) {
	return s.repo.Stream.GetStreamByStreamKey(streamKey)
}

func (s *StreamService) IsEndByAdmin(id uint, ctx context.Context, isEndByAdmin chan<- bool) {
	var err error
	var isEnding bool
	ctx, cancel := context.WithCancel(ctx) // Create a cancellable context
	defer cancel()

	channelKey := fmt.Sprintf(cache.CHANNEL_END_LIVE, id)

	handlerFunc := func(channel string, message string) {
		isEnding, err = cache.ParseAndCast[bool](message)
		if err != nil {
			log.Println("Failed to parse message:", err)
			return
		}
		log.Println("EndByAdmin: ", isEnding, err)
		isEndByAdmin <- isEnding // Send the result
		cancel()                 // Cancel the context to stop the subscription
	}

	if err = s.redisStore.Subscribe(ctx, handlerFunc, channelKey); err != nil {
		log.Println(err)
	}

}

func (s *StreamService) IsEndByAdminWithCloseChan(id uint, ctx context.Context, isEndByAdmin chan<- bool, closeChan <-chan bool) {
	var err error
	var isEnding bool
	ctx, cancel := context.WithCancel(ctx) // Create a cancellable context
	defer cancel()

	channelKey := fmt.Sprintf(cache.CHANNEL_END_LIVE, id)

	go func() {
		select {
		case <-closeChan: // If a signal is received on closeChan
			log.Println("Received close signal, cancelling context")
			cancel() // Cancel the context
		case <-ctx.Done(): // If the context is already cancelled
			return
		}
	}()

	handlerFunc := func(channel string, message string) {
		isEnding, err = cache.ParseAndCast[bool](message)
		if err != nil {
			log.Println("Failed to parse message:", err)
			return
		}
		log.Println("EndByAdmin: ", isEnding, err)
		isEndByAdmin <- isEnding // Send the result
		cancel()                 // Cancel the context to stop the subscription
	}

	if err = s.redisStore.Subscribe(ctx, handlerFunc, channelKey); err != nil {
		log.Println(err)
	}
}

func (s *StreamService) GetChannel(userId uint) (*dto.StreamChannelDto, error) {
	return s.repo.Stream.GetChannel(userId)
}

func (r *StreamService) CheckScheduledStreamExist(streamID uint) (bool, error) {
	return r.repo.Stream.CheckScheduledStreamExist(streamID)
}
