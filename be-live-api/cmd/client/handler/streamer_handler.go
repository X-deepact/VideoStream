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
	"time"

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
	AvatarFolder    string
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
		AvatarFolder:    fileStorageConfig.AvatarFolder,
	}
	stream.register()
	return stream
}

func (h *streamHandler) register() {
	group := h.r.Group("api/streams")

	// to stream videos of live recordings
	group.GET("", h.getStreams)
	group.GET("/:id", h.getStream)
	group.GET("/:id/comments", h.getComments)
	group.GET("/channel/:id", h.getChannel)

	// interact
	group.POST("/:id/create-comment", h.createComment)
	group.PUT("/update-comment", h.updateComment)
	group.DELETE("/delete-comment/:id", h.deleteComment)
	group.POST("/:id/add-view", h.addView)
	group.POST("/:id/like", h.actionLike)
	group.POST("/:id/bookmark", h.bookmark)
	group.DELETE("/:id/bookmark", h.deleteBookmark)
	group.POST("/:id/share", h.addShare)

	// middleware will come here
	group.Use(utils.JWTMiddlewareStreamer())
	group.POST("/start", h.initializeStream)
	group.PUT("/:id/update", h.update)
}

func (h *streamHandler) initializeStream(c echo.Context) error {
	// const maxHeaderSize = 2 << 20 // 2MB
	// c.Request().Body = http.MaxBytesReader(c.Response(), c.Request().Body, maxHeaderSize)
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

	if file.Size > utils.MaxImageSize {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file size exceeds the maximum allowed limit of 1MB"), nil)
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
	thumbnailPath := fmt.Sprintf("%s%s", h.thumbnailFolder, req.ThumbnailFileName)

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
		"push_url":      utils.MakePushURL(h.rtmpURL, stream.StreamToken.String),
		"broadcast_url": utils.MakeBroadcastURL(h.hlsURL, stream.StreamKey),
		"category_ids":  req.CategoryIDs,
	})

	// return c.NoContent(http.StatusOK)

}

