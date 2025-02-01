package dto

import (
	"gitlab/live/be-live-api/model"
	"time"
)

type NotificationDto struct {
	ID           uint                   `json:"id"`
	AvatarURL    string                 `json:"avatar_url"`
	Content      string                 `json:"content"`
	ThumbnailURL string                 `json:"thumbnail_url"`
	StreamID     uint                   `json:"stream_id"`
	Type         model.NotificationType `json:"type"`
	IsRead       bool                   `json:"is_read"`
	CreatedAt    time.Time              `json:"created_at"`
	StreamerID   *uint                  `json:"streamer_id"`
	IsMute       bool                   `json:"is_mute"`
}

type NotificationBlockedDeletedRequest struct {
	UserID uint                   `json:"user_id" validate:"required"`
	Type   model.NotificationType `json:"type" validate:"required,oneof=account_blocked account_deleted"`
}

type Notification struct {
	model.Notification
	StreamerID *uint `json:"streamer_id"`
	IsMute     bool  `json:"is_mute"`
}

type NotificationNumResponse struct {
	Num uint `json:"num"`
}

type NotificationReadResponse struct {
	IsRead bool `json:"is_read"`
}

type AdminEndStreamRequest struct {
	StreamID uint `json:"stream_id" validate:"required"`
}
