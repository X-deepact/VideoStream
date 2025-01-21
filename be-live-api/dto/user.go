package dto

import (
	"database/sql"
	"gitlab/live/be-live-api/model"
)

type UserDto struct {
	Username      string         `json:"username"`
	DisplayName   string         `json:"display_name"`
	AvatarFileURL string         `json:"avatar_file_url"`
	Email         string         `json:"email"`
	RoleType      model.RoleType `json:"role_type"`
}

type UpdateUserRequest struct {
	DisplayName    string         `json:"display_name" form:"display_name"`
	Password       string         `json:"password" form:"password" validate:"omitempty"`
	NewPassword    string         `json:"new_password" form:"new_password" validate:"omitempty,min=8"`
	AvatarFileName sql.NullString `json:"avatar_file_name" form:"avatar_file_name"`
}
