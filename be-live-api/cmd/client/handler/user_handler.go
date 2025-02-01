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
	if err := utils.BindAndValidate(c, &req); err != nil {
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
		return utils.BuildErrorResponse(c, http.StatusBadRequest, errors.New("invalid request body"), nil)
	}

	claims := c.Get("user").(*utils.Claims)

	pTwoFa, err := h.srv.TwoFA.GetTwoFAInfo(claims.ID)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	// check is first time
	if pTwoFa == nil {
		if !*req.IsEnabled {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("you need to enable 2fa first"), nil)
		}

		secret, qrCode, err := utils.GetQrCode(claims.Username, "")
		if err != nil {
			log.Println(err, claims.Username)
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		twoFa := &model.TwoFA{
			UserID:       claims.ID,
			Secret:       secret,
			Is2faEnabled: false,
		}

		err = h.srv.TwoFA.CreateTwoFA(twoFa)
		if err != nil {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}

		return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
			Secret:       secret,
			Is2faEnabled: false,
			QrCode:       qrCode,
		})

	} else {

		// if user not verified yet
		if !pTwoFa.Is2faEnabled && pTwoFa.Secret != "" {
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("you need to verify with otp first"), nil)
		} else { // after user verify
			// user want to enable and already enabled in db
			if *req.IsEnabled && pTwoFa.Is2faEnabled {
				return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("2fa is already enabled"), nil)
			} else if !*req.IsEnabled && !pTwoFa.Is2faEnabled { // user want to disable and already disabled in db
				return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("2fa is already disabled"), nil)
			} else if !*req.IsEnabled && pTwoFa.Is2faEnabled { // if user want to disable and already enabled in db

				pTwoFa.Secret = ""
				pTwoFa.Is2faEnabled = false
				pTwoFa.UpdatedAt = time.Now()
				err = h.srv.TwoFA.UpdateTwoFA(pTwoFa)
				if err != nil {
					return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
				}

				return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
					Is2faEnabled: false,
				})

			} else { // if user want to enable and already disabled in db
				secret, qrCode, err := utils.GetQrCode(claims.Username, pTwoFa.Secret)
				if err != nil {
					return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
				}

				pTwoFa.Secret = secret
				pTwoFa.Is2faEnabled = false // user have to verify with otp
				pTwoFa.UpdatedAt = time.Now()
				err = h.srv.TwoFA.UpdateTwoFA(pTwoFa)
				if err != nil {
					return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
				}

				return utils.BuildSuccessResponse(c, http.StatusOK, dto.TwoFADto{
					Secret:       secret,
					Is2faEnabled: false,
					QrCode:       qrCode,
				})
			}
		}

	}
}

func (h *userHandler) VerifyTwoFA(c echo.Context) error {
	var req dto.VerifyTwoFA
	if err := utils.BindAndValidate(c, &req); err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	// otp := c.QueryParam("otp")
	claims := c.Get("user").(*utils.Claims)

	twoFA, err := h.srv.TwoFA.GetTwoFAInfo(claims.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("can't get the secret key"), nil)
	}

	isVerified := utils.CheckTotp(req.OTP, twoFA.Secret)

	if !isVerified {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, errors.New("otp is not correct"), nil)
	}

	twoFA.Is2faEnabled = true
	twoFA.UpdatedAt = time.Now()
	err = h.srv.TwoFA.UpdateTwoFA(twoFA)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	return utils.BuildSuccessResponse(c, http.StatusOK, dto.ChangeTwoFAStatusResponse{
		IsVerified: isVerified,
	})
}
