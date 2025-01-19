package dto

import (
	"gitlab/live/be-live-admin/model"
	"time"
)

type LoginDTO struct {
	Email    string `json:"email" validate:"required,email,max=100"`
	Password string `json:"password" validate:"required,min=8,max=255"`
}

type RegisterDTO struct {
	Username    string         `json:"username" validate:"required,min=3,max=50"`
	DisplayName string         `json:"display_name" validate:"required,min=5,max=100"`
	Email       string         `json:"email" validate:"required,email,max=100"`
	Password    string         `json:"password" validate:"required,min=8,max=255"`
	RoleType    model.RoleType `json:"role_type" validate:"required,oneof=super_admin admin streamer user"`
}

type ForgetPasswordDTO struct {
	Email string `json:"email" validate:"required,email,max=100"`
}

type ResetPasswordDTO struct {
	OTP             string `json:"otp" validate:"required,len=6"`
	NewPassword     string `json:"password" validate:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" validate:"required,min=8"`
}

type LoginResponse struct {
	ID          uint           `json:"id"`
	Avatar      string         `json:"avatar"`
	Username    string         `json:"username"`
	Status      string         `json:"status"`
	DisplayName string         `json:"display_name"`
	Email       string         `json:"email"`
	Role        model.RoleType `json:"role"`
	ExpiredTime time.Time      `json:"expired_time"`
	Token       string         `json:"token"`
}
