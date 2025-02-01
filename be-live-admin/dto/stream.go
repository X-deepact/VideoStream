package dto

import "gitlab/live/be-live-admin/model"

type StreamRequest struct {
	Title             string             `json:"title" form:"title" validate:"required"`
	Description       string             `json:"description" form:"description" validate:"required"`
	UserID            uint               `json:"user_id" form:"user_id" validate:"required"`
	VideoFileName     string             `json:"-" form:"-"`
	ThumbnailFileName string             `json:"-" form:"-"`
	Status            model.StreamStatus `json:"status" form:"status" validate:"omitempty,oneof=pending started ended upcoming"`
	ScheduledAt       string             `json:"scheduled_at" form:"scheduled_at" validate:"required,datetime=2006-01-02 15:04:05.999 -0700"` //expect in utc
	CategoryIDs       []uint             `json:"category_ids" form:"category_ids" validate:"required,max=3,dive,required"`
}

type StreamAndStreamScheduleDto struct {
	Stream         *model.Stream         `json:"-"`
	ScheduleStream *model.ScheduleStream `json:"-" gorm:"-"`
}

type UpdateStreamRequest struct {
	Title       string             `json:"title" form:"title" validate:"required"`
	Description string             `json:"description" form:"description" validate:"required"`
	Status      model.StreamStatus `json:"status" form:"status" validate:"omitempty,oneof=pending started ended upcoming"`
	EndedAt     string             `json:"ended_at" form:"ended_at" validate:"omitempty,datetime=2006-01-02 15:04:05.999 -0700"`
	CategoryIDs []uint             `json:"category_ids" form:"category_ids" validate:"required,max=3,dive,required"`
}

type UpdateScheduledStreamRequest struct {
	VideoFileName string `json:"-" form:"-"`
	ScheduledAt   string `json:"scheduled_at" form:"scheduled_at" validate:"required,datetime=2006-01-02 15:04:05.999 -0700"` //expect in utc

}

type UpdateStreamThumbnailRequest struct {
	ThumbnailFileName string `json:"-" form:"-"`
	UpdatedByID       uint   `json:"-" form:"-"`
}

type CreateStreamResponseDTO struct {
	ID           uint   `json:"id"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	ThumbnailURL string `json:"thumbnail_url"`
}

const (
	SORT_BY_DURATION        = "duration"
	SORT_BY_CURRENT_VIEWERS = "currents_viewers"
	SORT_BY_DESCRIPTION     = "description"
	SORT_BY_TITLE           = "title"
	SORT_BY_TOTAL_VIEWERS   = "total_viewers"
	SORT_BY_VIEWERS         = "views"
	SORT_BY_LIKES           = "likes"
	SORT_BY_COMMENTS        = "comments"
	SORT_BY_VIDEO_SIZE      = "video_size"
	SORT_BY_SHARES          = "shares"
)

const (
	SORT_DESC = "DESC"
	SORT_ASC  = "ASC"
)
