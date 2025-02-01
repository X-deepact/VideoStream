package dto

import "time"

type CategoryRespDto struct {
	ID            uint             `json:"id"`
	Name          string           `json:"name,omitempty"`
	CreatedAt     time.Time        `json:"created_at,omitempty"`
	UpdatedAt     time.Time        `json:"updated_at,omitempty"`
	CreatedByID   uint             `json:"created_by_id"`
	UpdatedByID   uint             `json:"updated_by_id"`
	CreatedByUser *UserResponseDTO `json:"created_by_user,omitempty"`
	UpdatedByUser *UserResponseDTO `json:"updated_by_user,omitempty"`
}

type CategoryRequestDTO struct {
	Name        string `json:"name" validate:"required,min=3,max=50"`
	CreatedByID uint   `json:"-"`
	UpdatedByID uint   `json:"-"`
}

type CategoryUpdateRequestDTO struct {
	Name        string `json:"name" validate:"required,min=3,max=50"`
	UpdatedByID uint   `json:"-"`
}

type CategoryQueryDTO struct {
	Name      string `query:"name" validate:"omitempty,max=255"`
	CreatedBy string `json:"created_by" query:"created_by" validate:"omitempty,max=255"`
	SortBy    string `json:"sort_by" query:"sort_by" validate:"omitempty,oneof=created_at updated_at name created_by updated_by"`
	Sort      string `json:"sort" query:"sort" validate:"omitempty,oneof=DESC ASC"`
	Page      uint   `query:"page" validate:"omitempty,min=1"`
	Limit     uint   `query:"limit" validate:"omitempty,min=1,max=99999"`
}
