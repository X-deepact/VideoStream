package handler

import (
	"gitlab/live/be-live-api/service"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	r   *echo.Group
	srv *service.Service
}

func NewHandler(r *echo.Group, srv *service.Service) *Handler {
	return &Handler{
		r:   r,
		srv: srv,
	}
}

func (h *Handler) Register() {
	newAuthHandler(h.r, h.srv)
	newWsHandler(h.r, h.srv)
	newStreamHandler(h.r, h.srv)
	newUserHandler(h.r, h.srv)
	newUserInteractionHandler(h.r, h.srv)
}
