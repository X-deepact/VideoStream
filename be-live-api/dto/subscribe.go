package dto

import "gitlab/live/be-live-api/model"

type SubscribeRequest struct {
	StreamerID uint `json:"streamer_id" form:"streamer_id" validate:"required"`
}

type SubscribeQuery struct {
	Page   int  `query:"page" validate:"omitempty,min=1"`
	Limit  int  `query:"limit" validate:"omitempty,min=5,max=50"`
	UserID uint `query:"-"`
}

type Subscription struct {
	model.Subscription
	NumSubscribed int64 `json:"num_subscribed"`
	NumVideo      int64 `json:"num_video"`
}

type SubscribeDto struct {
	ID                uint   `json:"id"`
	StreamerID        uint   `json:"streamer_id"`
	StreamerName      string `json:"streamer_name"`
	StreamerAvatarURL string `json:"streamer_avatar_url"`
	NumSubscribed     int64  `json:"num_subscribed"`
	NumVideo          int64  `json:"num_video"`
	IsMute            bool   `json:"is_mute"`
}

type SubscribeMuteRequest struct {
	StreamerID uint `json:"streamer_id" form:"streamer_id" validate:"required"`
	IsMute     bool `json:"is_mute" form:"is_mute"`
}

type SubscribeMuteResponse struct {
	IsMute bool `json:"is_mute"`
}
