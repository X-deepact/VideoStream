package dto

import (
	"gitlab/live/be-live-api/model"
	"time"
)

type LiveStreamRespDTO struct {
	Title       string     `json:"title,omitempty"`
	Description string     `json:"description,omitempty"`
	VideoSize   int64      `json:"video_size,omitempty"`
	Likes       uint       `json:"likes,omitempty"`
	Viewers     uint       `json:"viewers,omitempty"`
	Comments    uint       `json:"comments,omitempty"`
	Duration    int64      `json:"duration,omitempty"`
	CreatedAt   *time.Time `json:"created_at,omitempty"`
}

type StatisticsTotalLiveStreamDTO struct {
	ActiveLiveStreams uint `json:"active_live_streams"`
	TotalLiveStreams  uint `json:"total_live_streams"`
}

type StatisticsQuery struct {
	SortBy string `query:"sort_by" validate:"omitempty,oneof=title created_at views likes comments video_size duration stream_id id"`
	Sort   string `query:"sort" validate:"omitempty,oneof=DESC ASC"`
}

type LiveStreamBroadCastQueryDTO struct {
	SortBy          string               `query:"sort_by" validate:"omitempty,oneof=title started_at ended_at"`
	Sort            string               `query:"sort" validate:"omitempty,oneof=DESC ASC"`
	Status          []model.StreamStatus `query:"status" validate:"omitempty"`
	Type            model.StreamType     `query:"type" validate:"omitempty,oneof=camera software"`
	FromStartedTime int64                `query:"from_started_time" validate:"omitempty"`
	EndStartedTime  int64                `query:"end_started_time" validate:"omitempty"`
	FromEndedTime   int64                `query:"from_ended_time" validate:"omitempty"`
	EndEndedTime    int64                `query:"end_ended_time" validate:"omitempty"`
	Keyword         string               `query:"keyword" validate:"omitempty"`
}

type LiveStreamBroadCastDTO struct {
	ID                 int                `json:"id,omitempty"`
	Title              string             `json:"title,omitempty"`
	Description        string             `json:"description,omitempty"`
	Status             model.StreamStatus `json:"status,omitempty"`
	StreamToken        string             `json:"stream_token,omitempty"` // generated from streaming server
	StreamKey          string             `json:"stream_key,omitempty"`   // generated from web
	StreamType         model.StreamType   `json:"stream_type,omitempty"`
	ThumbnailFileName  string             `json:"thumbnail_file_name,omitempty"`
	StartedAt          *time.Time         `json:"started_at,omitempty"`
	EndedAt            *time.Time         `json:"ended_at,omitempty"`
	User               *UserResponseDTO   `json:"user,omitempty"`
	LiveStreamAnalytic *LiveStreamRespDTO `json:"live_stream_analytic,omitempty"`
}
