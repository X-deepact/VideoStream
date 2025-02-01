package handler

import (
	"errors"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

type adminHandler struct {
	Handler
	r      *echo.Group
	srv    *service.Service
	apiURL string
}

func newAdminHandler(r *echo.Group, srv *service.Service) *adminHandler {
	admin := &adminHandler{
		Handler: Handler{
			r:   r,
			srv: srv,
		},
		r:      r,
		srv:    srv,
		apiURL: conf.GetApiFileConfig().Url,
	}

	admin.register()

	return admin
}

func (h *adminHandler) register() {
	group := h.r.Group("api/admins")

	group.Use(h.JWTMiddleware())
	group.GET("/logs", h.getAdminLogs)
	group.GET("", h.getAdmins)
	group.GET("/:id", h.byId)
	group.GET("/actions", h.getAdminActions)

}

// @Summary      Get Admin by ID
// @Description  Get admin details by ID
// @Tags         Admin
// @Accept       json
// @Produce      json
// @Param        id   path      int  true  "Admin ID"
// @Success      200  {object}  dto.UserResponseDTO  "Admin details"
// @Failure      400         "Invalid ID parameter or not found"
// @Failure      500         "Internal Server Error"
// @Security     Bearer
// @Router       /api/admins/{id} [get]
func (h *adminHandler) byId(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	data, err := h.srv.Admin.ById(uint(id), h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if data == nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("not found"), nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary      Get Admins
// @Description  Get admin list
// @Tags         Admin
// @Accept       json
// @Produce      json
// @Success      200  {array}  dto.AdminResp  "Admins"
// @Failure      400         "Invalid request"
// @Failure      500         "Internal Server Error"
// @Security     Bearer
// @Router       /api/admins [get]
func (h *adminHandler) getAdmins(c echo.Context) error {

	data, err := h.srv.Admin.GetAdmins()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary      Get Admin Logs
// @Description  Get logs for the current admin
// @Tags         Admin
// @Accept       json
// @Produce      json
// @Param        adminLogQuery  query      dto.AdminLogQuery  true  "Admin Log Query"
// @Success      200 {object} utils.PaginationModel[dto.AdminLogRespDTO]  "Admin logs"
// @Failure      400                  "Bad Request"
// @Failure      500                  "Internal Server Error"
// @Security     Bearer
// @Router       /api/admins/logs [get]
func (h *adminHandler) getAdminLogs(c echo.Context) error {

	var req dto.AdminLogQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	if currentUser.RoleType == model.ADMINROLE {
		req.IsAdmin = true
	}
	req.UserID = currentUser.ID

	data, err := h.srv.Admin.GetAdminLogs(&req)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

// @Summary      Get Admin Actions
// @Description  Get actions for admin logs
// @Tags         Admin
// @Accept       json
// @Produce      json
// @Success      200 {array} string   "Admin actions"
// @Security     Bearer
// @Router       /api/admins/actions [get]
func (h *adminHandler) getAdminActions(c echo.Context) error {
	data, err := h.srv.Admin.GetAdminActions()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}
