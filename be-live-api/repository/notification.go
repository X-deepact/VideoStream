package repository

import (
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gorm.io/gorm"
)

type NotificationRepository struct {
	db *gorm.DB
}

func newNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{
		db: db,
	}
}

func (r *NotificationRepository) GetNotifications(userID uint, page, limit int) (*utils.PaginationModel[dto.Notification], error) {
	var query = r.db.Model(dto.Notification{})

	query = query.Select("notifications.*, ss.streamer_id, ss.is_mute")
	query = query.Joins("LEFT JOIN streams s ON s.id = notifications.stream_id").
		Joins("LEFT JOIN subscriptions ss ON ss.streamer_id = s.user_id and ss.subscriber_id = notifications.user_id")
	query = query.Order(fmt.Sprintf("notifications.%s %s", "created_at", "DESC"))

	query = query.Where("notifications.user_id = ? and notifications.hidden_at is null", userID).Preload("Stream.User")
	pagination, err := utils.CreatePage[dto.Notification](query, page, limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, page, limit)
}

func (r *NotificationRepository) GetNotification(id uint) (*model.Notification, error) {
	var notification model.Notification
	if err := r.db.First(&notification, id).Error; err != nil {
		return nil, err
	}
	return &notification, nil
}

func (r *NotificationRepository) Create(notification *model.Notification) error {
	if err := r.db.Create(notification).Error; err != nil {
		return err
	}
	return nil
}

func (r *NotificationRepository) Update(notification *model.Notification) error {
	if err := r.db.Save(notification).Error; err != nil {
		return err
	}
	return nil
}

func (r *NotificationRepository) UpdateEndStream(streamID uint) error {
	return r.db.Model(&model.Notification{}).
		Where("stream_id = ? AND type = ?", streamID, model.NotificationTypeSubscribeLive).
		Update("type", model.NotificationTypeSubscribeVideo).
		Error
}
