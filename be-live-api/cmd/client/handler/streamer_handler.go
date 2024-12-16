package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type streamHandler struct {
	r               *echo.Group
	srv             *service.Service
	thumbnailFolder string
	rtmpURL         string
	hlsURL          string
	liveFolder      string
	ApiURL          string
}

func newStreamHandler(r *echo.Group, srv *service.Service) *streamHandler {
	fileStorageConfig := conf.GetFileStorageConfig()
	streamConfig := conf.GetStreamServerConfig()

	stream := &streamHandler{
		r:               r,
		srv:             srv,
		thumbnailFolder: fileStorageConfig.ThumbnailFolder,
		rtmpURL:         streamConfig.RTMPURL,
		hlsURL:          streamConfig.HLSURL,
		liveFolder:      fileStorageConfig.LiveFolder,
		ApiURL:          conf.GetApiFileConfig().Url,
	}
	stream.register()
	return stream
}

func (h *streamHandler) register() {
	group := h.r.Group("api/streams")

	// to stream videos of live recordings
	group.GET("/videos/:id", h.streamRecording)
	group.GET("/:id/get-comment", h.getComments)
	group.POST("/:id/create-comment", h.createComment)

	// middleware will come here
	group.Use(utils.JWTMiddlewareStreamer())
	group.POST("/start", h.initializeStream)
}

func (h *streamHandler) initializeStream(c echo.Context) error {
	claims := c.Get("user").(*utils.Claims)

	var req dto.StreamRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	req.UserID = claims.ID

	file, err := c.FormFile("thumbnail")
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, fmt.Sprintf("thumbnail field is required: %s", err.Error()))
	}

	isImage, err := utils.IsImage(file)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if !isImage {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not an image"), nil)
	}

	// save thumbnail
	fileExt := utils.GetFileExtension(file)
	req.ThumbnailFileName = fmt.Sprintf("%d_%s%s", req.UserID, utils.MakeUniqueIDWithTime(), fileExt)
	thumbnailPath := fmt.Sprintf("%s/%s", h.thumbnailFolder, req.ThumbnailFileName)

	src, err := file.Open()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer src.Close()

	dst, err := os.Create(thumbnailPath)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		if err := os.Remove(thumbnailPath); err != nil {
			log.Println(err)
		}
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	stream, err := h.srv.Stream.CreateStream(&req)
	if err != nil {
		if err := os.Remove(thumbnailPath); err != nil {
			log.Println(err)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, map[string]any{
		"id":            stream.ID,
		"title":         stream.Title,
		"description":   stream.Description,
		"thumbnail_url": utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName),
		"push_url":      utils.MakePushURL(h.rtmpURL, stream.StreamToken),
		"broadcast_url": utils.MakeBroadcastURL(h.hlsURL, stream.StreamKey),
	})

	// return c.NoContent(http.StatusOK)

}

// might have to change with range header
func (h *streamHandler) streamRecording(c echo.Context) error {

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return err
	}

	stream, err := h.srv.Stream.GetStreamByIDAndStatus(uint(id), model.ENDED)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusNotFound, fmt.Errorf("stream with id %d not found", id), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	videoPathPattern := fmt.Sprintf("%s%s_*.flv", h.liveFolder, stream.StreamKey)

	videoPath, err := utils.GetFilePath(videoPathPattern)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	file, err := os.Open(videoPath)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not open FLV file"})
	}
	defer file.Close()

	// Get the file size
	fileSize, err := utils.GetfileSize(videoPath)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not get file size"})
	}

	// Set the response headers
	c.Response().Header().Set("Content-Type", "video/x-flv")
	c.Response().Header().Set("Content-Length", fmt.Sprintf("%d", fileSize))

	// Stream the file
	_, err = io.Copy(c.Response(), file)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Could not stream FLV file"})
	}

	return nil

}

func (h *streamHandler) getComments(c echo.Context) error {
	var page, limit int
	var err error

	page = utils.DEFAULT_PAGE
	limit = utils.DEFAULT_LIMIT

	if c.QueryParam("page") != "" {
		page, err = strconv.Atoi(c.QueryParam("page"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid page parameter"), nil)
		}
	}

	if c.QueryParam("limit") != "" {
		limit, err = strconv.Atoi(c.QueryParam("limit"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid limit parameter"), nil)
		}
	}

	streamId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	data, err := h.srv.Stream.GetComments(uint(streamId), page, limit)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponse(c, http.StatusOK, data)
}

func (h *streamHandler) createComment(c echo.Context) error {
	idStr := c.Param("id")
	streamID, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return err
	}

	var comment dto.LiveComment
	if err := utils.BindAndValidate(c, &comment); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	commentM := model.Comment{
		UserID:   claims.ID,
		StreamID: uint(streamID),
		Comment:  comment.Content,
	}

	err = h.srv.Interaction.CreateComment(&commentM)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}
