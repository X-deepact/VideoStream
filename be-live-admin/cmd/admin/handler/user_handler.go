package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/service"
	"gitlab/live/be-live-api/utils"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

type userHandler struct {
	Handler
	r            *echo.Group
	srv          *service.Service
	avatarFolder string
	apiURL       string
}

func newUserHandler(r *echo.Group, srv *service.Service) *userHandler {
	fileStorageConfig := conf.GetFileStorageConfig()
	apiURL := conf.GetApiFileConfig().Url
	user := &userHandler{
		r:            r,
		srv:          srv,
		avatarFolder: fileStorageConfig.AvatarFolder,
		apiURL:       apiURL,
	}

	user.register()

	return user
}

func (h *userHandler) register() {
	group := h.r.Group("api/users")

	group.Use(h.JWTMiddleware())
	group.Use(h.RoleGuardMiddleware())
	group.GET("", h.page)
	group.POST("", h.createUser)
	group.PUT("/:id", h.updateUser)
	group.GET("/:id", h.byId)
	group.DELETE("/:id", h.deleteByID)

}

func (h *userHandler) byId(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	data, err := h.srv.Admin.ById(uint(id), h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

func (h *userHandler) deleteByID(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	currentUser := c.Get("user").(*utils.Claims)

	if err := h.srv.User.DeleteByID(uint(id), currentUser.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.DeleteUserAction, fmt.Sprintf(" %s make deleteUser request", currentUser.Email))

	err = h.srv.Admin.CreateLog(adminLog)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, nil)

}

func (h *userHandler) createUser(c echo.Context) error {

	var req dto.CreateUserRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	currentUser := c.Get("user").(*utils.Claims)
	req.CreatedByID = &currentUser.ID

	file, err := c.FormFile("avatar")
	if err != nil && strings.Compare(err.Error(), "http: no such file") != 0 {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	if file != nil {

		isImage, err := utils.IsImage(file)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}

		if !isImage {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not an image"), nil)
		}

		// save avatar
		fileExt := utils.GetFileExtension(file)
		req.AvatarFileName = fmt.Sprintf("%s%s", utils.MakeUniqueIDWithTime(), fileExt)
		avatarPath := fmt.Sprintf("%s/%s", h.avatarFolder, req.AvatarFileName)

		src, err := file.Open()

		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}

		defer src.Close()

		dst, err := os.Create(avatarPath)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			if err := os.Remove(avatarPath); err != nil {
				log.Println(err)
			}
			return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
		}
		//
	}

	if err := h.srv.User.CreateUser(&req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	adminLog := h.srv.Admin.MakeAdminLogModel(*req.CreatedByID, model.CreateUserAction, fmt.Sprintf(" %s make createUser request", currentUser.Email))

	err = h.srv.Admin.CreateLog(adminLog)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusCreated, nil)
}

func (h *userHandler) updateUser(c echo.Context) error {
	var err error
	var id int
	var req dto.UpdateUserRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if c.Param("id") != "" {
		id, err = strconv.Atoi(c.Param("id"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
		}
	}

	currentUser := c.Get("user").(*utils.Claims)
	req.UpdatedByID = &currentUser.ID
	data, err := h.srv.User.UpdateUser(&req, uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	adminLog := h.srv.Admin.MakeAdminLogModel(uint(id), model.UpdateUserAction, fmt.Sprintf(" %s update_user request", currentUser.Email))

	err = h.srv.Admin.CreateLog(adminLog)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

func (h *userHandler) page(c echo.Context) error {
	var page, limit uint
	var err error

	var req dto.UserQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if req.Page == 0 || req.Limit == 0 {
		page = utils.DEFAULT_PAGE
		limit = utils.DEFAULT_LIMIT

	} else {
		page = req.Page
		limit = req.Limit
	}
	data, err := h.srv.User.GetUserList(&req, page, limit, h.apiURL)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}
