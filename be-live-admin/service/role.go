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

func NewRoleService(repo *repository.Repository, redis *redis.Client) *RoleService {
	return &RoleService{
		repo:  repo,
		redis: redis,
	}
}

func (s *RoleService) CreateRole(role *model.Role) error {
	return s.repo.Role.Create(role)
}

func (s *RoleService) GetRoleByID(roleID uint) (*model.Role, error) {
	return s.repo.Role.FindByID(roleID)
}

func (s *RoleService) GetRoleByType(roleType model.RoleType) (*model.Role, error) {
	return s.repo.Role.FindByType(roleType)
}
