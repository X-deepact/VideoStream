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
