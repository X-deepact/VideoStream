package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type UserService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newUserService(repo *repository.Repository, redis *redis.Client) *UserService {
	return &UserService{
		repo:  repo,
		redis: redis,
	}
}

func (us *UserService) CheckUserExist(username string, email string) (bool, error) {
	user, _ := us.repo.User.GetUserByUsernameOrEmail(username, email)

	return user != nil, nil
}

func (us *UserService) CreateUser(register dto.RegisterRequest, roleTypeId uint) (*model.User, error) {
	user, err := us.repo.User.CreateUser(&model.User{
		Username:     register.Username,
		DisplayName:  register.DisplayName,
		Email:        register.Email,
		PasswordHash: register.Password,
		RoleID:       roleTypeId,
	})
	
	if err != nil {
		return nil, err
	}

	// Initialize 2FA settings
	twoFA := &model.TwoFA{
		UserID:       user.ID,
		Secret:       "",  // Empty initially
		Is2faEnabled: false,
	}
	
	if err := us.repo.TwoFA.CreateTwoFA(twoFA); err != nil {
		return nil, err
	}

	return user, nil
}

func (us *UserService) GetUserLogin(username string) (*model.User, error) {
	return us.repo.User.GetUserByUsernameOrEmail(username, username)
}

func (us *UserService) UpdateUser(user *model.User) error {
	return us.repo.User.UpdateUser(user)
}

//func (us *UserService) ForgotPassword(user *model.User, newPassword string) (*model.User, error) {
//	user.PasswordHash, _ = utils.HashPassword(newPassword)
//	return us.repo.User.ForgotPassword(user)
//}
