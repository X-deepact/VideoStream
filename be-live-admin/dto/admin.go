package dto

import (
	"gitlab/live/be-live-api/model"
	"time"
)

type CreateAdminRequest struct {
	UserName       string         `json:"username" validate:"required,min=3,max=50"`
	Email          string         `json:"email" validate:"required,email,max=100"`
	DisplayName    string         `json:"display_name" validate:"required,min=3,max=100"`
	Password       string         `json:"password" validate:"required,min=6,max=255"`
	RoleType       model.RoleType `json:"role_type" validate:"required,oneof=admin streamer user"`
	AvatarFileName string         `json:"avatar_file_name" validate:"omitempty,min=3,max=200"`
	CreatedByID    *uint          `json:"created_by_id"`
}

type CreateAdminResp struct {
	ID             uint           `json:"id,omitempty"`
	UserName       string         `json:"username,omitempty"`
	DisplayName    string         `json:"display_name,omitempty"`
	Email          string         `json:"email,omitempty"`
	Role           model.RoleType `json:"role,omitempty"`
	AvatarFileName string         `json:"avatar_file_name,omitempty"`
	CreatedAt      time.Time      `json:"created_at,omitempty"`
}

type AdminLogQuery struct {
	SortBy  string `query:"sort_by" validate:"omitempty,oneof=performed_at"`
	Sort    string `query:"sort" validate:"omitempty,oneof=DESC ASC"`
	Keyword string `query:"keyword" validate:"omitempty,max=255"`
	UserIDs []uint `query:"user_ids" validate:"omitempty"`
	Page    uint   `query:"page" validate:"omitempty,min=1"`
	Limit   uint   `query:"limit" validate:"omitempty,min=1,max=20"`
}

type AdminLogRespDTO struct {
	ID          uint            `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
	Action      string          `json:"action,omitempty"`
	Details     string          `json:"details,omitempty"`
	PerformedAt time.Time       `json:"performed_at,omitempty"`
	User        UserResponseDTO `json:"user,omitempty"`
}
