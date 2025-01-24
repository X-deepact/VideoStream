package handler

import (
	"errors"
	"github.com/labstack/echo/v4"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"net/http"
)

type subscribeHandler struct {
	r            *echo.Group
	srv          *service.Service
	AvatarFolder string
}

func newSubscribeHandler(r *echo.Group, srv *service.Service) *subscribeHandler {
	fileStorageConfig := conf.GetFileStorageConfig()

	subscribe := &subscribeHandler{
		r:            r,
		srv:          srv,
		AvatarFolder: fileStorageConfig.AvatarFolder,
	}

	subscribe.register()

	return subscribe
}

func (h *subscribeHandler) register() {
	group := h.r.Group("api/subscribe")

	group.POST("", h.subscribe)
	group.GET("/list", h.getSubscribes)
	group.PUT("/mute", h.mute)
}

func (h *subscribeHandler) subscribe(c echo.Context) error {
	var subscribe dto.SubscribeRequest
	if err := utils.BindAndValidate(c, &subscribe); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	subscribeM := &model.Subscription{
		SubscriberID: claims.ID,
		StreamerID:   subscribe.StreamerID,
	}

	rowsAffected, err := h.srv.Subscribe.Subscribe(subscribeM)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if rowsAffected == 0 {
		if err := h.srv.Subscribe.Unsubscribe(subscribeM); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}

// @Summary      Get Subscribes
// @Description  Fetch a list of subscribes with optional filters
// @Tags         Subscribe
// @Accept       json
// @Produce      json
// @Param        page          query    int     false  "Page number"            default(1)
// @Param        limit         query    int     false  "Number of items per page" default(10)
// @Security     BearerAuth
// @Success      200  {array}  dto.SubscribeDto
// @Failure      401  "Unauthorized"
// @Router       /api/subscribe/list [get]
func (h *subscribeHandler) getSubscribes(c echo.Context) error {
	var req dto.SubscribeQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if req.Page <= 0 {
		req.Page = utils.DEFAULT_PAGE
	}

	if req.Limit <= 0 {
		req.Limit = utils.DEFAULT_LIMIT
	}

	claims := c.Get("user").(*utils.Claims)
	req.UserID = claims.ID

	pagination, err := h.srv.Subscribe.GetSubscribes(&req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	var newPage = new(utils.PaginationModel[dto.SubscribeDto])
	newPage.BasePaginationModel = pagination.BasePaginationModel
	newPage.Page = utils.Map(pagination.Page, func(e dto.Subscription) dto.SubscribeDto {
		avtURL := ""
		if e.Streamer.AvatarFileName.String != "" {
			avtURL = utils.GetFileUrl(h.AvatarFolder, e.Streamer.AvatarFileName.String)
		}

		return dto.SubscribeDto{
			ID:                e.ID,
			StreamerID:        e.Streamer.ID,
			StreamerName:      e.Streamer.DisplayName,
			StreamerAvatarURL: avtURL,
			NumSubscribed:     e.NumSubscribed,
			NumVideo:          e.NumVideo,
			IsMute:            e.IsMute,
		}
	})

	return utils.BuildSuccessResponse(c, http.StatusOK, newPage)
}

// @Summary Mute
// @Description Mute subscriber notifications
// @Tags Subscribe
// @Accept json
// @Produce json
// @Param mute body dto.SubscribeMuteRequest true "Mute subscriber notifications"
// @Security     BearerAuth
// @Success 200 {object} dto.SubscribeMuteResponse
// @Failure 400  "Invalid request"
// @Router /api/subscribe/mute [put]
func (h *subscribeHandler) mute(c echo.Context) error {
	var mute dto.SubscribeMuteRequest
	if err := utils.BindAndValidate(c, &mute); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	subscription, err := h.srv.Subscribe.GetSubscription(mute.StreamerID, claims.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if subscription == nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("you have not subscribed to the above channel, you can't update"), nil)
	}

	subscription.IsMute = mute.IsMute
	if err := h.srv.Subscribe.Update(subscription); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.SubscribeMuteResponse{
		IsMute: subscription.IsMute,
	})
}
