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

type StreamType string

const (
	CAMERASTREAM    StreamType = "camera"
	SOFTWARESTREAM  StreamType = "software" // like obs
	PRERECORDSTREAM StreamType = "pre_record"
)

type LikeEmoteType string

const (
	LikeEmoteTypeLike    LikeEmoteType = "like"
	LikeEmoteTypeDislike LikeEmoteType = "dislike"
	LikeEmoteTypeLaugh   LikeEmoteType = "laugh"
	LikeEmoteTypeSad     LikeEmoteType = "sad"
	LikeEmoteTypeWow     LikeEmoteType = "wow"
	LikeEmoteTypeHeart   LikeEmoteType = "heart"
)

type ViewType string

const (
	ViewTypeLiveView   ViewType = "live_view"
	ViewTypeRecordView ViewType = "record_view"
)

type Stream struct {
	ID          uint         `gorm:"primaryKey"`
	UserID      uint         `gorm:"not null"`
	Title       string       `gorm:"type:varchar(100);not null"`
	Description string       `gorm:"type:text"`
	Status      StreamStatus `gorm:"type:varchar(50);not null"`
	// StreamURL    string       `gorm:"type:text;not null"`
	StreamToken       sql.NullString `gorm:"type:text"`          // generated from streaming server
	StreamKey         string         `gorm:"type:text;not null"` // generated from web
	StreamType        StreamType     `gorm:"type:varchar(50);not null"`
	ThumbnailFileName string         `gorm:"type:text;not null"`
	StartedAt         sql.NullTime   `gorm:"column:started_at"`
	EndedAt           sql.NullTime   `gorm:"column:ended_at"`
	CreatedAt         time.Time      `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt         time.Time      `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	User              User           `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Notification struct {
	ID        uint         `gorm:"primaryKey"`
	UserID    uint         `gorm:"column:user_id;not null"`
	StreamID  uint         `gorm:"column:stream_id"`
	Type      string       `gorm:"type:varchar(50);not null"`
	Content   string       `gorm:"type:text;not null"`
	CreatedAt time.Time    `gorm:"default:CURRENT_TIMESTAMP;not null"`
	ReadAt    sql.NullTime `gorm:"column:read_at"`
	Stream    Stream       `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User         `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
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
	SubscriberID uint      `gorm:"not null;uniqueIndex:idx_streamer_subscriber"`
	StreamerID   uint      `gorm:"not null;uniqueIndex:idx_streamer_subscriber"`
	CreatedAt    time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	// StartDate      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	// EndDate        time.Time `gorm:"not null"`
	// AutoRenew      bool      `gorm:"not null"`
	Subscriber User `gorm:"foreignKey:SubscriberID;constraint:OnDelete:CASCADE"`
	Streamer   User `gorm:"foreignKey:StreamerID;constraint:OnDelete:CASCADE"`
}

type StreamAnalytics struct {
	ID        uint      `gorm:"primaryKey"`
	StreamID  uint      `gorm:"not null;unique"`
	Views     uint      `gorm:"not null"`
	Likes     uint      `gorm:"not null"`
	Comments  uint      `gorm:"not null"`
	VideoSize uint      `gorm:"not null"`           // in bytes
	Duration  uint      `gorm:"not null;default:0"` // in micro seconds
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
}

type Like struct {
	ID        uint          `gorm:"primaryKey"`
	UserID    uint          `gorm:"not null;uniqueIndex:idx_user_stream"`
	StreamID  uint          `gorm:"not null;uniqueIndex:idx_user_stream"`
	LikeEmote LikeEmoteType `gorm:"type:varchar(50);not null"`
	CreatedAt time.Time     `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt time.Time     `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	Stream    Stream        `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User          `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Comment struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	StreamID  uint      `gorm:"not null"`
	Comment   string    `gorm:"type:text;not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}
type Share struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null"`
	StreamID  uint      `gorm:"not null"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type Category struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"type:varchar(50);not null;unique"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	CreatedByID uint      `gorm:"column:created_by_id;not null"`
	UpdatedByID uint      `gorm:"column:updated_by_id;not null"`
}

type StreamCategory struct {
	CategoryID uint      `gorm:"primaryKey"`
	StreamID   uint      `gorm:"primaryKey"`
	CreatedAt  time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	Stream     Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	Category   Category  `gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE"`
}

type View struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_view_user_stream"`
	StreamID  uint      `gorm:"not null;uniqueIndex:idx_view_user_stream"`
	ViewType  ViewType  `gorm:"type:varchar(50);not null"`
	IsViewing bool      `gorm:"not null;default:false"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

type ScheduleStream struct {
	ID          uint      `gorm:"primaryKey"`
	ScheduledAt time.Time `gorm:"not null"`
	StreamID    uint      `gorm:"not null"`
	VideoName   string    `gorm:"type:text;not null"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	Stream      Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
}

type Bookmark struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_bookmark_user_stream"`
	StreamID  uint      `gorm:"not null;uniqueIndex:idx_bookmark_user_stream"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;not null"`
	Stream    Stream    `gorm:"foreignKey:StreamID;constraint:OnDelete:CASCADE"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP;autoUpdateTime;not null"`
	User      User      `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}
