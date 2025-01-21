package dto

import (
	"gitlab/live/be-live-api/model"
	"time"
)

type LoginRequest struct {
	Username string `json:"username" form:"username" validate:"required,min=4"`
	Password string `json:"password" form:"password" validate:"required,min=4"`
}

type RegisterRequest struct {
	Username    string `json:"username" form:"username" validate:"required,min=4"`
	DisplayName string `json:"display_name" form:"display_name"`
	Email       string `json:"email" form:"email" validate:"required,min=4"`
	Password    string `json:"password" form:"password" validate:"required,min=8"`
}

type LoginResponse struct {
	ID             uint           `json:"id"`
	Username       string         `json:"username"`
	DisplayName    string         `json:"display_name"`
	AvatarFileURL  string         `json:"avatar_file_url"`
	Email          string         `json:"email"`
	RoleType       model.RoleType `json:"role_type"`
	ExpirationTime time.Time      `json:"expiration_time"`
	Token          string         `json:"token"`
}

type ForgotPasswordRequest struct {
	Username string `json:"username" validate:"required"`
	Otp      string `json:"otp" validate:"required"`
	Password string `json:"password" validate:"required,min=8"`
}

type GenerateTotpRequest struct {
	Username  string `json:"username"`
	SecretKey string `json:"secret_key"`
}

type GenerateTotpResponse struct {
	SecretKey string `json:"secret_key"`
	QrCode    string `json:"qr_code"`
}
