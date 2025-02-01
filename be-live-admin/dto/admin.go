package dto

import (
	"gitlab/live/be-live-admin/model"
	"time"
)

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
	SortBy   string `json:"sort_by" query:"sort_by" validate:"omitempty,oneof=performed_at action details username"`
	Sort     string `json:"sort" query:"sort" validate:"omitempty,oneof=DESC ASC"`
	FilterBy string `json:"filter_by" query:"filter_by" validate:"omitempty,oneof=details username email"`
	Action   string `json:"action" query:"action" validate:"omitempty,max=255"`
	Keyword  string `json:"keyword" query:"keyword" validate:"omitempty,max=255"`
	UserID   uint   `json:"-"`
	IsAdmin  bool   `json:"-"`
	IsMe     bool   `json:"is_me" query:"is_me" validate:"omitempty"`
	Page     uint   `query:"page" validate:"omitempty,min=1"`
	Limit    uint   `query:"limit" validate:"omitempty,min=1,max=20"`
}

type AdminLogRespDTO struct {
	ID          uint            `gorm:"primaryKey;autoIncrement" json:"id,omitempty"`
	Action      string          `json:"action,omitempty"`
	Details     string          `json:"details,omitempty"`
	PerformedAt time.Time       `json:"performed_at,omitempty"`
	User        UserResponseDTO `json:"user,omitempty"`
}

type AdminResp struct {
	ID          uint   `json:"id"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}
