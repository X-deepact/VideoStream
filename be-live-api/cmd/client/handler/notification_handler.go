package handler

import (
	"github.com/labstack/echo/v4"
	"gitlab/live/be-live-api/service"
	"net/http"
)

type notificationHandler struct {
	r      *echo.Group
	srv    *service.Service
	wsPool *wsNotificationPool
}

func newNotificationHandler(r *echo.Group, srv *service.Service, wsPool *wsNotificationPool) *notificationHandler {
	notification := &notificationHandler{
		r:      r,
		srv:    srv,
		wsPool: wsPool,
	}

	notification.register()

	return notification
}

func (h *notificationHandler) register() {
	group := h.r.Group("api/notification")

	group.GET("/test", h.sendMessage)
}

func (h *notificationHandler) sendMessage(c echo.Context) error {
	userID := uint(4)
	message := map[string]string{
		"content": "send you!!!",
	}

	err := h.wsPool.SendMessage(userID, message)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}

	return c.JSON(http.StatusOK, map[string]string{
		"status":  "success",
		"message": "Message sent successfully",
	})
}
