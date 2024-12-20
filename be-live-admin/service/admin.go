package service

import (
	"database/sql"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/utils"

	"github.com/redis/go-redis/v9"
)

type AdminService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func (s *AdminService) toCreateAdminDto(user *model.User) *dto.CreateAdminResp {
	return &dto.CreateAdminResp{
		UserName:       user.Username,
		Email:          user.Email,
		DisplayName:    user.DisplayName,
		CreatedAt:      user.CreatedAt,
		AvatarFileName: user.AvatarFileName.String,
		Role:           user.Role.Type,
	}
}

func (s *AdminService) toAdminResponseDTO(user *model.User) dto.UserResponseDTO {

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

func (s *AdminService) CreateAdmin(request *dto.CreateAdminRequest) (*dto.CreateAdminResp, error) {
	var newUser = new(model.User)
	newUser.Username = request.UserName
	newUser.PasswordHash, _ = utils.HashPassword(request.Password)
	newUser.DisplayName = request.DisplayName
	newUser.Email = request.Email
	newUser.CreatedByID = request.CreatedByID
	newUser.UpdatedByID = request.CreatedByID
	newUser.Role.Type = request.RoleType
	if request.AvatarFileName != "" {
		newUser.AvatarFileName = sql.NullString{String: request.AvatarFileName, Valid: true}
	}

	createdUser, err := s.repo.Admin.CreateAdmin(newUser)
	if err != nil {
		return nil, err
	}
	createdUser.Role.Type = request.RoleType
	return s.toCreateAdminDto(createdUser), err
}

func (s *AdminService) ById(id uint) (*dto.UserResponseDTO, error) {
	user, err := s.repo.Admin.ById(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
	}
	result := s.toAdminResponseDTO(user)
	return &result, err
}

func (s *AdminService) CreateLog(adminLog *model.AdminLog) error {
	return s.repo.Admin.Create(adminLog)
}
func newAdminService(repo *repository.Repository, redis *redis.Client) *AdminService {
	return &AdminService{
		repo:  repo,
		redis: redis,
	}
}