// @Summary      Get Streams
// @Description  Fetch a list of streams with optional filters
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        page          query    int     false  "Page number"            default(1)
// @Param        limit         query    int     false  "Number of items per page" default(10)
// @Param        status        query    string  false  "Status of the stream"   default()
// @Param        title         query    string  false  "Title filter"
// @Param        category_ids  query    []int   false  "Category IDs"           collectionFormat(multi)
// @Param        is_me         query    bool    false  "Filter by user streams" default(nil)
// @Param        is_liked      query    bool    false  "Filter by liked streams" default(nil)
// @Param        is_history    query    bool    false  "Filter by history streams" default(nil)
// @Param        is_saved      query    bool    false  "Filter by saved streams" default(nil)
// @Param        streamer_id   query    int     false  "Filter by streamer"
// @Param        from_date     query    string  false  "Start date for filtering (yyyy-MM-dd)"
// @Param        to_date       query    string  false  "End date for filtering (yyyy-MM-dd)"
// @Security     BearerAuth
// @Success      200  {array}  dto.StreamDto
// @Failure      401  "Unauthorized"
// @Router       /api/streams [get]
func (h *streamHandler) getStreams(c echo.Context) error {
	var err error

	var req dto.StreamQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if req.FromDate != "" {
		fromDate, err := utils.ConvertStringToDate(req.FromDate)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		req.FromDateTime = &fromDate
	}

	if req.ToDate != "" {
		toDate, err := utils.ConvertStringToDate(req.ToDate)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		req.ToDateTime = &toDate
	}

	if req.Page <= 0 {
		req.Page = utils.DEFAULT_PAGE
	}

	if req.Limit <= 0 {
		req.Limit = utils.DEFAULT_LIMIT
	}

	claims := c.Get("user").(*utils.Claims)
	req.UserID = claims.ID

	pagination, err := h.srv.Stream.GetStreams(&req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	var newPage = new(utils.PaginationModel[dto.StreamDto])
	newPage.Page = utils.Map(pagination.Page, func(e dto.Stream) dto.StreamDto {
		thumbnailURL := ""
		avtURL := ""
		var views, duration uint
		var startedAt *time.Time

		if e.ThumbnailFileName != "" {
			thumbnailURL = utils.MakeThumbnailURL(h.ApiURL, e.ThumbnailFileName)
		}

		if e.Status == model.ENDED {
			if len(e.StreamAnalytics) > 0 {
				views = e.StreamAnalytics[0].Views
				duration = e.StreamAnalytics[0].Duration
			}

			e.Status = model.StreamStatus(dto.VIDEO)
		} else if e.Status == model.STARTED {
			e.Status = model.StreamStatus(dto.LIVE)
		}

		if e.User.AvatarFileName.String != "" {
			avtURL = utils.GetFileUrl(h.AvatarFolder, e.User.AvatarFileName.String)
		}

		if e.StartedAt.Valid {
			startedAt = &e.StartedAt.Time
		}

		resDto := dto.StreamDto{
			ID:            e.ID,
			Title:         e.Title,
			Status:        e.Status,
			ThumbnailURL:  thumbnailURL,
			StartedAt:     startedAt,
			UserID:        e.User.ID,
			DisplayName:   e.User.DisplayName,
			AvatarFileURL: avtURL,
			Views:         views,
			Duration:      duration,
			ScheduledAt:   e.ScheduledAt,
			IsSaved:       e.IsSaved,
		}

		return resDto
	})

	if req.IsHistory != nil && *req.IsHistory {
		newPage.BasePaginationModel = pagination.BasePaginationModel
		return utils.BuildSuccessResponse(c, http.StatusOK, newPage)
	}

	liveStreams := []dto.StreamDto{}
	upcomings := []dto.StreamDto{}
	videos := []dto.StreamDto{}

	for k, v := range newPage.Page {
		if v.Status == model.StreamStatus(dto.LIVE) {
			liveStreams = append(liveStreams, newPage.Page[k])
		} else if v.Status == model.UPCOMING {
			upcomings = append(upcomings, newPage.Page[k])
		} else {
			videos = append(videos, newPage.Page[k])
		}
	}

	newPage.Page = append(liveStreams, append(upcomings, videos...)...)
	newPage.BasePaginationModel = pagination.BasePaginationModel

	return utils.BuildSuccessResponse(c, http.StatusOK, newPage)
}

// @Summary      Get Stream Details
// @Description  Fetch detailed information of a specific stream by ID
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "Stream ID"
// @Security     BearerAuth
// @Success      200  {object}  dto.StreamDetailDto
// @Failure      401  "Unauthorized"
// @Router       /api/streams/{id} [get]
func (h *streamHandler) getStream(c echo.Context) error {
	streamID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(uint(streamID), claims.ID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusNotFound, err, nil)
		}

		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	thumbnailURL := ""
	broadcastURL := ""
	videoURL := ""
	avtURL := ""
	var likeInfo *dto.LikeInfo
	var categories []dto.CategoryDto
	var views, comments, duration, shares uint
	var isOwner, isSubscribed, isMute bool
	var startedAt *time.Time
	status := dto.UPCOMING

	if stream.ThumbnailFileName != "" {
		thumbnailURL = utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName)
	}

	if stream.Status == model.PENDINGSOFTWARE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("streamer is not live yet"), nil)
	}

	if stream.Status == model.ENDED {
		if len(stream.StreamAnalytics) > 0 {
			views = stream.StreamAnalytics[0].Views
			comments = stream.StreamAnalytics[0].Comments
			duration = stream.StreamAnalytics[0].Duration
			shares = stream.StreamAnalytics[0].Shares
		}

		status = dto.VIDEO
		videoURL = utils.MakeVideoURL(h.ApiURL, stream.StreamKey)
	} else if stream.Status == model.STARTED {
		status = dto.LIVE
		broadcastURL = utils.MakeBroadcastURL(h.hlsURL, stream.StreamKey)

		countView, err := h.srv.Interaction.CountViewsByStreamLive(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		views = uint(countView)

		countComment, err := h.srv.Interaction.CountCommentsByStreamID(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		comments = uint(countComment)

		countShare, err := h.srv.Interaction.CountSharesByStreamID(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		shares = uint(countShare)
	} else {
		countView, err := h.srv.Interaction.CountViewsByStream(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		views = uint(countView)

		countComment, err := h.srv.Interaction.CountCommentsByStreamID(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		comments = uint(countComment)

		countShare, err := h.srv.Interaction.CountSharesByStreamID(stream.ID)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		shares = uint(countShare)
	}

	subscriptions, err := h.srv.Subscribe.GetSubscriptionCount(stream.UserID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.User.AvatarFileName.String != "" {
		avtURL = utils.GetFileUrl(h.AvatarFolder, stream.User.AvatarFileName.String)
	}

	likeInfo, err = h.srv.Interaction.GetLikeInfo(stream.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	currentLikeType, _ := h.srv.Interaction.GetCurrentLikeEmoteType(claims.ID, stream.ID)

	if len(stream.Categories) > 0 {
		for _, category := range stream.Categories {
			categories = append(categories, dto.CategoryDto{
				ID:   category.ID,
				Name: category.Name,
			})
		}
	}

	isOwner = claims.ID == stream.UserID

	if !isOwner {
		subscription, _ := h.srv.Subscribe.GetSubscription(stream.UserID, claims.ID)

		if subscription != nil {
			isSubscribed = true
			isMute = subscription.IsMute
		}
	}

	if stream.StartedAt.Valid {
		startedAt = &stream.StartedAt.Time
	}

	streamDetailDto := dto.StreamDetailDto{
		ID:              stream.ID,
		Title:           stream.Title,
		Description:     stream.Description,
		ThumbnailURL:    thumbnailURL,
		VideoURL:        videoURL,
		BroadcastURL:    broadcastURL,
		Status:          status,
		CreatedAt:       stream.CreatedAt,
		StartedAt:       startedAt,
		UserID:          stream.User.ID,
		DisplayName:     stream.User.DisplayName,
		AvatarFileURL:   avtURL,
		Subscriptions:   uint(subscriptions),
		LikeInfo:        likeInfo,
		CurrentLikeType: currentLikeType,
		IsCurrentLike:   currentLikeType != nil,
		IsOwner:         isOwner,
		IsSubscribed:    isSubscribed,
		Views:           views,
		Comments:        comments,
		Shares:          shares,
		Duration:        duration,
		Categories:      categories,
		ScheduledAt:     stream.ScheduledAt,
		IsSaved:         stream.IsSaved,
		IsMute:          isMute,
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, streamDetailDto)
}

func (h *streamHandler) addView(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(streamID, claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("stream not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.ENDED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("this isn't a video, you can't add views"), nil)
	}

	view, rowsAffected, err := h.srv.Interaction.AddViewForRecord(streamID, claims.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if rowsAffected == 1 {
		if err := h.srv.Interaction.UpdateStreamAnalyticsView(streamID); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	} else {
		if err := h.srv.Interaction.UpdateViewForRecord(view); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, map[string]interface{}{
		"is_added": rowsAffected > 0,
	})
}

func (h *streamHandler) actionLike(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(streamID, claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("stream not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.ENDED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("this isn't a video, you can't react"), nil)
	}

	var like dto.LiveLike
	if err := utils.BindAndValidate(c, &like); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	pLike, err := h.srv.Interaction.GetLike(streamID, claims.ID)
	isUpdate := false
	if like.LikeStatus {
		// check like exists
		if err != nil {
			if !errors.Is(err, gorm.ErrRecordNotFound) {
				return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
			} else {
				likeM := model.Like{
					UserID:    claims.ID,
					StreamID:  streamID,
					LikeEmote: like.LikeType,
				}

				if err = h.srv.Interaction.CreateLike(&likeM); err != nil {
					return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
				}

				isUpdate = true
			}
		} else {
			if pLike.LikeEmote != like.LikeType {
				isUpdate = true
			}

			// update
			pLike.LikeEmote = like.LikeType
			if err = h.srv.Interaction.UpdateLike(pLike); err != nil {
				return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
			}
		}
	} else {
		if pLike == nil {
			likeInfo, err := h.srv.Interaction.GetLikeInfo(streamID)
			if err != nil {
				return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
			}

			return utils.BuildSuccessResponse(c, http.StatusOK, likeInfo)
		}

		if err = h.srv.Interaction.DeleteLike(streamID, claims.ID); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		isUpdate = true
	}

	if isUpdate {
		if err = h.srv.Interaction.UpdateStreamAnalyticsLike(streamID); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	likeInfo, err := h.srv.Interaction.GetLikeInfo(streamID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, likeInfo)
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

	claims := c.Get("user").(*utils.Claims)

	data, err := h.srv.Stream.GetComments(uint(streamId), claims.ID, page, limit)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponse(c, http.StatusOK, data)
}

func (h *streamHandler) createComment(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	var comment dto.LiveComment
	if err := utils.BindAndValidate(c, &comment); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	commentM := model.Comment{
		UserID:   claims.ID,
		StreamID: streamID,
		Comment:  comment.Content,
	}

	if err := h.srv.Interaction.CreateComment(&commentM); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if err := h.srv.Interaction.UpdateStreamAnalyticsComment(streamID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	commentInfo, err := h.srv.Interaction.GetCommentInfoByCommentID(commentM.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.LiveCommentDto{
		ID:          commentInfo.ID,
		DisplayName: commentInfo.DisplayName,
		AvatarURL:   commentInfo.AvatarURL,
		Content:     commentInfo.Content,
		CreatedAt:   commentInfo.CreatedAt,
		IsEdited:    false,
		IsMe:        true,
	})
}

func (h *streamHandler) updateComment(c echo.Context) error {
	var req dto.UpdateCommentRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	comment, err := h.srv.Interaction.GetComment(req.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("comment not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if claims.ID != comment.UserID {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("not authorized"), nil)
	}

	comment.Comment = req.Content

	err = h.srv.Interaction.UpdateComment(comment)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	commentInfo, err := h.srv.Interaction.GetCommentInfoByCommentID(comment.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.LiveCommentDto{
		ID:          commentInfo.ID,
		DisplayName: commentInfo.DisplayName,
		AvatarURL:   commentInfo.AvatarURL,
		Content:     commentInfo.Content,
		CreatedAt:   commentInfo.CreatedAt,
		IsEdited:    true,
		IsMe:        true,
	})
}

func (h *streamHandler) deleteComment(c echo.Context) error {
	commentID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	claims := c.Get("user").(*utils.Claims)

	comment, err := h.srv.Interaction.GetComment(uint(commentID))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("comment not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if claims.ID != comment.UserID {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("not authorized"), nil)
	}

	if err = h.srv.Interaction.DeleteComment(comment.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if err := h.srv.Interaction.UpdateStreamAnalyticsComment(comment.StreamID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

func (h *streamHandler) update(c echo.Context) error {
	var req dto.UpdateRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	claims := c.Get("user").(*utils.Claims)
	streamID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	stream, err := h.srv.Stream.GetStreamByID(uint(streamID))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if claims.ID != stream.UserID {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("not authorized"), nil)
	}

	stream.Title = req.Title
	stream.Description = req.Description

	file, _ := c.FormFile("thumbnail")
	if file != nil {
		status, fileName, err := utils.SaveImage(c, file, h.thumbnailFolder)

		if status != http.StatusOK {
			return err
		}

		stream.ThumbnailFileName = fileName
	}

	if err = h.srv.Stream.UpdateStreamAndStreamCategory(stream, req.CategoryIDs); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, map[string]any{
		"id":            stream.ID,
		"title":         stream.Title,
		"description":   stream.Description,
		"thumbnail_url": utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName),
		"push_url":      utils.MakePushURL(h.rtmpURL, stream.StreamToken.String),
		"broadcast_url": utils.MakeBroadcastURL(h.hlsURL, stream.StreamKey),
		"category_ids":  req.CategoryIDs,
	})
}

// @Summary      Bookmark stream
// @Description  Bookmark stream by ID
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "ID stream"
// @Security     BearerAuth
// @Success      200  {object}  nil
// @Failure 	 401  "Unauthorized"
// @Router       /api/streams/{id}/bookmark [post]
func (h *streamHandler) bookmark(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(streamID, claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("stream not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.ENDED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("this isn't a video, you can't save"), nil)
	}

	if err := h.srv.Interaction.Bookmark(streamID, claims.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

// @Summary      Remove the bookmark stream
// @Description  Remove the bookmark stream by ID
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "ID stream"
// @Security     BearerAuth
// @Success      200  {object}  nil
// @Failure 	 401  "Unauthorized"
// @Router       /api/streams/{id}/bookmark [delete]
func (h *streamHandler) deleteBookmark(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(streamID, claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("stream not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.ENDED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("this isn't a video, you can't delete"), nil)
	}

	if err := h.srv.Interaction.DeleteBookmark(streamID, claims.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

// @Summary      Add Share
// @Description  User adds 1 share
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "ID stream"
// @Security     BearerAuth
// @Success      200  {object}  dto.StreamAddShareResponse
// @Failure 	 401  "Unauthorized"
// @Router       /api/streams/{id}/share [post]
func (h *streamHandler) addShare(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	stream, err := h.srv.Stream.GetStream(streamID, claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("stream not found"), nil)
		}
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if stream.Status != model.ENDED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("this isn't a video, you can't add shares"), nil)
	}

	rowsAffected, err := h.srv.Interaction.AddShare(&model.Share{
		UserID:   claims.ID,
		StreamID: streamID,
	})
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if rowsAffected == 1 {
		if err := h.srv.Interaction.UpdateStreamAnalyticsShare(streamID); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.StreamAddShareResponse{
		IsAdded: rowsAffected > 0,
	})
}

// @Summary      Get Channel
// @Description  Get channel insights and statistics
// @Tags         Stream
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "ID streamer"
// @Security     BearerAuth
// @Success      200  {object}  dto.StreamChannelDto
// @Failure 	 401  "Unauthorized"
// @Router       /api/streams/channel/{id} [get]
func (h *streamHandler) getChannel(c echo.Context) error {
	strID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}
	streamerID := uint(strID)

	claims := c.Get("user").(*utils.Claims)

	user, err := h.srv.User.GetUser(streamerID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if user.Role.Type != model.STREAMER {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("this isn't a streamer"), nil)
	}

	channel, err := h.srv.Stream.GetChannel(streamerID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	channel.ID = user.ID
	channel.StreamerName = user.DisplayName
	channel.CreatedAt = user.CreatedAt
	channel.IsMe = claims.ID == user.ID

	if !channel.IsMe {
		subscription, err := h.srv.Subscribe.GetSubscription(streamerID, claims.ID)
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		if subscription != nil {
			channel.IsSubscribed = true
			channel.IsMute = subscription.IsMute
		}
	}

	if user.AvatarFileName.Valid {
		channel.StreamerAvatarURL = utils.GetFileUrl(h.AvatarFolder, user.AvatarFileName.String)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, channel)
}
