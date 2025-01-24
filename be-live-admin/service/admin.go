package service

import (
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
	"gitlab/live/be-live-admin/utils"
)

type AdminService struct {
	repo *repository.Repository
}

func newAdminService(repo *repository.Repository) *AdminService {
	return &AdminService{
		repo: repo,
	}
}

func (s *AdminService) toAdminResponseDTO(user *model.User, apiURL string) dto.UserResponseDTO {

	var userResp = new(dto.UserResponseDTO)
	userResp.ID = user.ID
	userResp.Username = user.Username
	userResp.DisplayName = user.DisplayName
	userResp.Email = user.Email
	if user.AvatarFileName.Valid {
		userResp.AvatarFileName = utils.MakeAvatarURL(apiURL, user.AvatarFileName.String)
	}
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
	userResp.CreatedAt = user.CreatedAt
	userResp.UpdatedAt = user.UpdatedAt

	userResp.RoleID = user.RoleID
	userResp.Role = new(dto.RoleDTO)
	userResp.Role.ID = user.Role.ID
	userResp.Role.Type = user.Role.Type
	userResp.Role.Description = user.Role.Description
	userResp.Role.CreatedAt = user.Role.CreatedAt
	userResp.Role.UpdatedAt = user.UpdatedAt

	return *userResp
}

func (s *AdminService) ById(id uint, apiURL string) (*dto.UserResponseDTO, error) {
	user, err := s.repo.Admin.ById(id)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, nil
	}
	result := s.toAdminResponseDTO(user, apiURL)
	return &result, err
}

func (s *AdminService) MakeAdminLogModel(userID uint, action model.AdminAction, details string) *model.AdminLog {
	return &model.AdminLog{
		UserID:  userID,
		Action:  string(action),
		Details: details,
	}
}

func (s *AdminService) GetAdminLogs(req *dto.AdminLogQuery) (*utils.PaginationModel[dto.AdminLogRespDTO], error) {
	pagination, err := s.repo.Admin.GetAdminLogs(req)
	if err != nil {
		return nil, err
	}
	var result utils.PaginationModel[dto.AdminLogRespDTO]
	result.BasePaginationModel = pagination.BasePaginationModel
	for _, v := range pagination.Page {
		var data dto.AdminLogRespDTO
		data.ID = v.ID
		data.Action = v.Action
		data.Details = v.Details
		data.PerformedAt = v.PerformedAt
		data.User.ID = v.UserID
		data.User.Username = v.User.Username
		data.User.DisplayName = v.User.DisplayName
		data.User.Email = v.User.Email
		data.User.CreatedAt = v.User.CreatedAt
		data.User.UpdatedAt = v.User.UpdatedAt

		result.Page = append(result.Page, data)
	}

	return &result, err
}

func (s *AdminService) GetAdmins() ([]dto.AdminResp, error) {
	var result []dto.AdminResp
	list, err := s.repo.Admin.GetAdmins()
	if err != nil {
		return nil, err
	}

	for _, v := range list {
		var data dto.AdminResp
		data.ID = v.ID
		data.Username = v.Username
		data.DisplayName = v.DisplayName
		result = append(result, data)
	}

	return result, err
}

func (s *AdminService) CreateLog(adminLog *model.AdminLog) error {
	return s.repo.Admin.Create(adminLog)
}

func (s *AdminService) GetActionByName(name string) (*model.Action, error) {
	return s.repo.Admin.GetAdminActionByName(name)
}

func (s *AdminService) CreateAdminAction(name string) error {
	return s.repo.Admin.CreateAdminAction(name)
}

func (s *AdminService) GetAdminActions() ([]string, error) {
	return s.repo.Admin.GetAdminActions()
}
