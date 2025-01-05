package handler

import (
	"github.com/labstack/echo/v4"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"net/http"
)

type subscribeHandler struct {
	r   *echo.Group
	srv *service.Service
}

func newSubscribeHandler(r *echo.Group, srv *service.Service) *subscribeHandler {
	subscribe := &subscribeHandler{
		r:   r,
		srv: srv,
	}

	subscribe.register()

	return subscribe
}

func (h *subscribeHandler) register() {
	group := h.r.Group("api/subscribe")

	group.POST("", h.subscribe)
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
