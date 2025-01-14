package service

import (
	"gitlab/live/be-live-api/cache"
	"gitlab/live/be-live-api/repository"
)

type Service struct {
	User         *UserService
	StreamServer *streamServerService
	Role         *RoleService
	Stream       *StreamService
	TwoFA        *TwoFAService
	Interaction  *interactionService
	Category     *CategoryService
	Subscribe    *SubscribeService
}

func NewService(repo *repository.Repository, redis cache.RedisStore) *Service {
	streamServer := newStreamServerService()

	return &Service{
		User:         newUserService(repo, redis),
		StreamServer: streamServer,
		Role:         newRoleService(repo),
		Stream:       newStreamService(repo, redis, streamServer),
		TwoFA:        newTwoFAService(repo),
		Interaction:  newInteractionService(repo),
		Category:     newCategoryService(repo),
		Subscribe:    newSubscribeService(repo),
	}
}
