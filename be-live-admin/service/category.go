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

func (s *CategoryService) GetAll(request *dto.CategoryQueryDTO) (*utils.PaginationModel[dto.CategoryRespDto], error) {
	var newPage = new(utils.PaginationModel[dto.CategoryRespDto])
	categories, err := s.repo.Category.FindAll(request)
	if err != nil {
		return nil, err
	}
	newPage.BasePaginationModel = categories.BasePaginationModel
	for _, category := range categories.Page {
		newPage.Page = append(newPage.Page, *s.toCategoryDto(&category))
	}
	return newPage, err
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

func (s *CategoryService) UpdateCategory(id uint, request *dto.CategoryUpdateRequestDTO) (*dto.CategoryRespDto, error) {

	category, err := s.repo.Category.FindByID(id)
	if err != nil {
		return nil, err
	}
	category.Name = request.Name
	category.UpdatedAt = time.Now()
	category.UpdatedByID = request.UpdatedByID

	if err := s.repo.Category.Update(category); err != nil {
		return nil, err
	}
	return s.toCategoryDto(category), nil
}

func (s *CategoryService) DeleteCategory(id uint) error {
	return s.repo.Category.Delete(id)
}
