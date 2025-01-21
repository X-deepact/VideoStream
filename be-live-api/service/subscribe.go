package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"
)

type SubscribeService struct {
	repo *repository.Repository
}

func newSubscribeService(repo *repository.Repository) *SubscribeService {
	return &SubscribeService{
		repo: repo,
	}
}

func (s *SubscribeService) Subscribe(subscribe *model.Subscription) (int64, error) {
	return s.repo.Subscribe.Create(subscribe)
}

func (s *SubscribeService) Unsubscribe(subscribe *model.Subscription) error {
	return s.repo.Subscribe.Delete(subscribe)
}

func (s *SubscribeService) GetSubscriptionCount(streamID uint) (int64, error) {
	return s.repo.Subscribe.GetSubscriptionCount(streamID)
}

func (s *SubscribeService) GetSubscribes(filter *dto.SubscribeQuery) (*utils.PaginationModel[dto.Subscription], error) {
	return s.repo.Subscribe.GetSubscribes(filter)
}

func (s *SubscribeService) GetSubscriberIDs(streamerID uint) ([]uint, error) {
	return s.repo.Subscribe.GetSubscriberIDs(streamerID)
}

func (s *SubscribeService) GetSubscription(streamerID uint, subscriberID uint) (*model.Subscription, error) {
	return s.repo.Subscribe.GetSubscription(streamerID, subscriberID)
}

func (s *SubscribeService) Update(subscription *model.Subscription) error {
	return s.repo.Subscribe.Update(subscription)
}
