package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"io"
	"log"
	"net/http"
	"os"
	"slices"
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
	clientHost   string
}

func newUserHandler(r *echo.Group, srv *service.Service) *userHandler {
	fileStorageConfig := conf.GetFileStorageConfig()
	apiURL := conf.GetApiFileConfig().Url
	clientHost := conf.GetClientConfig().Host
	user := &userHandler{
		Handler: Handler{
			r:   r,
			srv: srv,
		},
		r:            r,
		srv:          srv,
		avatarFolder: fileStorageConfig.AvatarFolder,
		apiURL:       apiURL,
		clientHost:   clientHost,
	}

	user.register()

	return user
}

func (h *userHandler) register() {
	group := h.r.Group("api/users")

	group.Use(h.JWTMiddleware())
	group.GET("", h.page)
	group.GET("/list-username", h.getUsernameList)
	group.POST("", h.createUser)
	group.PUT("/:id", h.updateUser)
	group.PATCH("/:id/change-password", h.changePassword)
	group.PATCH("/:id/change-avatar", h.changeAvatar)
	group.PATCH("/:id/deactive", h.deactiveUser)
	group.PATCH("/:id/reactive", h.reactiveUser)
	group.GET("/:id", h.byId)
	group.DELETE("/:id", h.deleteByID)
	group.GET("/statistics", h.getUserStatistics)

}

// @Summary Get list of usernames
// @Description Get a list of all usernames
// @Tags Users
// @Accept  json
// @Produce  json
// @Success 	 200 		{array} string
// @Failure      500         "Internal Server Error"
// @Security     Bearer
// @Router /api/users/usernames [get]
func (h *userHandler) getUsernameList(c echo.Context) error {

	data, err := h.srv.User.GetUsernameList()
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

// @Summary Get user by ID
// @Description Get a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Success 200 {object} dto.UserResponseDTO
// @Failure 400 "Invalid ID parameter"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id} [get]
func (h *userHandler) byId(c echo.Context) error {
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

// @Summary Delete user by ID
// @Description Delete a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Success 200 "Successfully"
// @Failure 400 "Invalid ID parameter"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id} [delete]
func (h *userHandler) deleteByID(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	deletedUser, err := h.srv.User.FindByID(uint(id))
	if err != nil {

	}

	if deletedUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	// remove avatar
	if deletedUser.AvatarFileName.Valid {

		avatarPath := fmt.Sprintf("%s%s", h.avatarFolder, deletedUser.AvatarFileName.String)
		avatarsToRemove := []string{avatarPath}
		go utils.RemoveFiles(avatarsToRemove)
	}

	if err := h.srv.User.DeleteByID(uint(id), currentUser.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	currentToken, err := utils.GetTokenFromHeader(c)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	_, err = utils.PostAsync[dto.CommonResponseDTO](fmt.Sprintf("%s/api/notification/blocked-deleted", h.clientHost), currentToken, map[string]interface{}{"user_id": id, "type": "account_deleted"})
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.DeleteUserAction, fmt.Sprintf("%s deleted %s.", currentUser.Username, deletedUser.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, nil)

}

// @Summary Reactive user by ID
// @Description Reactive a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Success 200 {object} dto.UpdateUserResponse
// @Failure 400 "Invalid ID parameter"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id}/reactive [patch]
func (h *userHandler) reactiveUser(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	updatedUser, err := h.srv.User.FindByID(uint(id))

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if updatedUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	if updatedUser.Role.Type == model.SUPPERADMINROLE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, super admin can't be reactive"), nil)
	}

	if currentUser.RoleType == model.ADMINROLE && updatedUser.Role.Type == model.ADMINROLE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, admin can't reactive admin"), nil)
	}

	data, err := h.srv.User.ChangeStatusUser(updatedUser, currentUser.ID, model.OFFLINE, "", h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.ReactiveUserAction, fmt.Sprintf("%s re-active %s.", currentUser.Username, data.UserName))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary Deactive user by ID
// @Description Deactive a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Param DeactiveUserRequest body dto.DeactiveUserRequest true "Deactive User"
// @Success 200 {object} dto.UpdateUserResponse
// @Failure 400 "Invalid ID parameter"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id}/deactive [patch]
func (h *userHandler) deactiveUser(c echo.Context) error {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	var request dto.DeactiveUserRequest
	if err := utils.BindAndValidate(c, &request); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	updatedUser, err := h.srv.User.FindByID(uint(id))

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if updatedUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	if updatedUser.Role.Type == model.SUPPERADMINROLE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, super admin can't be deactive"), nil)
	}

	if currentUser.RoleType == model.ADMINROLE && updatedUser.Role.Type == model.ADMINROLE {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, admin can't deactive admin"), nil)
	}

	data, err := h.srv.User.ChangeStatusUser(updatedUser, currentUser.ID, model.BLOCKED, request.Reason, h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	// remove ws connection
	currentToken, err := utils.GetTokenFromHeader(c)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	_, err = utils.PostAsync[dto.CommonResponseDTO](fmt.Sprintf("%s/api/notification/blocked-deleted", h.clientHost), currentToken, map[string]interface{}{"user_id": id, "type": "account_blocked"})
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	//
	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.DeactiveUserAction, fmt.Sprintf("%s block %s. reason is %s", currentUser.Username, data.UserName, request.Reason))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}
	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)

}

