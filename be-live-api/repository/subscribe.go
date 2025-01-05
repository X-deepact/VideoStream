package repository

import (
	"gitlab/live/be-live-api/model"
	"gorm.io/gorm"
)

type SubscribeRepository struct {
	db *gorm.DB
}

func newSubscribeRepository(db *gorm.DB) *SubscribeRepository {
	return &SubscribeRepository{
		db: db,
	}
}

func (r *SubscribeRepository) Create(subscribe *model.Subscription) (int64, error) {
	result := r.db.Where("subscriber_id = ? and streamer_id = ?", subscribe.SubscriberID, subscribe.StreamerID).FirstOrCreate(&subscribe)

	return result.RowsAffected, result.Error
}

func (r *SubscribeRepository) Delete(subscribe *model.Subscription) error {
	return r.db.Where("subscriber_id = ? and streamer_id = ?", subscribe.SubscriberID, subscribe.StreamerID).Delete(&subscribe).Error
}

func (r *SubscribeRepository) CheckSubscribed(streamerID, subscriberID uint) (bool, error) {
	var count int64
	if err := r.db.Model(&model.Subscription{}).Where("streamer_id = ? and subscriber_id = ?", streamerID, subscriberID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *SubscribeRepository) GetSubscriptionCount(streamerID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.Subscription{}).Where("streamer_id = ?", streamerID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
