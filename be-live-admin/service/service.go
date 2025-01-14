package service

import (
	"context"
	"gitlab/live/be-live-admin/cache"
	"gitlab/live/be-live-admin/repository"
	"time"
)

type Service struct {
	User         *UserService
	Admin        *AdminService
	Role         *RoleService
	Stream       *StreamService
	StreamServer *streamServerService
	Category     *CategoryService

	redisStore cache.RedisStore
}

func NewService(repo *repository.Repository, redis cache.RedisStore, streamServer *streamServerService) *Service {
	return &Service{
		User:       newUserService(repo, redis),
		Admin:      newAdminService(repo),
		Role:       NewRoleService(repo),
		Category:   newCategoryService(repo),
		Stream:     newStreamService(repo, redis, streamServer),
		redisStore: redis,
	}
}

func (s *Service) SetCache(ctx context.Context, key string, value any, expiration time.Duration) error {
	return s.redisStore.Set(ctx, key, value, expiration)
}
