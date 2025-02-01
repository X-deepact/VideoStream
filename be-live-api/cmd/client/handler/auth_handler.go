package handler

import (
	"errors"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"net/http"

	"github.com/labstack/echo/v4"
)

type authHandler struct {
	r            *echo.Group
	srv          *service.Service
	avatarFolder string
}

func newAuthHandler(r *echo.Group, srv *service.Service) *authHandler {
	fileStorageCfg := conf.GetFileStorageConfig()
	auth := &authHandler{
		r:            r,
		srv:          srv,
		avatarFolder: fileStorageCfg.AvatarFolder,
	}

	auth.register()

	return auth
}

func (h *authHandler) register() {
	group := h.r.Group("api/auth")

	group.POST("/register", h.Register)
	group.POST("/login", h.Login)
	group.PUT("/forgot-password", h.ForgetPassword)
	//group.POST("/forgot-password", h.ForgotPassword)
	//group.GET("/mail-forgot-password", h.SendOTPForgotPassword)
}

func (h *authHandler) Register(c echo.Context) error {
	var req dto.RegisterRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	//Get roleId
	role, _ := h.srv.Role.GetRoleByType(model.USERROLE)

	if role == nil || role.ID == 0 {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("role type is not valid"), nil)
	}

	//Check user exist
	userExist, _ := h.srv.User.CheckUserExist(req.Username, req.Email)

	if userExist {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("username or email already exists"), nil)
	}

	hashPassword, errPassword := utils.HashPassword(req.Password)
	if errPassword != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errPassword, nil)
	}
	req.Password = hashPassword

	//Create new user
	user, err := h.srv.User.CreateUser(req, role.ID)

	if user == nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	//Generate token
	token, expirationTime, tokenErr := utils.GenerateAccessToken(user.ID, user.Username, user.Email, model.RoleType(user.Role.Type))
	if tokenErr != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("could not generate access token"), nil)
	}

	resp := dto.LoginResponse{
		ID:             user.ID,
		Username:       user.Username,
		DisplayName:    user.DisplayName,
		Email:          user.Email,
		RoleType:       model.USERROLE,
		ExpirationTime: expirationTime,
		Token:          token,
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, resp)
}

// @Summary Login a user
// @Description Authenticates the user and returns a JWT token
// @Tags Auth
// @Accept json
// @Produce json
// @Param login body dto.LoginRequest true "User Login Data"
// @Success 200 {object} dto.LoginResponse "Login successful"
// @Failure 400  "Invalid request"
// @Router /api/auth/login [post]
func (h *authHandler) Login(c echo.Context) error {
	var req dto.LoginRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	user, _ := h.srv.User.GetUserLogin(req.Username)

	//if err != nil {
	//	return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	//}

	//Check username
	if user == nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("username or password is incorrect"), nil)
	}

	if user.Status == model.BLOCKED {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("account is blocked, can't login"), nil)
	}

	//Check password
	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("username or password is incorrect"), nil)
	}

	//Generate token
	token, expirationTime, tokenErr := utils.GenerateAccessToken(user.ID, user.Username, user.Email, model.RoleType(user.Role.Type))
	if tokenErr != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("could not generate access token"), nil)
	}

	resp := dto.LoginResponse{
		ID:             user.ID,
		Username:       user.Username,
		DisplayName:    user.DisplayName,
		Email:          user.Email,
		RoleType:       user.Role.Type,
		ExpirationTime: expirationTime,
		Token:          token,
	}

	if user.AvatarFileName.Valid {
		resp.AvatarFileURL = utils.GetFileUrl(h.avatarFolder, user.AvatarFileName.String)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, resp)
}

//func (h *authHandler) SendOTPForgotPassword(c echo.Context) error {
//	email := c.QueryParam("email")
//	if email == "" {
//		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("Email is required in query parameters"), nil)
//	}
//
//	user, userErr := h.srv.User.GetUserLogin(email)
//	if userErr != nil {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("The above email is not valid"), nil)
//	}
//
//	oldOtp, _ := h.srv.Otp.GetOtp(user.ID, enum.ForgotPassword.String())
//
//	if oldOtp != nil && (oldOtp.ExpiresAt.After(time.Now()) || oldOtp.ExpiresAt.Equal(time.Now())) {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("You sent otp in about 5 minutes recently"), nil)
//	}
//
//	otp, _ := h.srv.Otp.CreateOtp(user.ID, enum.ForgotPassword.String())
//
//	if otp == nil {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("Can't create otp"), nil)
//	}
//
//	err := utils.SendMail(dto.MailModel{
//		Email:   email,
//		Subject: "OTP FORGOT PASSWORD",
//		Content: "OTP: " + otp.OtpCode,
//	})
//
//	if err != nil {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
//	}
//
//	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
//}
//
//func (h *authHandler) ForgotPassword(c echo.Context) error {
//	var req dto.ForgotPasswordRequest
//	if err := c.Bind(&req); err != nil {
//		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("Invalid request body"), nil)
//	}
//
//	if req.Email == "" {
//		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("Email is required"), nil)
//	}
//
//	user, userErr := h.srv.User.GetUserLogin(req.Email)
//	if userErr != nil {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("The above email is not valid"), nil)
//	}
//
//	oldOtp, _ := h.srv.Otp.GetOtp(user.ID, enum.ForgotPassword.String())
//	if oldOtp == nil || (oldOtp != nil && oldOtp.ExpiresAt.Before(time.Now())) {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("Otp has expired!"), nil)
//	}
//
//	if oldOtp.OtpCode != req.OtpCode {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("Otp is not correct!"), nil)
//	}
//
//	_, err := h.srv.User.ForgotPassword(user, req.Password)
//	if err != nil {
//		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
//	}
//
//	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
//}

func (h *authHandler) ForgetPassword(c echo.Context) error {
	var req dto.ForgotPasswordRequest
	if err := c.Bind(&req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	if req.Username == "" {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("username is required"), nil)
	}

	if req.Password == "" {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("password is required"), nil)
	}

	if req.Otp == "" {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("otp is required"), nil)
	}

	user, userErr := h.srv.User.GetUserLogin(req.Username)
	if userErr != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("the above username or email is not valid"), nil)
	}

	twoFA, _ := h.srv.TwoFA.GetTwoFAInfo(user.ID)

	if twoFA == nil || !twoFA.Is2faEnabled {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("you can't forget your password"), nil)
	}

	if !utils.CheckTotp(req.Otp, twoFA.Secret) {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("otp is not correct"), nil)
	}

	hashPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	user.PasswordHash = hashPassword

	err = h.srv.User.UpdateUser(user)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("unable to update password"), nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, nil)
}
