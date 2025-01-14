package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type streamHandler struct {
	Handler
	r                     *echo.Group
	srv                   *service.Service
	thumbnailFolder       string
	rtmpURL               string
	hlsURL                string
	liveFolder            string
	scheduledVideosFolder string
	videoFolder           string
	ApiURL                string
}

func newStreamHandler(r *echo.Group, srv *service.Service) *streamHandler {

	fileStorageConfig := conf.GetFileStorageConfig()
	streamConfig := conf.GetStreamServerConfig()

	stream := &streamHandler{
		r:                     r,
		srv:                   srv,
		thumbnailFolder:       fileStorageConfig.ThumbnailFolder,
		rtmpURL:               streamConfig.RTMPURL,
		hlsURL:                streamConfig.HLSURL,
		liveFolder:            fileStorageConfig.LiveFolder,
		scheduledVideosFolder: fileStorageConfig.ScheduledVideosFolder,
		videoFolder:           fileStorageConfig.VideoFolder,
		ApiURL:                conf.GetApiFileConfig().Url,
	}

	stream.register()

	return stream
}

func (h *streamHandler) register() {
	group := h.r.Group("api/streams")

	group.Use(h.JWTMiddleware())
	group.GET("/statistics", h.getLiveStreamStatisticsData)
	group.GET("/live-statistics", h.getLiveStatData)
	group.GET("/statistics/total", h.getTotalLiveStream)
	group.GET("", h.getLiveStreamWithPagination)
	group.GET("/:id", h.getLiveStreamBroadCastByID)
	group.POST("", h.createLiveStreamByAdmin)
	group.PATCH("/:id", h.updateLiveStreamByAdmin)
	group.PATCH("/:id/scheduled", h.updateScheduledStreamByAdmin)
	group.PATCH("/:id/change-thumbnail", h.updateThumbnailByAdmin)
	group.DELETE("/:id", h.deleteLiveStream)
	group.POST("/:id/end_live", h.endLiveStream)

}

func (h *streamHandler) deleteLiveStream(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	deletedStream, err := h.srv.Stream.GetLiveStreamByID(id)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if deletedStream == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	if deletedStream.Stream.Status == model.STARTED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("you can't delete stream while live"), nil)
	}

	filesToRemove := []string{}

	// remove thumbnail
	thumbnailPath := fmt.Sprintf("%s%s", h.thumbnailFolder, deletedStream.Stream.ThumbnailFileName)
	filesToRemove = append(filesToRemove, thumbnailPath)

	if deletedStream.Stream.Status == model.ENDED {
		isEncoding, err := h.srv.Stream.IsEncodingVideo(c.Request().Context(), deletedStream.Stream.StreamKey)
		if err != nil {
			return err
		}

		if isEncoding {
			return fmt.Errorf("you can't delete a stream while video is being encoded")
		}

		videoPath := utils.MakeVideoPath(h.videoFolder, deletedStream.Stream.StreamKey+".mp4")
		filesToRemove = append(filesToRemove, videoPath)

		liveVideoPath, err := utils.MakeLiveVideoPath(h.liveFolder, deletedStream.Stream.StreamKey)
		if err == nil {
			filesToRemove = append(filesToRemove, liveVideoPath)
		}

		if deletedStream.ScheduleStream != nil && deletedStream.ScheduleStream.ID != 0 {
			scheduledVideoPath := utils.MakeVideoPath(h.scheduledVideosFolder, deletedStream.ScheduleStream.VideoName)
			filesToRemove = append(filesToRemove, scheduledVideoPath)
		}

		// utils.RemoveFilesWithNoErrReturn(filesToRemove)

	}

	if deletedStream.Stream.Status == model.UPCOMING {
		if deletedStream.ScheduleStream != nil && deletedStream.ScheduleStream.ID != 0 {
			scheduledVideoPath := utils.MakeVideoPath(h.scheduledVideosFolder, deletedStream.ScheduleStream.VideoName)
			filesToRemove = append(filesToRemove, scheduledVideoPath)
		}
	}

	if err := h.srv.Stream.DeleteLiveStream(id); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	go utils.RemoveFilesWithNoErrReturn(filesToRemove)

	currentUser := c.Get("user").(*utils.Claims)
	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.DeleteStreamByAdmin, fmt.Sprintf("%s deleted stream id: %d, status: %s and stream_type: %s.", currentUser.Username, deletedStream.Stream.ID, deletedStream.Stream.Status, deletedStream.Stream.StreamType))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", nil)
}

