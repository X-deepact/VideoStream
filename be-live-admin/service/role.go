package service

import (
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
)

type RoleService struct {
	repo *repository.Repository
}

func NewRoleService(repo *repository.Repository) *RoleService {
	return &RoleService{
		repo: repo,
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
