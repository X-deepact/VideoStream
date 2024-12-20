package model

import (
	"database/sql"
	"time"
)

type StreamStatus string

const (
	PENDING  StreamStatus = "pending"
	STARTED  StreamStatus = "started"
	ENDED    StreamStatus = "ended"
	UPCOMING StreamStatus = "upcoming"
)

type LikeEmoteType string

type StreamType string

const (
	CAMERASTREAM   StreamType = "camera"
	SOFTWARESTREAM StreamType = "software" // like obs
)

const (
	LikeEmoteTypeLike    LikeEmoteType = "like"
	LikeEmoteTypeDislike LikeEmoteType = "dislike"
	LikeEmoteTypeLaugh   LikeEmoteType = "laugh"
	LikeEmoteTypeSad     LikeEmoteType = "sad"
	LikeEmoteTypeWow     LikeEmoteType = "wow"
	LikeEmoteTypeHeart   LikeEmoteType = "heart"
)

type Stream struct {
	ID          uint         `gorm:"primaryKey"`
	UserID      uint         `gorm:"not null"`
	Title       string       `gorm:"type:varchar(100);not null"`
	Description string       `gorm:"type:text"`
	Status      StreamStatus `gorm:"type:varchar(50);not null"`
	// StreamURL    string       `gorm:"type:text;not null"`
	StreamToken       string       `gorm:"type:text;not null"` // generated from streaming server
	StreamKey         string       `gorm:"type:text;not null"` // generated from web
	StreamType        StreamType   `gorm:"type:varchar(50);not null"`
	ThumbnailFileName string       `gorm:"type:text;not null"`
	StartedAt         sql.NullTime `gorm:"column:started_at"`
	EndedAt           sql.NullTime `gorm:"column:ended_at"`
	User              User         `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Notification struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	StreamID  uint      `gorm:"not null"`
	Content   string    `gorm:"type:text;not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// type Chat struct {
// 	MessageID uint      `gorm:"primaryKey;autoIncrement"`
// 	StreamID  uint      `gorm:"not null"`
// 	UserID    uint      `gorm:"not null"`
// 	Message   string    `gorm:"type:text;not null"`
// 	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
// 	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
// 	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
// }

type Subscription struct {
	ID           uint      `gorm:"primaryKey"`
	SubscriberID uint      `gorm:"not null"`
	StreamerID   uint      `gorm:"not null"`
	CreatedAt    time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	// StartDate      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	// EndDate        time.Time `gorm:"not null"`
	// AutoRenew      bool      `gorm:"not null"`
	Subscriber User `gorm:"foreignKey:SubscriberID;constraint:OnDelete:CASCADE"`
	Streamer   User `gorm:"foreignKey:StreamerID;constraint:OnDelete:CASCADE"`
}

type StreamAnalytics struct {
	ID        uint      `gorm:"primaryKey"`
	StreamID  uint      `gorm:"not null"`
	Views     uint      `gorm:"not null"`
	Likes     uint      `gorm:"not null"`
	Comments  uint      `gorm:"not null"`
	VideoSize uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
}

type Like struct {
	ID        uint          `gorm:"primaryKey"`
	UserID    uint          `gorm:"not null;uniqueIndex:idx_user_stream"`
	StreamID  uint          `gorm:"not null;uniqueIndex:idx_user_stream"`
	LikeEmote LikeEmoteType `gorm:"type:varchar(50);not null"`
	CreatedAt time.Time     `gorm:"default:CURRENT_TIMESTAMP"`
	Stream    Stream        `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User          `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Comment struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	StreamID  uint      `gorm:"not null"`
	Comment   string    `gorm:"type:text;not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}
type Share struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	StreamID  uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Category struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"type:varchar(50);not null;unique"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime"`
	CreatedByID uint      `gorm:"column:created_by_id;not null"`
	UpdatedByID uint      `gorm:"column:updated_by_id;not null"`
}

type StreamCategory struct {
	CategoryID uint      `gorm:"primaryKey"`
	StreamID   uint      `gorm:"primaryKey"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	Stream     Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	Category   Category  `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE"`
}
