package repository

import (
	"errors"
	"gitlab/live/be-live-admin/model"

	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{
		db: db,
	}
}

// Create a new role
func (r *RoleRepository) Create(role *model.Role) error {
	if err := r.db.Create(role).Error; err != nil {
		return err
	}
	return nil
}

// Find a role by ID
func (r *RoleRepository) FindByID(roleID uint) (*model.Role, error) {
	var role model.Role
	if err := r.db.First(&role, roleID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Role not found
		}
		return nil, err
	}
	return &role, nil
}

// Find a role by type
func (r *RoleRepository) FindByType(roleType model.RoleType) (*model.Role, error) {
	var role model.Role
	if err := r.db.Where("type = ?", roleType).First(&role).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // Role not found
		}
		return nil, err
	}
	return &role, nil
}
