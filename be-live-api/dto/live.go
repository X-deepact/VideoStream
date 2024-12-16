package dto

import (
	"encoding/json"
	"gitlab/live/be-live-api/model"
)

type LiveMessageType string

const (
	LiveCommentType LiveMessageType = "comment"
	LiveLikeType    LiveMessageType = "like"
	LiveInitalType  LiveMessageType = "initial"
)

type BaseMessage struct {
	Type LiveMessageType `json:"type"`
	Data json.RawMessage `json:"data"`
}

type LiveComment struct {
	Content string `json:"content" db:"comment"`
}

type LiveLike struct {
	LikeStatus bool                `json:"like_status"`
	LikeType   model.LikeEmoteType `json:"like_type"`
}

type InitialLiveMessage struct {
	Type      LiveMessageType `json:"type"`
	LikeCount int64           `json:"like_count"`
	Comments  []*LiveComment  `json:"comments"`
}

type LiveCommentDto struct {
	ID          uint   `json:"id"`
	DisplayName string `json:"display_name"`
	AvatarURL   string `json:"avatar_url"`
	Content     string `json:"content"`
}
