package handler

import (
	"gitlab/live/be-live-api/service"
	"gitlab/live/be-live-api/utils"
	"net/http"

	"github.com/labstack/echo/v4"
)

type categoryHandler struct {
	Handler
	r   *echo.Group
	srv *service.Service
}

func newCategoryHandler(r *echo.Group, srv *service.Service) *categoryHandler {
	category := &categoryHandler{
		r:   r,
		srv: srv,
	}

	category.register()

	return category
}

func (h *categoryHandler) register() {
	group := h.r.Group("api/categories")

	group.Use(h.JWTMiddleware())
	group.Use(h.RoleGuardMiddleware())
	group.GET("", h.getAll)

}

func (h *categoryHandler) getAll(c echo.Context) error {

	data, err := h.srv.Category.GetAll()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}