func (h *streamHandler) getLiveStreamBroadCastByID(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	data, err := h.srv.Stream.GetLiveStreamBroadCastByID(id, h.ApiURL, h.rtmpURL, h.hlsURL)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

func (h *streamHandler) updateLiveStreamByAdmin(c echo.Context) error {
	var req dto.UpdateStreamRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	stream, err := h.srv.Stream.UpdateStreamByAdmin(id, &req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.UpdateStreamByAdmin, fmt.Sprintf("%s updated a stream with id %d and status %s.", currentUser.Username, stream.ID, stream.Status))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", map[string]any{
		"id":            stream.ID,
		"title":         stream.Title,
		"description":   stream.Description,
		"thumbnail_url": utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName),
	})
}

func (h *streamHandler) updateScheduledStreamByAdmin(c echo.Context) error {
	var req dto.UpdateScheduledStreamRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	if !utils.IsValidSchedule(req.ScheduledAt) {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid schedule"), nil)
	}

	// remove old scheduled stream video
	scheduleStream, err := h.srv.Stream.GetSechduleStreamByID(uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	oldScheduledVideoPath := fmt.Sprintf("%s%s", h.scheduledVideosFolder, scheduleStream.VideoName)

	currentUser := c.Get("user").(*utils.Claims)

	//save video
	video, err := c.FormFile("video")
	if err != nil && strings.Compare(err.Error(), "http: no such file") != 0 {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, fmt.Sprintf("upload video failed: %s", err.Error()))
	}

	var filesToRemove []string
	if video != nil {

		if video.Size > utils.MAX_VIDEO_SIZE {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Video size exceeds the 2GB limit")
		}

		isVideo, err := utils.IsVideoFile(video)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}

		if !isVideo {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not a supported video format"), nil)
		}

		fileVideoExt := utils.GetFileExtension(video)
		req.VideoFileName = fmt.Sprintf("%d_%s%s", currentUser.ID, utils.MakeUniqueIDWithTime(), fileVideoExt)
		videoPath := fmt.Sprintf("%s%s", h.scheduledVideosFolder, req.VideoFileName)

		filesToRemove := append(filesToRemove, videoPath)

		videoSrc, err := video.Open()
		if err != nil {
			go utils.RemoveFiles(filesToRemove)
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		defer videoSrc.Close()

		dstRecord, err := os.Create(videoPath)
		if err != nil {
			go utils.RemoveFiles(filesToRemove)
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		defer dstRecord.Close()

		if _, err = io.Copy(dstRecord, videoSrc); err != nil {
			go utils.RemoveFiles(filesToRemove)
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		//
	}

	// update stream
	if err := h.srv.Stream.UpdateScheduledStreamByAdmin(id, &req); err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if video != nil {
		go utils.RemoveFiles([]string{oldScheduledVideoPath})
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.UpdateScheduledStreamByAdmin, fmt.Sprintf("%s updated a scheduled stream with id %d.", currentUser.Username, scheduleStream.StreamID))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", nil)
}
func (h *streamHandler) updateThumbnailByAdmin(c echo.Context) error {
	var req dto.UpdateStreamThumbnailRequest

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	file, err := c.FormFile("thumbnail")
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, fmt.Sprintf("thumbnail field is required: %s", err.Error()))
	}

	stream, err := h.srv.Stream.GetStreamByID(uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)
	req.UpdatedByID = claims.ID

	isImage, err := utils.IsImage(file)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if !isImage {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not an image"), nil)
	}

	if file.Size > utils.MAX_IMAGE_SIZE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Image size exceeds the 1MB limit")
	}

	// save thumbnail
	fileExt := utils.GetFileExtension(file)
	req.ThumbnailFileName = fmt.Sprintf("%d_%s%s", req.UpdatedByID, utils.MakeUniqueIDWithTime(), fileExt)
	thumbnailPath := fmt.Sprintf("%s%s", h.thumbnailFolder, req.ThumbnailFileName)

	filesToRemove := []string{thumbnailPath}

	src, err := file.Open()
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	defer src.Close()

	dst, err := os.Create(thumbnailPath)
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	//delete the old thumbnail
	oldThumbnailPath := fmt.Sprintf("%s%s", h.thumbnailFolder, stream.ThumbnailFileName)
	oldThumbnailsToRemove := []string{oldThumbnailPath}

	err = h.srv.Stream.UpdateThumbnailStreamByAdmin(id, &req)
	if err != nil {
		// if update fails, remove newly created one
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	// if update success, remove old one
	go utils.RemoveFiles(oldThumbnailsToRemove)

	adminLog := h.srv.Admin.MakeAdminLogModel(claims.ID, model.UpdateThumbnailByAdmin, fmt.Sprintf("%s updated thumbnail of a stream %d.", claims.Username, stream.ID))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", nil)
}

