package dto

import "gitlab/live/be-live-api/model"

type StreamRequest struct {
	Title             string           `json:"title" form:"title" validate:"required"`
	Description       string           `json:"description" form:"description" validate:"required"`
	UserID            uint             `json:"user_id" form:"user_id""`
	Record            string           `json:"-" form:"-"`
	ThumbnailFileName string           `json:"-" form:"-"`
	StreamType        model.StreamType `json:"stream_type" form:"stream_type" validate:"required,oneof=camera software"`
}
