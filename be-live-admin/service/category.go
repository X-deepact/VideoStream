package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/utils"

	"github.com/redis/go-redis/v9"
)

type CategoryService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newCategoryService(repo *repository.Repository, redis *redis.Client) *CategoryService {
	return &CategoryService{
		repo:  repo,
		redis: redis,
	}

}

func (s *CategoryService) toCategoryDto(category *model.Category) *dto.CategoryRespDto {
	return &dto.CategoryRespDto{
		ID:          category.ID,
		Name:        category.Name,
		CreatedAt:   category.CreatedAt,
		UpdatedAt:   category.UpdatedAt,
		CreatedByID: category.CreatedByID,
		UpdatedByID: category.UpdatedByID,
	}
}

func (s *CategoryService) GetAll() ([]dto.CategoryRespDto, error) {
	categories, err := s.repo.Category.FindAll()
	if err != nil {
		return nil, err
	}
	return utils.Map(categories, func(e model.Category) dto.CategoryRespDto { return *s.toCategoryDto(&e) }), err
}
