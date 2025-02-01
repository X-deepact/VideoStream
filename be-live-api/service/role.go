package service

import (
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
)

type RoleService struct {
	repo *repository.Repository
}

func newRoleService(repo *repository.Repository) *RoleService {
	return &RoleService{
		repo: repo,
	}
}

func (us *RoleService) GetRoleByType(roleType model.RoleType) (*model.Role, error) {
	return us.repo.Role.GetRoleByType(roleType)
}
