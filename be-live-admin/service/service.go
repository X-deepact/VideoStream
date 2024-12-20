package service

import (
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	User         *UserService
	Admin        *AdminService
	Role         *RoleService
	Stream       *StreamService
	StreamServer *streamServerService
	Category     *CategoryService
}

func NewService(repo *repository.Repository, redis *redis.Client, streamServer *streamServerService) *Service {
	return &Service{
		User:     newUserService(repo, redis),
		Admin:    newAdminService(repo, redis),
		Role:     NewRoleService(repo, redis),
		Category: newCategoryService(repo, redis),
		Stream:   newStreamService(repo, redis, streamServer),
	}
}
