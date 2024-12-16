package service

import (
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type RoleService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newRoleService(repo *repository.Repository, redis *redis.Client) *RoleService {
	return &RoleService{
		repo:  repo,
		redis: redis,
	}
}

func (us *RoleService) GetRoleByType(roleType model.RoleType) (*model.Role, error) {
	return us.repo.Role.GetRoleByType(roleType)
}
