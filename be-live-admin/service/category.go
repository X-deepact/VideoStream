package service

import (
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
	"gitlab/live/be-live-admin/utils"
	"time"
)

type CategoryService struct {
	repo *repository.Repository
}

func newCategoryService(repo *repository.Repository) *CategoryService {
	return &CategoryService{
		repo: repo,
	}

}

func (s *CategoryService) toCategoryDto(category *model.Category) *dto.CategoryRespDto {
	var result = &dto.CategoryRespDto{
		ID:          category.ID,
		Name:        category.Name,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
		CreatedByID: category.CreatedByID,
		UpdatedByID: category.UpdatedByID,
	}
	result.CreatedByUser = new(dto.UserResponseDTO)

	createBy, err := s.repo.User.FindByID(int(category.CreatedByID))
	if err != nil {
		return nil
	}

	result.CreatedByUser.ID = createBy.ID
	result.CreatedByUser.Username = createBy.Username
	result.CreatedByUser.DisplayName = createBy.DisplayName
	result.CreatedByUser.Email = createBy.Email
	result.CreatedByUser.CreatedAt = createBy.CreatedAt
	result.CreatedByUser.UpdatedAt = createBy.UpdatedAt

	if category.UpdatedByID != 0 {
		updateBy, err := s.repo.User.FindByID(int(category.UpdatedByID))
		if err != nil {
			return nil
		}
		result.UpdatedByUser = new(dto.UserResponseDTO)
		result.UpdatedByUser.ID = updateBy.ID
		result.UpdatedByUser.Username = updateBy.Username
		result.UpdatedByUser.DisplayName = updateBy.DisplayName
		result.UpdatedByUser.Email = updateBy.Email
		result.UpdatedByUser.CreatedAt = updateBy.CreatedAt
		result.UpdatedByUser.UpdatedAt = updateBy.UpdatedAt
	}

	return result
}

func (s *CategoryService) GetAll() ([]dto.CategoryRespDto, error) {
	categories, err := s.repo.Category.FindAll()
	if err != nil {
		return nil, err
	}
	return utils.Map(categories, func(e model.Category) dto.CategoryRespDto { return *s.toCategoryDto(&e) }), err
}

func (s *CategoryService) CreateCategory(request *dto.CategoryRequestDTO) error {
	var category model.Category

	category.CreatedAt = time.Now()
	category.UpdatedAt = time.Now()
	category.CreatedByID = request.CreatedByID
	category.UpdatedByID = request.CreatedByID
	category.Name = request.Name

	if err := s.repo.Category.Create(&category); err != nil {
		return err
	}
	return nil
}
