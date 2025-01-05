package service

import (
	"gitlab/live/be-live-admin/cache"
	"gitlab/live/be-live-admin/repository"
)

type Service struct {
	User         *UserService
	Admin        *AdminService
	Role         *RoleService
	Stream       *StreamService
	StreamServer *streamServerService
	Category     *CategoryService
}

func NewService(repo *repository.Repository, redis cache.RedisStore, streamServer *streamServerService) *Service {
	return &Service{
		User:     newUserService(repo, redis),
		Admin:    newAdminService(repo),
		Role:     NewRoleService(repo),
		Category: newCategoryService(repo),
		Stream:   newStreamService(repo, redis, streamServer),
	}
}
