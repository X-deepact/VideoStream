package dto

import (
	"gitlab/live/be-live-api/model"
	"time"
)

type StreamRequest struct {
	Title             string           `json:"title" form:"title" validate:"required"`
	Description       string           `json:"description" form:"description" validate:"required"`
	UserID            uint             `json:"-" form:"-"` // will come from middleware
	ThumbnailFileName string           `json:"-" form:"-"`
	StreamType        model.StreamType `json:"stream_type" form:"stream_type" validate:"required,oneof=camera software"`
	CategoryIDs       []uint           `json:"category_ids" form:"category_ids" validate:"required,max=3,dive,required"`
}

type StreamStatus string

const (
	LIVE     StreamStatus = "live"
	VIDEO    StreamStatus = "video"
	UPCOMING StreamStatus = "upcoming"
)

type StreamQuery struct {
	Page        int          `query:"page" validate:"omitempty,min=1"`
	Limit       int          `query:"limit" validate:"omitempty,min=5,max=50"`
	Title       string       `query:"title" validate:"omitempty,min=1,max=100"`
	Status      StreamStatus `query:"status" validate:"omitempty,oneof=live video"`
	IsMe        *bool        `query:"is_me" validate:"omitempty"`
	UserID      uint         `query:"-"`
	CategoryIDs []uint       `query:"category_ids" validate:"omitempty,max=3"`
}

type StreamDto struct {
	ID            uint               `json:"id"`
	Title         string             `json:"title"`
	ThumbnailURL  string             `json:"thumbnail_url"`
	Status        model.StreamStatus `json:"status"`
	StartedAt     time.Time          `json:"started_at"`
	UserID        uint               `json:"user_id"`
	DisplayName   string             `json:"display_name"`
	AvatarFileURL string             `json:"avatar_file_url"`
	Views         uint               `json:"views"`
	Duration      uint               `json:"duration"`
}

type Stream struct {
	model.Stream
	StreamAnalytics []model.StreamAnalytics `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	Categories      []model.Category        `gorm:"many2many:stream_categories"`
}

type StreamDetailDto struct {
	ID              uint                 `json:"id"`
	Title           string               `json:"title"`
	Description     string               `json:"description"`
	ThumbnailURL    string               `json:"thumbnail_url"`
	BroadcastURL    string               `json:"broadcast_url"`
	VideoURL        string               `json:"video_url"`
	Status          StreamStatus         `json:"status"`
	CreatedAt       time.Time            `json:"created_at"`
	StartedAt       *time.Time           `json:"started_at"`
	UserID          uint                 `json:"user_id"`
	DisplayName     string               `json:"display_name"`
	AvatarFileURL   string               `json:"avatar_file_url"`
	Subscriptions   uint                 `json:"subscriptions"`
	Views           uint                 `json:"views"`
	Comments        uint                 `json:"comments"`
	LikeInfo        *LikeInfo            `json:"likes"`
	CurrentLikeType *model.LikeEmoteType `json:"current_like_type"`
	IsCurrentLike   bool                 `json:"is_current_like"`
	IsOwner         bool                 `json:"is_owner"`
	IsSubscribed    bool                 `json:"is_subscribed"`
	Duration        uint                 `json:"duration"`
	Categories      []CategoryDto        `json:"categories"`
}
