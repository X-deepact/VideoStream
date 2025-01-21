package handler

import (
	"github.com/labstack/echo/v4"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"net/http"
)

type categoryHandler struct {
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
	group := h.r.Group("api/category")

	group.GET("/list", h.GetCategories)
}

func (h *categoryHandler) GetCategories(c echo.Context) error {
	categories, err := h.srv.Category.GetCategories()

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK,
		utils.Map(categories, func(e *model.Category) dto.CategoryDto {
			return dto.CategoryDto{
				ID:   e.ID,
				Name: e.Name,
			}
		}))
}
