package service

import (
	"gitlab/live/be-live-api/cache"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
)

type UserService struct {
	repo       *repository.Repository
	redisStore cache.RedisStore
}

func newUserService(repo *repository.Repository, redis cache.RedisStore) *UserService {
	return &UserService{
		repo:       repo,
		redisStore: redis,
	}
}

func (us *UserService) CheckUserExist(username string, email string) (bool, error) {
	user, _ := us.repo.User.GetUserByUsernameOrEmail(username, email)

	return user != nil, nil
}

func (us *UserService) CreateUser(register dto.RegisterRequest, roleTypeId uint) (*model.User, error) {
	return us.repo.User.CreateUser(&model.User{
		Username:     register.Username,
		DisplayName:  register.DisplayName,
		Email:        register.Email,
		PasswordHash: register.Password,
		RoleID:       roleTypeId,
	})
}

func (us *UserService) GetUserLogin(username string) (*model.User, error) {
	return us.repo.User.GetUserByUsernameOrEmail(username, username)
}

func (us *UserService) UpdateUser(user *model.User) error {
	return us.repo.User.UpdateUser(user)
}

func (us *UserService) AddNumNotification(id uint) error {
	return us.repo.User.AddNumNotification(id)
}

func (us *UserService) GetUser(id uint) (*model.User, error) {
	return us.repo.User.GetUser(id)
}

//func (us *UserService) ForgotPassword(user *model.User, newPassword string) (*model.User, error) {
//	user.PasswordHash, _ = utils.HashPassword(newPassword)
//	return us.repo.User.ForgotPassword(user)
//}
