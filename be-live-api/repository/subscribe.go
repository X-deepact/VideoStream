package repository

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
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

func (r *SubscribeRepository) GetSubscriptionCount(streamerID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.Subscription{}).Where("streamer_id = ?", streamerID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *SubscribeRepository) GetSubscribes(filter *dto.SubscribeQuery) (*utils.PaginationModel[dto.Subscription], error) {
	var query = r.db.Model(dto.Subscription{}).
		Select("subscriptions.*, sc.num_subscribed, vc.num_video").
		Where("subscriptions.subscriber_id = ?", filter.UserID).
		Order("subscriptions.created_at DESC").
		Preload("Streamer")

	query = query.Where("subscriptions.subscriber_id = ?", filter.UserID)

	subscribeCounts := r.db.Model(&model.Subscription{}).
		Select("streamer_id, COUNT(*) AS num_subscribed").
		Group("streamer_id")

	query = query.Joins("LEFT JOIN (?) AS sc ON sc.streamer_id = subscriptions.streamer_id", subscribeCounts)

	videoCounts := r.db.Model(&model.Stream{}).
		Select("user_id, COUNT(*) AS num_video").
		Where("status = ?", model.ENDED).
		Group("user_id")

	query = query.Joins("LEFT JOIN (?) AS vc ON vc.user_id = subscriptions.streamer_id", videoCounts)

	pagination, err := utils.CreatePage[dto.Subscription](query, filter.Page, filter.Limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, filter.Page, filter.Limit)
}

func (r *SubscribeRepository) GetSubscriberIDs(streamerID uint) ([]uint, error) {
	var subscriberIDs []uint

	err := r.db.Model(&dto.Subscription{}).
		Select("subscriber_id").
		Where("streamer_id = ? and is_mute = false", streamerID).Find(&subscriberIDs).Error

	if err != nil {
		return nil, err
	}

	return subscriberIDs, nil
}

func (r *SubscribeRepository) GetSubscription(streamerID uint, subscriberID uint) (*model.Subscription, error) {
	var subscription model.Subscription
	if err := r.db.Where("streamer_id = ? and subscriber_id = ?", streamerID, subscriberID).First(&subscription).Error; err != nil {
		return nil, err
	}
	return &subscription, nil
}

func (r *SubscribeRepository) Update(subscription *model.Subscription) error {
	return r.db.Save(subscription).Error
}
