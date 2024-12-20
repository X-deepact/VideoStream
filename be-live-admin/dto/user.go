package dto

import (
	"gitlab/live/be-live-api/model"
	"time"

	"gorm.io/gorm"
)

type UserQuery struct {
	Role        string `query:"role" validate:"omitempty,oneof=super_admin admin streamer user"`
	UserName    string `query:"username" validate:"omitempty,min=1,max=50"`
	DisplayName string `query:"display_name" validate:"omitempty,min=1,max=50"`
	Email       string `query:"email" validate:"omitempty,email,max=100"`
	SortBy      string `query:"sort_by" validate:"omitempty,oneof=created_at updated_at username email display_name"`
	Sort        string `query:"sort" validate:"omitempty,oneof=DESC ASC"`
	CreatedBy   string `query:"created_by" validate:"omitempty,min=1,max=50"`
	UpdatedBy   string `query:"updated_by" validate:"omitempty,min=1,max=50"`
}

type UserResponseDTO struct {
	ID          uint             `json:"id,omitempty"`
	Username    string           `json:"username,omitempty"`
	DisplayName string           `json:"display_name"`
	Email       string           `json:"email,omitempty"`
	RoleID      uint             `json:"role_id,omitempty"`
	Role        *RoleDTO         `json:"role,omitempty"`
	CreatedAt   time.Time        `json:"created_at,omitempty"`
	CreatedByID *uint            `json:"created_by_id,omitempty"`
	CreatedBy   *UserResponseDTO `json:"created_by,omitempty"`
	UpdatedAt   time.Time        `json:"updated_at,omitempty"`
	UpdatedByID *uint            `json:"updated_by_id,omitempty"`
	UpdatedBy   *UserResponseDTO `json:"updated_by,omitempty"`
	DeletedAt   gorm.DeletedAt   `json:"deleted_at,omitempty"`
	DeletedByID *uint            `json:"deleted_by_id,omitempty"`
	AdminLogs   []AdminLogDTO    `json:"admin_logs"`
}

type RoleDTO struct {
	ID          uint              `json:"id,omitempty"`
	Type        model.RoleType    `json:"type,omitempty"`
	Description string            `json:"description,omitempty"`
	CreatedAt   time.Time         `json:"created_at,omitempty"`
	UpdatedAt   time.Time         `json:"updated_at,omitempty"`
	Users       []UserResponseDTO `json:"users"`
}

type AdminLogDTO struct {
	ID          uint            `json:"id,omitempty"`
	UserID      uint            `json:"user_id,omitempty"`
	Action      string          `json:"action,omitempty"`
	Details     string          `json:"details,omitempty"`
	PerformedAt time.Time       `json:"performed_at,omitempty"`
	User        UserResponseDTO `json:"user,omitempty"`
}

type UpdateUserRequest struct {
	UserName       string         `json:"username" validate:"required,min=3,max=50"`
	Email          string         `json:"email" validate:"required,email,max=100"`
	DisplayName    string         `json:"display_name" validate:"required,min=3,max=100"`
	RoleType       model.RoleType `json:"role_type" validate:"required,oneof=admin streamer user"`
	AvatarFileName string         `json:"avatar_file_name" validate:"omitempty,min=3,max=200"`
	UpdatedByID    *uint          `json:"updated_by_id"`
}

type UpdateUserResponse struct {
	UserName    string         `json:"username,omitempty"`
	DisplayName string         `json:"display_name,omitempty"`
	Email       string         `json:"email,omitempty"`
	Role        model.RoleType `json:"role,omitempty"`
	UpdatedAt   time.Time      `json:"created_at,omitempty"`
}
