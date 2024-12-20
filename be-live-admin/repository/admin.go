package repository

import (
	"gitlab/live/be-live-api/model"

	"gorm.io/gorm"
)

type AdminRepository struct {
	db *gorm.DB
}

func (s *AdminRepository) CreateAdmin(newUser *model.User) (*model.User, error) {

	// find role admin
	var role model.Role
	if err := s.db.Model(model.Role{}).Where("type=?", newUser.Role.Type).First(&role).Error; err != nil {
		return nil, err
	}

	newUser.Role = model.Role{}
	newUser.RoleID = role.ID
	if err := s.db.Model(model.User{}).Create(newUser).Error; err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s *AdminRepository) ById(id uint) (*model.User, error) {
	var user model.User
	var query = s.db.Model(model.User{})
	if err := query.Where("users.id=? AND users.deleted_at IS NULL", id).
		Preload("Role").
		Preload("CreatedBy").
		Preload("UpdatedBy").
		Preload("AdminLogs").First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *AdminRepository) Create(adminLog *model.AdminLog) error {
	if err := r.db.Create(adminLog).Error; err != nil {
		return err
	}
	return nil
}
func newAdminRepository(db *gorm.DB) *AdminRepository {
	return &AdminRepository{
		db: db,
	}
}
