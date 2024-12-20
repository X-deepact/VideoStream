package service

import (
	"database/sql"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/utils"
	"time"

	"github.com/redis/go-redis/v9"
)

type UserService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func (s *UserService) toUserResponseDTO(user *model.User) dto.UserResponseDTO {

	var userResp = new(dto.UserResponseDTO)
	userResp.ID = user.ID
	userResp.Username = user.Username
	userResp.DisplayName = user.DisplayName
	userResp.Email = user.Email

	if user.CreatedBy != nil {
		userResp.CreatedByID = user.CreatedByID

		userResp.CreatedBy = new(dto.UserResponseDTO)
		userResp.CreatedBy.ID = user.CreatedBy.ID
		userResp.CreatedBy.Username = user.CreatedBy.Username
		userResp.CreatedBy.DisplayName = user.CreatedBy.DisplayName
		userResp.CreatedBy.Email = user.CreatedBy.Email
		userResp.CreatedBy.CreatedAt = user.CreatedBy.CreatedAt
		userResp.CreatedBy.UpdatedAt = user.CreatedBy.UpdatedAt
	}

	if user.UpdatedBy != nil {
		userResp.UpdatedByID = user.UpdatedByID

		userResp.UpdatedBy = new(dto.UserResponseDTO)
		userResp.UpdatedBy.ID = user.UpdatedBy.ID
		userResp.UpdatedBy.Username = user.UpdatedBy.Username
		userResp.UpdatedBy.DisplayName = user.UpdatedBy.DisplayName
		userResp.UpdatedBy.Email = user.UpdatedBy.Email
		userResp.UpdatedBy.CreatedAt = user.UpdatedBy.CreatedAt
		userResp.UpdatedBy.UpdatedAt = user.UpdatedBy.UpdatedAt
	}

	userResp.DeletedByID = user.DeletedByID
	userResp.DeletedAt = user.DeletedAt
	userResp.CreatedAt = user.CreatedAt
	userResp.UpdatedAt = user.UpdatedAt

	userResp.RoleID = user.RoleID
	userResp.Role = new(dto.RoleDTO)
	userResp.Role.ID = user.Role.ID
	userResp.Role.Type = user.Role.Type
	userResp.Role.Description = user.Role.Description
	userResp.Role.CreatedAt = user.Role.CreatedAt
	userResp.Role.UpdatedAt = user.UpdatedAt

	if len(user.AdminLogs) > 0 {
		var adminLogs []dto.AdminLogDTO
		for _, v := range user.AdminLogs {
			adminLogs = append(adminLogs, dto.AdminLogDTO{ID: v.ID, UserID: v.UserID, Action: v.Action, PerformedAt: v.PerformedAt})
		}
		userResp.AdminLogs = append(userResp.AdminLogs, adminLogs...)
	}

	return *userResp
}

func (s *UserService) GetUserList(filter *dto.UserQuery, page, limit int) (*utils.PaginationModel[dto.UserResponseDTO], error) {
	pagination, err := s.repo.User.Page(filter, page, limit)
	if err != nil {
		return nil, err
	}
	var newPage = new(utils.PaginationModel[dto.UserResponseDTO])
	newPage.Page = utils.Map(pagination.Page, func(e model.User) dto.UserResponseDTO { return s.toUserResponseDTO(&e) })
	newPage.BasePaginationModel = pagination.BasePaginationModel
	return newPage, err

}

func (s *UserService) DeleteByID(id uint, deletedByID uint) error {
	if err := s.repo.User.Delete(id, deletedByID); err != nil {
		return err
	}
	return nil

}

func (s *UserService) toUpdatedUserDTO(user *model.User, role model.RoleType) *dto.UpdateUserResponse {
	return &dto.UpdateUserResponse{
		UserName:    user.Username,
		DisplayName: user.DisplayName,
		Email:       user.Email,
		UpdatedAt:   user.UpdatedAt,
		Role:        role,
	}
}

func (s *UserService) UpdateUser(updatedUser *dto.UpdateUserRequest, id uint) (*dto.UpdateUserResponse, error) {

	user, err := s.repo.Admin.ById(id)
	if err != nil {
		return nil, err
	}

	role, err := s.repo.Role.FindByType(updatedUser.RoleType)
	if err != nil {
		return nil, err
	}

	user.Username = updatedUser.UserName
	user.DisplayName = updatedUser.DisplayName
	user.Email = updatedUser.Email
	user.Role = *role
	if updatedUser.AvatarFileName != "" {
		user.AvatarFileName = sql.NullString{String: updatedUser.AvatarFileName, Valid: true}
	}
	user.UpdatedBy = nil
	user.UpdatedByID = updatedUser.UpdatedByID
	user.UpdatedAt = time.Now()

	if err := s.repo.User.Update(user); err != nil {
		return nil, err
	}

	return s.toUpdatedUserDTO(user, updatedUser.RoleType), err

}

func newUserService(repo *repository.Repository, redis *redis.Client) *UserService {
	return &UserService{
		repo:  repo,
		redis: redis,
	}

}

func (s *UserService) Create(user *model.User) error {
	return s.repo.User.Create(user)
}

func (s *UserService) FindByEmail(email string) (*model.User, error) {
	return s.repo.User.FindByEmail(email)
}

func (s *UserService) FindByUsername(username string) (*model.User, error) {
	return s.repo.User.FindByUsername(username)
}
func (s *UserService) Update(user *model.User) error {
	return s.repo.User.Update(user)
}

func (s *UserService) UpdateOTP(userID uint, otp string, expiresAt time.Time) error {
	return s.repo.User.UpdateOTP(userID, otp, expiresAt)
}

func (s *UserService) ClearOTP(userID uint) error {
	return s.repo.User.ClearOTP(userID)
}

func (s *UserService) UpdatePassword(userID uint, hashedPassword string) error {
	return s.repo.User.UpdatePassword(userID, hashedPassword)
}