func (h *streamHandler) createLiveStreamByAdmin(c echo.Context) error {
	var req dto.StreamRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	streamer, err := h.srv.User.CheckUserTypeByID(int(req.UserID))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if streamer == nil || streamer.Role.Type != model.STREAMER {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("user is not a streamer"), nil)
	}

	if !utils.IsValidSchedule(req.ScheduledAt) {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid schedule"), nil)
	}

	file, err := c.FormFile("thumbnail")
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, fmt.Sprintf("thumbnail field is required: %s", err.Error()))
	}

	claims := c.Get("user").(*utils.Claims)
	isImage, err := utils.IsImage(file)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if !isImage {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not an image"), nil)
	}

	if file.Size > utils.MAX_IMAGE_SIZE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Image size exceeds the 1MB limit")
	}
	// save thumbnail
	fileExt := utils.GetFileExtension(file)
	req.ThumbnailFileName = fmt.Sprintf("%d_%s%s", req.UserID, utils.MakeUniqueIDWithTime(), fileExt)
	thumbnailPath := fmt.Sprintf("%s%s", h.thumbnailFolder, req.ThumbnailFileName)

	filesToRemove := []string{thumbnailPath}

	src, err := file.Open()
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	defer src.Close()

	dst, err := os.Create(thumbnailPath)
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	//save recording
	video, err := c.FormFile("video")
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, fmt.Sprintf("video field is required: %s", err.Error()))
	}

	if video.Size > utils.MAX_VIDEO_SIZE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Video size exceeds the 2GB limit")
	}

	isVideo, err := utils.IsVideoFile(video)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if !isVideo {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not a supported video format"), nil)
	}

	fileVideoExt := utils.GetFileExtension(video)
	req.VideoFileName = fmt.Sprintf("%d_%s%s", req.UserID, utils.MakeUniqueIDWithTime(), fileVideoExt)
	videoPath := fmt.Sprintf("%s%s", h.scheduledVideosFolder, req.VideoFileName)

	filesToRemove = append(filesToRemove, videoPath)

	videoSrc, err := video.Open()
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer videoSrc.Close()

	dstRecord, err := os.Create(videoPath)
	if err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer dstRecord.Close()

	if _, err = io.Copy(dstRecord, videoSrc); err != nil {
		go utils.RemoveFiles(filesToRemove)
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	//

	stream, err := h.srv.Stream.CreateStreamByAdmin(&req)
	if err != nil {
		go utils.RemoveFiles(filesToRemove)

		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(req.UserID, model.ScheduledLiveStreamByAdmin, fmt.Sprintf("%s scheduled a live stream %d", claims.Username, stream.ID))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusCreated, "Successfully", map[string]any{
		"id":            stream.ID,
		"title":         stream.Title,
		"description":   stream.Description,
		"thumbnail_url": utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName),
	})
}

func (h *streamHandler) getTotalLiveStream(c echo.Context) error {

	data, err := h.srv.Stream.GetStatisticsTotalLiveStreamData()

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", data)
}

func (h *streamHandler) getLiveStreamStatisticsData(c echo.Context) error {

	var req dto.StatisticsQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	data, err := h.srv.Stream.GetStreamAnalyticsData(&req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", data)

}

func (h *streamHandler) getLiveStatData(c echo.Context) error {

	var req dto.LiveStatQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	data, err := h.srv.Stream.GetLiveStatWithPagination(&req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", data)

}

func (h *streamHandler) getLiveStreamWithPagination(c echo.Context) error {

	var req dto.LiveStreamBroadCastQueryDTO
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	data, err := h.srv.Stream.GetLiveStreamBroadCastWithPagination(req.Page, req.Limit, &req, h.ApiURL, h.rtmpURL, h.hlsURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Successfully", data)

}

func (h *streamHandler) endLiveStream(c echo.Context) error {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	stream, err := h.srv.Stream.GetStreamByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.STARTED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("you can't end a live stream which is not started"), nil)
	}

	isEndingLive, err := h.srv.Stream.IsEndingLive(c.Request().Context(), stream.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if isEndingLive {
		return utils.BuildSuccessResponse(c, http.StatusAccepted, "Stream is ending. Wait for a few minutes", nil)
	}
	if err := h.srv.Stream.EndLivByRedis(c.Request().Context(), stream.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.EndLiveStreamByAdmin, fmt.Sprintf("%s ended a live stream %d.", currentUser.Username, stream.ID))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Stream is ending. Wait for a few minutes", nil)
}
