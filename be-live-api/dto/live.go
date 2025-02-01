package dto

import (
	"encoding/json"
	"gitlab/live/be-live-api/model"
	"time"
)

type LiveMessageType string

const (
	LiveCommentType LiveMessageType = "comment"
	LiveLikeType    LiveMessageType = "like"
	LiveInitalType  LiveMessageType = "initial"
	LikeInfoType    LiveMessageType = "like_info"
	ViewInfoType    LiveMessageType = "view_info"
	LiveEndType     LiveMessageType = "live_ended"
	LiveShareType   LiveMessageType = "share"
)

type BaseMessage struct {
	Type LiveMessageType `json:"type"`
	Data json.RawMessage `json:"data"`
}

// for read from client
type LiveComment struct {
	Content string `json:"content" validate:"required"`
}

// for write to client
type LiveCommentInfo struct {
	ID             uint      `json:"id"`
	DisplayName    string    `json:"display_name"`
	Username       string    `json:"username"`
	AvatarURL      string    `json:"avatar_url"`
	AvatarFileName string    `json:"-"`
	Content        string    `json:"content"`
	CreatedAt      time.Time `json:"created_at"`
}

type LiveLike struct {
	LikeStatus bool                `json:"like_status"`
	LikeType   model.LikeEmoteType `json:"like_type" validate:"required"`
}

type InitialLiveMessage struct {
	Type            LiveMessageType      `json:"type"`
	Comments        []*LiveCommentInfo   `json:"comments"`
	LikeCount       int64                `json:"like_count"`
	LikeInfo        *LikeInfo            `json:"like_info"`
	CurrentLikeType *model.LikeEmoteType `json:"current_like_type,omitempty"`
	StartedAt       time.Time            `json:"started_at"`
	ShareCount      int64                `json:"share_count"`
}

type LiveCommentDto struct {
	ID          uint      `json:"id"`
	DisplayName string    `json:"display_name"`
	AvatarURL   string    `json:"avatar_url"`
	Content     string    `json:"content"`
	CreatedAt   time.Time `json:"created_at"`
	IsEdited    bool      `json:"is_edited"`
	IsMe        bool      `json:"is_me"`
}

// for response
type LikeInfoDto struct {
	Type LiveMessageType `json:"type"`
	Data *LikeInfo       `json:"data"`
}

type LikeInfo struct {
	Total   int64 `json:"total,omitempty"`
	Like    int64 `json:"like,omitempty"`
	Dislike int64 `json:"dislike,omitempty"`
	Laugh   int64 `json:"laugh,omitempty"`
	Sad     int64 `json:"sad,omitempty"`
	Wow     int64 `json:"wow,omitempty"`
	Heart   int64 `json:"heart,omitempty"`
}

// for viewer count response
type ViewInfoDto struct {
	Type LiveMessageType `json:"type"`
	Data *ViewInfo       `json:"data"`
}

type ViewInfo struct {
	Total int64 `json:"total"`
}

// for end live response
type LiveEndDto struct {
	Type LiveMessageType `json:"type"`
}

type UpdateCommentRequest struct {
	ID      uint   `json:"id" validate:"required"`
	Content string `json:"content" validate:"required"`
}

type UpdateRequest struct {
	Title       string `json:"title" form:"title" validate:"required"`
	Description string `json:"description" form:"description" validate:"required"`
	CategoryIDs []uint `json:"category_ids" form:"category_ids" validate:"required,max=3,dive,required"`
}

type ShareDto struct {
	Type       LiveMessageType `json:"type"`
	ShareCount int64           `json:"share_count"`
}
