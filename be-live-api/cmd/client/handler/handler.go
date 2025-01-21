package handler

import (
	"context"
	"gitlab/live/be-live-api/service"
	"sync"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	r              *echo.Group
	srv            *service.Service
	mCtx           context.Context
	wsWG           *sync.WaitGroup
	wsNotification *wsNotificationPool
}

func NewHandler(r *echo.Group, srv *service.Service, ctx context.Context, wg *sync.WaitGroup) *Handler {
	return &Handler{
		r:              r,
		srv:            srv,
		mCtx:           ctx,
		wsWG:           wg,
		wsNotification: NewWSNotificationPool(),
	}
}

func (h *Handler) Register() {
	newAuthHandler(h.r, h.srv)
	newWsHandler(h.r, h.srv, h.mCtx, h.wsWG, h.wsNotification)
	newStreamHandler(h.r, h.srv)
	newUserHandler(h.r, h.srv)
	newCategoryHandler(h.r, h.srv)
	newSubscribeHandler(h.r, h.srv)
	newNotificationHandler(h.r, h.srv, h.wsNotification)
	// newUserInteractionHandler(h.r, h.srv)
}
