package repository

import (
	"gitlab/live/be-live-api/model"

	"gorm.io/gorm"
)

type RoleRepository struct {
	db *gorm.DB
}

func newRoleRepository(db *gorm.DB) *RoleRepository {
	return &RoleRepository{
		db: db,
	}
}

func (ur *RoleRepository) GetRoleByType(roleType model.RoleType) (*model.Role, error) {
	var role model.Role
	if err := ur.db.Where("type = ?", roleType).First(&role).Error; err != nil {
		return nil, err
	}
	return &role, nil
}