// @Summary Create a new user
// @Description Create a new user with the provided details
// @Tags Users
// @Accept  json
// @Produce  json
// @Param avatar formData file false "User Avatar"
// @Param CreateUserRequest formData dto.CreateUserRequest true "Create User Request"
// @Success 201 "Successfully"
// @Failure 400 "Invalid request"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users [post]
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

		if file.Size > utils.MAX_IMAGE_SIZE {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Image size exceeds the 1MB limit")
		}

		// save avatar
		fileExt := utils.GetFileExtension(file)
		req.AvatarFileName = fmt.Sprintf("%s%s", utils.MakeUniqueIDWithTime(), fileExt)
		avatarPath := fmt.Sprintf("%s%s", h.avatarFolder, req.AvatarFileName)

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

	adminLog := h.srv.Admin.MakeAdminLogModel(*req.CreatedByID, model.CreateUserAction, fmt.Sprintf("%s created %s with role type %s.", currentUser.Username, req.UserName, req.RoleType))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusCreated, "Successfully created", nil)
}

// @Summary Change user avatar
// @Description Change the avatar of a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Param avatar formData file true "User Avatar"
// @Success 200 {object} dto.UpdateUserResponse
// @Failure 400 "Invalid request"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id}/change-avatar [patch]
func (h *userHandler) changeAvatar(c echo.Context) error {

	var req dto.ChangeAvatarRequest

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
	}

	currentUser := c.Get("user").(*utils.Claims)
	req.UpdatedByID = &currentUser.ID

	file, err := c.FormFile("avatar")
	if err != nil {
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

		if file.Size > utils.MAX_IMAGE_SIZE {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, nil, "Image size exceeds the 1MB limit")
		}

		// save avatar
		fileExt := utils.GetFileExtension(file)
		req.AvatarFileName = fmt.Sprintf("%s%s", utils.MakeUniqueIDWithTime(), fileExt)
		avatarPath := fmt.Sprintf("%s%s", h.avatarFolder, req.AvatarFileName)

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

	updatedUser, err := h.srv.User.FindByID(uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if updatedUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, err, nil)
	}

	// remove avatar
	if updatedUser.AvatarFileName.Valid {

		avatarPath := fmt.Sprintf("%s%s", h.avatarFolder, updatedUser.AvatarFileName.String)
		avatarsToRemove := []string{avatarPath}
		go utils.RemoveFiles(avatarsToRemove)
	}

	data, err := h.srv.User.ChangeAvatar(updatedUser, &req, uint(id), currentUser.ID, h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.ChangeAvatarByAdmin, fmt.Sprintf("%s changed avatar of %s.", currentUser.Username, updatedUser.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

// @Summary Update user details
// @Description Update the details of a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Param UpdateUserRequest body dto.UpdateUserRequest true "Update User Request"
// @Success 200 {object} dto.UpdateUserResponse
// @Failure 400 "Invalid request"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id} [put]
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

	targetUser, err := h.srv.User.FindByID(uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if targetUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	var data *dto.UpdateUserResponse
	// validate super admin user
	if currentUser.RoleType == model.SUPPERADMINROLE {
		if currentUser.ID == uint(id) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, super admin don't update itself"), nil)
		}
	} else {
		// validate admin user
		if currentUser.ID != uint(id) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, not allow update info of other account"), nil)
		}
	}

	data, err = h.srv.User.UpdateUser(&req, uint(id), h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(uint(id), model.UpdateUserAction, fmt.Sprintf("%s updated %s. ", currentUser.Username, targetUser.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

// @Summary Change user password
// @Description Change the password of a user by their ID
// @Tags Users
// @Accept  json
// @Produce  json
// @Param id path int true "User ID"
// @Param ChangePasswordRequest body dto.ChangePasswordRequest true "Change Password Request"
// @Success 200 {object} dto.UpdateUserResponse
// @Failure 400 "Invalid request"
// @Failure 404 "Not found"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/{id}/change-password [patch]
func (h *userHandler) changePassword(c echo.Context) error {
	var err error
	var id int
	var req dto.ChangePasswordRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if c.Param("id") != "" {
		id, err = strconv.Atoi(c.Param("id"))
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid id parameter"), nil)
		}
	}

	if req.Password != req.ConfirmPassword {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("password not match confirm_password"), nil)
	}

	currentUser := c.Get("user").(*utils.Claims)

	targetUser, err := h.srv.User.FindByID(uint(id))
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if targetUser == nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("not found"), nil)
	}

	var data *dto.UpdateUserResponse
	// validate admin user
	if currentUser.RoleType == model.ADMINROLE {
		if !slices.Contains([]model.RoleType{model.STREAMER, model.USERROLE}, targetUser.Role.Type) && currentUser.ID != uint(id) {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request, just allow change password self and streamer, user"), nil)
		}
	}

	data, err = h.srv.User.ChangePassword(targetUser, &req, uint(id), currentUser.ID, h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.ChangeUserPasswordAction, fmt.Sprintf("%s changed password of %s.", currentUser.Username, targetUser.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}

// @Summary Get paginated list of users
// @Description Get a paginated list of users based on the provided query parameters
// @Tags Users
// @Accept  json
// @Produce  json
// @Param UserQuery query dto.UserQuery true "User Query"
// @Success 200 {object} utils.PaginationModel[dto.UserResponseDTO]
// @Failure 400 "Invalid request"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users [get]
func (h *userHandler) page(c echo.Context) error {
	var page, limit uint
	var err error

	var req dto.UserQuery
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if req.Page == 0 || req.Limit == 0 {
		page = utils.DEFAULT_PAGE
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

// @Summary Get user statistics
// @Description Get statistics for users based on the provided criteria
// @Tags Users
// @Accept  json
// @Produce  json
// @Param UserStatisticsRequest query dto.UserStatisticsRequest true "User Statistics Request"
// @Success 200 {object} utils.PaginationModel[dto.UserStatisticsResponse]
// @Failure 400 "Invalid request"
// @Failure 500 "Internal Server Error"
// @Security     Bearer
// @Router /api/users/statistics [get]
func (h *userHandler) getUserStatistics(c echo.Context) error {
	var req dto.UserStatisticsRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	data, err := h.srv.User.GetUserStatistics(&req)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponseWithData(c, http.StatusOK, data)
}
