package repository

import (
	"gitlab/live/be-live-api/model"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func newUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (ur *UserRepository) CreateUser(user *model.User) (*model.User, error) {
	if err := ur.db.Create(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (ur *UserRepository) GetUserByUsernameOrEmail(username string, email string) (*model.User, error) {
	var user model.User
	if err := ur.db.Preload("Role").Where("username = ? or email = ?", username, email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (ur *UserRepository) ForgotPassword(user *model.User) (*model.User, error) {
	if err := ur.db.Save(user).Error; err != nil {
		return nil, err
	}
	return user, nil
}

func (ur *UserRepository) UpdateUser(user *model.User) error {
	if err := ur.db.Save(user).Error; err != nil {
		return err
	}
	return nil
}
