package dto

type SubscribeRequest struct {
	StreamerID uint `json:"streamer_id" form:"streamer_id" validate:"required"`
}
