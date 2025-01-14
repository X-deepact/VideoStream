package handler

import (
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
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
	group.GET("", h.getAll)
	group.POST("", h.create)
}

func (h *categoryHandler) getAll(c echo.Context) error {

	data, err := h.srv.Category.GetAll()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

func (h *categoryHandler) create(c echo.Context) error {

	var err error
	var req dto.CategoryRequestDTO

	if err = utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	currentUser := c.Get("user").(*utils.Claims)

	req.CreatedByID = currentUser.ID

	if err = h.srv.Category.CreateCategory(&req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(req.CreatedByID, model.CreateCategory, fmt.Sprintf("%s created a category with name %s.", currentUser.Username, req.Name))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusCreated, nil)

}
