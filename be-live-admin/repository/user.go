package repository

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/utils"
	"time"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func (s *UserRepository) Page(filter *dto.UserQuery, page, limit int) (*utils.PaginationModel[model.User], error) {
	var query = s.db.Model(model.User{})
	if filter != nil && filter.Role != "" {
		query = query.Joins("LEFT JOIN roles ON roles.id = users.role_id").
			Where("roles.type = ? AND roles.type != ?", filter.Role, model.SUPPERADMINROLE)
	}

	if filter != nil && filter.UserName != "" {
		query = query.Where("users.username LIKE ?", "%"+filter.UserName+"%")
	}

	if filter != nil && filter.DisplayName != "" {
		query = query.Where("users.display_name LIKE ?", "%"+filter.DisplayName+"%")
	}

	if filter != nil && filter.Email != "" {
		query = query.Where("users.email LIKE ?", "%"+filter.Email+"%")
	}

	if filter != nil && filter.CreatedBy != "" {
		query = query.Joins("LEFT JOIN users cr ON cr.id = users.created_by_id").
			Where("cr.username LIKE ? OR cr.display_name LIKE ?", "%"+filter.CreatedBy+"%", "%"+filter.CreatedBy+"%")
	}

	if filter != nil && filter.UpdatedBy != "" {
		query = query.Joins("LEFT JOIN users ur ON ur.id = users.updated_by_id").
			Where("ur.username = ? OR ur.display_name = ?", "%"+filter.UpdatedBy+"%", "%"+filter.UpdatedBy+"%")
	}
	if filter != nil && filter.SortBy != "" && filter.Sort != "" {
		query = query.Order(fmt.Sprintf("users.%s %s", filter.SortBy, filter.Sort))
	} else {
		query = query.Order(fmt.Sprintf("users.%s %s", "created_at", "DESC"))
	}

	query = query.Where("users.username != ?", "superAdmin").Preload("Role").Preload("AdminLogs").Preload("CreatedBy").Preload("UpdatedBy")
	pagination, err := utils.CreatePage[model.User](query, page, limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, page, limit)
}

func (r *UserRepository) Update(updatedUser *model.User) error {
	if err := r.db.Updates(updatedUser).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) Delete(id, deletedByID uint) error {
	var userToDelete model.User
	if err := r.db.First(&userToDelete, "id = ?", id).Error; err != nil {
		return err
	}
	// userToDelete.DeletedByID = &deletedByID
	// if err := r.db.Updates(&userToDelete).Error; err != nil {
	// 	return err
	// }
	if err := r.db.Unscoped().Delete(&userToDelete).Error; err != nil {
		return err
	}
	return nil
}

func newUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) Create(user *model.User) error {
	// Perform the database insertion
	if err := r.db.Create(user).Error; err != nil {
		// Provide more context about the error
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByUsername(username string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateOTP(userID uint, otp string, expiresAt time.Time) error {

	if err := r.db.Model(&model.User{}).
		Where("id = ?", userID).
		Updates(map[string]interface{}{
			"otp":            otp,
			"otp_expires_at": expiresAt,
		}).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) ClearOTP(userID uint) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).
		Updates(map[string]interface{}{
			"otp":            nil,
			"otp_expires_at": nil,
		}).Error
}

func (r *UserRepository) UpdatePassword(userID uint, hashedPassword string) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).
		Update("password_hash", hashedPassword).Error
}
