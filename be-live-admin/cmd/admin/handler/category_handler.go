package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type categoryHandler struct {
	Handler
	r   *echo.Group
	srv *service.Service
}

func newCategoryHandler(r *echo.Group, srv *service.Service) *categoryHandler {
	category := &categoryHandler{
		Handler: Handler{
			r:   r,
			srv: srv,
		},
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
	group.PUT("/:id", h.update)
	group.DELETE("/:id", h.delete)
}

// @Summary Get all categories
// @Description Get a list of all categories
// @Tags Categories
// @Accept  json
// @Produce  json
// @Param request query dto.CategoryQueryDTO true "Category Query"
// @Success 200 {object} utils.PaginationModel[dto.CategoryRespDto]
// @Failure 400 "Invalid request"
// @Failure 500 "Internal Server Error"
// @Security Bearer
// @Router /api/categories [get]
func (h *categoryHandler) getAll(c echo.Context) error {

	var err error
	var req dto.CategoryQueryDTO

	if err = utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	data, err := h.srv.Category.GetAll(&req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary Create a new category
// @Description Create a new category
// @Tags Categories
// @Accept  json
// @Produce  json
// @Param request body dto.CategoryRequestDTO true "Category Request"
// @Success 201 "Successfully"
// @Failure 400 "Invalid request"
// @Failure 500 "Internal Server Error"
// @Security Bearer
// @Router /api/categories [post]
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

// @Summary Update a category
// @Description Update a category by ID
// @Tags Categories
// @Accept  json
// @Produce  json
// @Param id path int true "Category ID"
// @Param request body dto.CategoryUpdateRequestDTO true "Category Update Request"
// @Success 200 {object} dto.CategoryRespDto
// @Failure 400 "Invalid ID parameter"
// @Failure 500 "Internal Server Error"
// @Security Bearer
// @Router /api/categories/{id} [put]
func (h *categoryHandler) update(c echo.Context) error {

	var err error
	var req dto.CategoryUpdateRequestDTO
	var id int

	if c.Param("id") != "" {
		id, err = strconv.Atoi(c.Param("id"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
		}
	}

	if err = utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	currentUser := c.Get("user").(*utils.Claims)

	req.UpdatedByID = currentUser.ID

	data, err := h.srv.Category.UpdateCategory(uint(id), &req)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.UpdateCategory, fmt.Sprintf("%s update a category with name %s.", currentUser.Username, req.Name))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary Delete a category
// @Description Delete a category by ID
// @Tags Categories
// @Accept  json
// @Produce  json
// @Param id path int true "Category ID"
// @Success 200 "Successfully"
// @Failure 400 "Invalid ID parameter"
// @Failure 500 "Internal Server Error"
// @Security Bearer
// @Router /api/categories/{id} [delete]
func (h *categoryHandler) delete(c echo.Context) error {
	var err error
	var id int

	if c.Param("id") != "" {
		id, err = strconv.Atoi(c.Param("id"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
		}
	}

	currentUser := c.Get("user").(*utils.Claims)

	if err = h.srv.Category.DeleteCategory(uint(id)); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.DeleteCategory, fmt.Sprintf("%s delete category %d", currentUser.Username, id))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, nil)

}
