package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type interactionService struct {
	redis *redis.Client
	repo  *repository.Repository
}

func newInteractionService(repo *repository.Repository, redis *redis.Client) *interactionService {
	return &interactionService{
		repo:  repo,
		redis: redis,
	}
}

func (s *interactionService) CreateComment(comment *model.Comment) error {
	return s.repo.Interaction.CreateComment(comment)
}

func (s *interactionService) CreateLike(like *model.Like) error {
	return s.repo.Interaction.CreateLike(like)
}

func (s *interactionService) GetLike(streamID uint, userID uint) (*model.Like, error) {
	return s.repo.Interaction.GetLike(streamID, userID)
}

func (s *interactionService) UpdateLike(like *model.Like) error {
	return s.repo.Interaction.UpdateLike(like)
}

func (s *interactionService) DeleteLike(streamID, userID uint) error {
	return s.repo.Interaction.DeleteLike(streamID, userID)
}

func (s *interactionService) GetInitialLiveMessage(streamID uint) (*dto.InitialLiveMessage, error) {
	message := &dto.InitialLiveMessage{
		Type: dto.LiveInitalType,
	}

	likeCount, err := s.repo.Interaction.GetLikeCount(streamID)
	if err != nil {
		return nil, err
	}
	message.LikeCount = likeCount

	message.Comments, err = s.repo.Interaction.GetLatest100Comments(streamID)
	if err != nil {
		return nil, err
	}
	return message, nil

}
