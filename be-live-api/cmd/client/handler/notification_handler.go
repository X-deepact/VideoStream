package handler

import (
	"database/sql"
	"errors"
	"github.com/labstack/echo/v4"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/cron"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type notificationHandler struct {
	r             *echo.Group
	srv           *service.Service
	wsPool        *wsNotificationPool
	avatarFolder  string
	ApiURL        string
	wsInteraction *ConnectionPool
}

func newNotificationHandler(r *echo.Group, srv *service.Service, wsPool *wsNotificationPool, wsInteraction *ConnectionPool) *notificationHandler {
	fileStorageCfg := conf.GetFileStorageConfig()
	notification := &notificationHandler{
		r:             r,
		srv:           srv,
		wsPool:        wsPool,
		avatarFolder:  fileStorageCfg.AvatarFolder,
		ApiURL:        conf.GetApiFileConfig().Url,
		wsInteraction: wsInteraction,
	}

	notification.register()

	return notification
}

func (h *notificationHandler) register() {
	group := h.r.Group("api/notification")

	group.GET("/num", h.getNumNotification)
	group.PUT("/reset-num", h.resetNumNotification)
	group.GET("/list", h.getNotifications)
	group.PUT("/:id/read", h.readNotification)
	group.PUT("/:id/hidden", h.hiddenNotification)

	// middleware will come here
	group.Use(utils.JWTMiddlewareAdmin())
	group.POST("/blocked-deleted", h.sendMessageBlockedDeleted)
	group.POST("/end-stream", h.adminEndStream)
}

func (h *notificationHandler) sendMessageBlockedDeleted(c echo.Context) error {
	var req dto.NotificationBlockedDeletedRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	content := ""
	if req.Type == model.NotificationTypeBlocked {
		content = "Your account has been blocked. Please contact the administrator."
	} else {
		content = "Your account has been deleted. Please contact the administrator."
	}

	message := dto.NotificationDto{
		Content:   content,
		Type:      req.Type,
		CreatedAt: time.Now(),
		IsRead:    false,
	}

	err := h.wsPool.SendMessage(req.UserID, message)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

func (h *notificationHandler) adminEndStream(c echo.Context) error {
	var req dto.AdminEndStreamRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	exist, err := h.srv.Stream.CheckScheduledStreamExist(req.StreamID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if exist {
		cron.StopStream(req.StreamID)
	}

	endMessage := dto.LiveEndDto{
		Type: dto.LiveEndType,
	}

	h.wsInteraction.BroadcastJSON(req.StreamID, &endMessage)

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

// @Summary      Get Num-Notification
// @Description  Get the number of notifications
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object} dto.NotificationNumResponse
// @Failure 	 401  "Unauthorized"
// @Router       /api/notification/num [get]
func (h *notificationHandler) getNumNotification(c echo.Context) error {
	claims := c.Get("user").(*utils.Claims)
	user, err := h.srv.User.GetUserLogin(claims.Username)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get user information"), nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.NotificationNumResponse{
		Num: user.NumNotification,
	})
}

// @Summary      Reset Num-Notification
// @Description  Reset the number of notifications
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Success      200  {object}  dto.NotificationNumResponse
// @Failure 	 401  "Unauthorized"
// @Router       /api/notification/reset-num [put]
func (h *notificationHandler) resetNumNotification(c echo.Context) error {
	claims := c.Get("user").(*utils.Claims)
	user, err := h.srv.User.GetUserLogin(claims.Username)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get user information"), nil)
	}

	user.NumNotification = 0
	if err := h.srv.User.UpdateUser(user); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.NotificationNumResponse{
		Num: user.NumNotification,
	})
}

// @Summary      Get Notifications
// @Description  Get notification list
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        page   query   int    true  "Page number"
// @Param        limit  query   int    true  "Number of items per page"
// @Success      200  {array} dto.NotificationDto
// @Failure 	 401  "Unauthorized"
// @Router       /api/notification/list [get]
func (h *notificationHandler) getNotifications(c echo.Context) error {
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

	claims := c.Get("user").(*utils.Claims)

	pagination, err := h.srv.Notification.GetNotifications(claims.ID, page, limit)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	var newPage = new(utils.PaginationModel[dto.NotificationDto])

	newPage.Page = utils.Map(pagination.Page, func(e dto.Notification) dto.NotificationDto {
		avtURL := ""
		thumbnailURL := ""
		if e.Stream.User.AvatarFileName.String != "" {
			avtURL = utils.GetFileUrl(h.avatarFolder, e.Stream.User.AvatarFileName.String)
		}

		if e.Type == model.NotificationTypeSubscribeLive ||
			e.Type == model.NotificationTypeSubscribeVideo {
			if e.Stream.ThumbnailFileName != "" {
				thumbnailURL = utils.MakeThumbnailURL(h.ApiURL, e.Stream.ThumbnailFileName)
			}

			e.Content = strings.ReplaceAll(e.Content, "{{streamer_name}}", e.Stream.User.DisplayName)
			e.Content = strings.ReplaceAll(e.Content, "{{stream_title}}", e.Stream.Title)
		}

		return dto.NotificationDto{
			ID:           e.ID,
			AvatarURL:    avtURL,
			Content:      e.Content,
			ThumbnailURL: thumbnailURL,
			StreamID:     e.StreamID,
			Type:         e.Type,
			CreatedAt:    e.CreatedAt,
			IsRead:       e.ReadAt.Valid,
			StreamerID:   e.StreamerID,
			IsMute:       e.IsMute,
		}
	})
	newPage.BasePaginationModel = pagination.BasePaginationModel

	return utils.BuildSuccessResponse(c, http.StatusOK, newPage)
}

// @Summary      Read Notification
// @Description  Update notification has been read by NotificationID
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "Notification ID"
// @Security     BearerAuth
// @Success      200  {object}  dto.NotificationReadResponse
// @Failure      401  "Unauthorized"
// @Router       /api/notification/{id}/read [put]
func (h *notificationHandler) readNotification(c echo.Context) error {
	notificationID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	notification, err := h.srv.Notification.GetNotification(uint(notificationID))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)
	if notification.UserID != claims.ID {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("not authorized"), nil)
	}

	notification.ReadAt = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	if err := h.srv.Notification.Update(notification); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.NotificationReadResponse{
		IsRead: notification.ReadAt.Valid,
	})
}

// @Summary      Hidden Notification
// @Description  Update notification has been hidden by NotificationID
// @Tags         Notification
// @Accept       json
// @Produce      json
// @Param        id   path      int     true  "Notification ID"
// @Security     BearerAuth
// @Success      200  {object}  nil
// @Failure      401  "Unauthorized"
// @Router       /api/notification/{id}/hidden [put]
func (h *notificationHandler) hiddenNotification(c echo.Context) error {
	notificationID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	notification, err := h.srv.Notification.GetNotification(uint(notificationID))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)
	if notification.UserID != claims.ID {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("not authorized"), nil)
	}

	notification.HiddenAt = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	if err := h.srv.Notification.Update(notification); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}
