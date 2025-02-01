package handler

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"net/http"
	"slices"
	"time"

	"github.com/labstack/echo/v4"
)

type authHandler struct {
	Handler
	r      *echo.Group
	srv    *service.Service
	apiURL string
}

func newAuthHandler(r *echo.Group, srv *service.Service) *authHandler {
	apiURL := conf.GetApiFileConfig().Url
	auth := &authHandler{
		Handler: Handler{
			r:   r,
			srv: srv,
		},
		r:      r,
		srv:    srv,
		apiURL: apiURL,
	}

	auth.register()

	return auth
}

func (h *authHandler) register() {
	group := h.r.Group("api/auth")

	group.POST("/login", h.login)

	group.Use(h.JWTMiddleware())

	group.POST("/logout", h.logout)
	group.POST("/resetPassword", h.resetPassword)
	group.POST("/forgetPassword", h.forgetPassword)

}

// @Summary Login a user
// @Description Authenticates the user and returns a JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param login body dto.LoginDTO true "User Login Data"
// @Success 200 {object} dto.LoginResponse "Login successful"
// @Failure 400  "Invalid request"
// @Router /api/auth/login [post]
func (h *authHandler) login(c echo.Context) error {
	var loginDTO dto.LoginDTO

	if err := utils.BindAndValidate(c, &loginDTO); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	user, err := h.srv.User.FindByEmail(loginDTO.Email)
	if err != nil || user == nil || !utils.CheckPasswordHash(loginDTO.Password, user.PasswordHash) {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("invalid username or password"), nil)
	}

	if user.Status == model.BLOCKED {
		return utils.BuildErrorResponse(c, http.StatusForbidden, errors.New("user was blocked"), nil)
	}

	if !slices.Contains([]model.RoleType{model.ADMINROLE, model.SUPPERADMINROLE}, user.Role.Type) {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("you have no permission to login"), nil)
	}
	// update to online
	_, err = h.srv.User.ChangeStatusUser(user, user.ID, model.ONLINE, "", h.apiURL)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	token, expiredTime, err := utils.GenerateAccessToken(user.ID, user.Username, user.Email, user.Role.Type) // createdByID is current user id login
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(user.ID, model.LoginAction, fmt.Sprintf("%s logged in.", user.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	var avatarFileName = ""
	if user.AvatarFileName.Valid {
		avatarFileName = utils.MakeAvatarURL(h.apiURL, user.AvatarFileName.String)
	}

	response := dto.LoginResponse{
		ID:          user.ID,
		Avatar:      avatarFileName,
		Status:      string(model.ONLINE),
		Username:    user.Username,
		DisplayName: user.DisplayName,
		Email:       user.Email,
		Role:        user.Role.Type,
		ExpiredTime: expiredTime,
		Token:       token,
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Login successful", response)
}

// @Summary Logout user
// @Description Logout the current user and invalidate the token
// @Tags Auth
// @Accept  json
// @Produce  json
// @Success 200 "Logout successful"
// @Failure 500 "Internal Server Error"
// @Security Bearer
// @Router /api/auth/logout [post]
func (h *authHandler) logout(c echo.Context) error {

	token, err := utils.GetTokenFromHeader(c)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	currentUser := c.Get("user").(*utils.Claims)
	// add token.jti to cache
	if err := h.srv.SetCache(c.Request().Context(), token, fmt.Sprintf("%d_%s", currentUser.ID, currentUser.Username), 24*time.Hour); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if err := h.srv.User.ChangeStatusUserByID(currentUser.ID, currentUser.ID, model.OFFLINE); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(currentUser.ID, model.LogoutAction, fmt.Sprintf("%s logout.", currentUser.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Logout successful", nil)
}

// forgetPassword godoc
// @Summary      Forget Password
// @Description  Generates an OTP for password reset
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        forgetPasswordDTO  body      dto.ForgetPasswordDTO  true  "Forget Password DTO"
// @Success      200                      "OTP generated successfully"
// @Failure      400                      "Bad Request"
// @Failure      400                      "Email not found"
// @Failure      500                      "Internal Server Error"
// @Security Bearer
// @Router       /api/auth/forgetPassword [post]
func (h *authHandler) forgetPassword(c echo.Context) error {
	var forgetPasswordDTO dto.ForgetPasswordDTO

	if err := utils.BindAndValidate(c, &forgetPasswordDTO); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	// Check if the user exists
	user, err := h.srv.User.FindByEmail(forgetPasswordDTO.Email)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("email not found"), nil)

	}

	otp, err := utils.GenerateOTP(6)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	user.OTP = otp
	//user.OTPExpiresAt = time.Now().Add(15 * time.Minute)

	user.OTPExpiresAt = func(t time.Time) *time.Time {
		return &t
	}(time.Now().Add(15 * time.Minute))

	err = h.srv.User.Update(user)
	if err != nil {

		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)

	}
	adminLog := h.srv.Admin.MakeAdminLogModel(user.ID, model.ForgetPassword, fmt.Sprintf("%s made forget password request.", user.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}
	return utils.BuildSuccessResponse(c, http.StatusOK, "OTP generated successfully", map[string]string{"otp": otp})

}

// @Summary      Reset Password
// @Description  Resets the user's password using OTP
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        resetPasswordDTO  body      dto.ResetPasswordDTO  true  "Reset Password DTO"
// @Success      200                    "Password reset successfully"
// @Failure      400                    "Bad Request"
// @Failure      404                    "Email not found"
// @Failure      500                    "Internal Server Error"
// @Security Bearer
// @Router       /api/auth/resetPassword [post]
func (h *authHandler) resetPassword(c echo.Context) error {

	var resetPasswordDTO dto.ResetPasswordDTO
	if err := utils.BindAndValidate(c, &resetPasswordDTO); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if resetPasswordDTO.NewPassword != resetPasswordDTO.ConfirmPassword {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("passwords do not match"), nil)
	}

	claims := c.Get("user").(*utils.Claims)

	user, err := h.srv.User.FindByEmail(claims.Email)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusNotFound, errors.New("email not found"), nil)
	}

	if time.Now().After(*user.OTPExpiresAt) {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("OTP expired"), nil)

	}
	if user.OTP != resetPasswordDTO.OTP {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid OTP"), nil)

	}

	hashedPassword, err := utils.HashPassword(resetPasswordDTO.NewPassword)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if err := h.srv.User.UpdatePassword(user.ID, hashedPassword); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	if err := h.srv.User.ClearOTP(user.ID); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	adminLog := h.srv.Admin.MakeAdminLogModel(user.ID, model.ResetPassword, fmt.Sprintf("%s made reset password.", user.Username))
	err = h.srv.Admin.CreateLog(adminLog)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to created admin log"})
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, "Password reset successfully", nil)

}
