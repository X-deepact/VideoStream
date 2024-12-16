package handler

import (
	"database/sql"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type userHandler struct {
	r            *echo.Group
	srv          *service.Service
	avatarFolder string
}

func newUserHandler(r *echo.Group, srv *service.Service) *userHandler {
	fileStorageCfg := conf.GetFileStorageConfig()
	user := &userHandler{
		r:            r,
		srv:          srv,
		avatarFolder: fileStorageCfg.AvatarFolder,
	}

	user.register()

	return user
}

func (h *userHandler) register() {
	group := h.r.Group("api/user")

	group.GET("/information", h.GetInformation)
	group.PUT("/update", h.UpdateUser)
	group.GET("/get-2fa", h.GetTwoFAInfo)
	group.PUT("/change-2fa", h.ChangeTwoFAStatus)
	group.POST("/verify-2fa", h.VerifyTwoFA)
}

func (h *userHandler) GetInformation(c echo.Context) error {
	claims := c.Get("user").(*utils.Claims)

	user, err := h.srv.User.GetUserLogin(claims.Username)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get user information"), nil)
	}

	resp := dto.UserDto{
		Username:    user.Username,
		DisplayName: user.DisplayName,
		Email:       user.Email,
		RoleType:    user.Role.Type,
	}

	if user.AvatarFileName.Valid {
		resp.AvatarFileURL = utils.GetFileUrl(h.avatarFolder, user.AvatarFileName.String)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, resp)
}

func (h *userHandler) UpdateUser(c echo.Context) error {
	var req dto.UpdateUserRequest
	if err := utils.BindFormData(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	claims := c.Get("user").(*utils.Claims)

	user, err := h.srv.User.GetUserLogin(claims.Username)

	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get user information"), nil)
	}

	if req.DisplayName != "" {
		user.DisplayName = req.DisplayName
	}

	if req.Password != "" && req.NewPassword != "" {
		if req.Password == req.NewPassword {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("current password and new password are the same"), nil)
		}

		//Check password
		if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("current password is incorrect"), nil)
		}

		hashPassword, err := utils.HashPassword(req.NewPassword)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
		user.PasswordHash = hashPassword
	}

	file, _ := c.FormFile("avatar")
	if file != nil {
		status, fileName, err := utils.SaveImage(c, file, h.avatarFolder)

		if status != http.StatusOK {
			return err
		}

		req.AvatarFileName = sql.NullString{String: fileName, Valid: fileName != ""}
	}

	if req.AvatarFileName.Valid {
		user.AvatarFileName = sql.NullString{String: req.AvatarFileName.String, Valid: true}
	}

	err = h.srv.User.UpdateUser(user)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	resp := dto.UserDto{
		Username:    user.Username,
		DisplayName: user.DisplayName,
		Email:       user.Email,
		RoleType:    user.Role.Type,
	}

	if user.AvatarFileName.Valid {
		resp.AvatarFileURL = utils.GetFileUrl(h.avatarFolder, user.AvatarFileName.String)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, resp)
}

func (h *userHandler) GetTwoFAInfo(c echo.Context) error {
	claims := c.Get("user").(*utils.Claims)

	twoFA, err := h.srv.TwoFA.GetTwoFAInfo(claims.ID)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}
	if twoFA == nil {
		return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
			Is2faEnabled: false,
		})
	}

	// not verify state
	if !twoFA.Is2faEnabled && twoFA.Secret == "" {
		return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
			Is2faEnabled: false,
		})
	}

	secret, qrCode, err := utils.GetQrCode(claims.Username, twoFA.Secret)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
		Secret:       secret,
		QrCode:       qrCode,
		Is2faEnabled: twoFA.Is2faEnabled,
	})
}

func (h *userHandler) ChangeTwoFAStatus(c echo.Context) error {
	var req dto.ChangeTwoFAStatusRequest
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	pTwoFa, err := h.srv.TwoFA.GetTwoFAInfo(claims.ID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create new 2FA record if not exists
			pTwoFa = &model.TwoFA{
				UserID:       claims.ID,
				Secret:       "",
				Is2faEnabled: false,
			}
			if err := h.srv.TwoFA.CreateTwoFA(pTwoFa); err != nil {
				return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
			}
		} else {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	if *req.IsEnabled {
		// Enabling 2FA - generate new secret and QR code
		secret, qrCode, err := utils.GetQrCode(claims.Username, "")
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		pTwoFa.Secret = secret
		pTwoFa.Is2faEnabled = false // Will be enabled after verification
		pTwoFa.UpdatedAt = time.Now()

		if err := h.srv.TwoFA.UpdateTwoFA(pTwoFa); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
			Secret:       secret,
			QrCode:       qrCode,
			Is2faEnabled: false,
		})
	} else {
		// Disabling 2FA - clear the secret
		if !pTwoFa.Is2faEnabled {
			return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("2FA is not enabled"), nil)
		}

		pTwoFa.Secret = "" // Clear the secret
		pTwoFa.Is2faEnabled = false
		pTwoFa.UpdatedAt = time.Now()

		if err := h.srv.TwoFA.UpdateTwoFA(pTwoFa); err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
			Is2faEnabled: false,
		})
	}
}

func (h *userHandler) VerifyTwoFA(c echo.Context) error {
	var req dto.VerifyTwoFA
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	claims := c.Get("user").(*utils.Claims)

	twoFA, err := h.srv.TwoFA.GetTwoFAInfo(claims.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get the secret key"), nil)
	}

	// Verify the provided OTP
	isVerified := utils.CheckTotp(req.OTP, twoFA.Secret)
	if !isVerified {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid verification code"), nil)
	}

	// Enable 2FA after successful verification
	twoFA.Is2faEnabled = true
	twoFA.UpdatedAt = time.Now()
	
	if err := h.srv.TwoFA.UpdateTwoFA(twoFA); err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.ChangeTwoFAStatusResponse{
		IsVerified: true,
	})
}
