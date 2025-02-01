package dto

import (
	"gitlab/live/be-live-admin/model"
	"time"
)

type UserQuery struct {
	Role      string `json:"role" query:"role" validate:"omitempty,oneof=admin streamer user"`
	Keyword   string `query:"keyword" validate:"omitempty,max=255"`
	CreatedBy string `json:"created_by" query:"created_by" validate:"omitempty,max=255"`
	Status    string `json:"status" query:"status" validate:"omitempty,oneof=online offline blocked"`
	Reason    string `json:"reason" query:"reason" validate:"omitempty,min=3,max=255"`
	SortBy    string `json:"sort_by" query:"sort_by" validate:"omitempty,oneof=created_at updated_at username email display_name"`
	Sort      string `json:"sort" query:"sort" validate:"omitempty,oneof=DESC ASC"`
	Page      uint   `query:"page" validate:"required,min=1"`
	Limit     uint   `query:"limit" validate:"omitempty,min=1,max=20"`
}

type UserResponseDTO struct {
	ID             uint                 `json:"id,omitempty"`
	Username       string               `json:"username,omitempty"`
	DisplayName    string               `json:"display_name"`
	AvatarFileName string               `json:"avatar_file_name,omitempty"`
	Email          string               `json:"email,omitempty"`
	RoleID         uint                 `json:"role_id,omitempty"`
	BlockedReason  string               `json:"blocked_reason,omitempty"`
	Role           *RoleDTO             `json:"role,omitempty"`
	Status         model.UserStatusType `json:"status,omitempty"`
	CreatedAt      time.Time            `json:"created_at,omitempty"`
	CreatedByID    *uint                `json:"created_by_id,omitempty"`
	CreatedBy      *UserResponseDTO     `json:"created_by,omitempty"`
	UpdatedAt      time.Time            `json:"updated_at,omitempty"`
	UpdatedByID    *uint                `json:"updated_by_id,omitempty"`
	UpdatedBy      *UserResponseDTO     `json:"updated_by,omitempty"`
	DeletedByID    *uint                `json:"deleted_by_id,omitempty"`
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
	ID          uint             `json:"id,omitempty"`
	UserID      uint             `json:"user_id,omitempty"`
	Action      string           `json:"action,omitempty"`
	Details     string           `json:"details,omitempty"`
	PerformedAt time.Time        `json:"performed_at,omitempty"`
	User        *UserResponseDTO `json:"user,omitempty"`
}

type UpdateUserRequest struct {
	UserName    string         `json:"username" validate:"omitempty,min=3,max=50"`
	Email       string         `json:"email" validate:"omitempty,email,max=100"`
	DisplayName string         `json:"display_name" validate:"omitempty,min=3,max=100"`
	RoleType    model.RoleType `json:"role_type" validate:"omitempty,oneof=admin streamer user"`
	UpdatedByID *uint          `json:"updated_by_id"`
}

type UpdateUserResponse struct {
	ID          uint                 `json:"id"`
	UserName    string               `json:"username,omitempty"`
	Avatar      string               `json:"avatar"`
	DisplayName string               `json:"display_name,omitempty"`
	Email       string               `json:"email,omitempty"`
	Role        model.RoleType       `json:"role,omitempty"`
	Status      model.UserStatusType `json:"status,omitempty"`
	UpdatedAt   time.Time            `json:"created_at,omitempty"`
}

type CreateUserRequest struct {
	UserName       string         `json:"username" form:"username" validate:"required,min=3,max=50"`
	Email          string         `json:"email" form:"email" validate:"required,email,max=100"`
	DisplayName    string         `json:"display_name" form:"display_name" validate:"required,min=3,max=100"`
	Password       string         `json:"password" form:"password" validate:"required,min=8,max=255"`
	RoleType       model.RoleType `json:"role_type" form:"role_type" validate:"required,oneof=admin streamer user"`
	AvatarFileName string         `json:"-" form:"-"`
	CreatedByID    *uint          `json:"-" form:"-"`
}

type DeactiveUserRequest struct {
	Reason string `json:"reason" validate:"required,min=3,max=255"`
}

type ChangePasswordRequest struct {
	Password        string `json:"password" form:"password" validate:"required,min=8,max=255"`
	ConfirmPassword string `json:"confirm_password" form:"confirm_password" validate:"required,min=8,max=255"`
}

type ChangeAvatarRequest struct {
	AvatarFileName string `json:"-" form:"-"`
	UpdatedByID    *uint  `json:"-" form:"-"`
}

type UserStatisticsRequest struct {
	Page     uint   `query:"page" validate:"min=1"`
	Limit    uint   `query:"limit" validate:"min=1,max=20"`
	SortBy   string `json:"sort_by" query:"sort_by" validate:"omitempty,oneof=username display_name total_streams total_likes total_comments total_views"`
	Sort     string `json:"sort" query:"sort" validate:"omitempty,oneof=DESC ASC"`
	RoleType string `json:"role_type" query:"role_type" validate:"omitempty,oneof=user streamer"`
	Keyword  string `json:"keyword" query:"keyword" validate:"omitempty,max=255"`
}

type UserStatisticsResponse struct {
	UserID        uint           `json:"user_id"`
	RoleType      model.RoleType `json:"role_type"`
	Username      string         `json:"username"`
	DisplayName   string         `json:"display_name"`
	TotalStreams  uint           `json:"total_streams"`
	TotalLikes    uint           `json:"total_likes"`
	TotalComments uint           `json:"total_comments"`
	TotalViews    uint           `json:"total_views"`
}

func (r *UserStatisticsResponse) TableName() string {
	return "users"
}

type CommonResponseDTO interface{}
