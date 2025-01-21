package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"
)

type NotificationService struct {
	repo *repository.Repository
}

func newNotificationService(repo *repository.Repository) *NotificationService {
	return &NotificationService{
		repo: repo,
	}
}

func (s *NotificationService) GetNotifications(userID uint, page int, limit int) (*utils.PaginationModel[dto.Notification], error) {
	return s.repo.Notification.GetNotifications(userID, page, limit)
}

func (s *NotificationService) GetNotification(id uint) (*model.Notification, error) {
	return s.repo.Notification.GetNotification(id)
}

func (s *NotificationService) Create(notification *model.Notification) error {
	return s.repo.Notification.Create(notification)
}

func (s *NotificationService) Update(notification *model.Notification) error {
	return s.repo.Notification.Update(notification)
}

func (s *NotificationService) UpdateEndStream(streamID uint) error {
	return s.repo.Notification.UpdateEndStream(streamID)
}
