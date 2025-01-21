package service

import (
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
)

type CategoryService struct {
	repo *repository.Repository
}

func newCategoryService(repo *repository.Repository) *CategoryService {
	return &CategoryService{
		repo: repo,
	}
}

func (s *CategoryService) GetCategories() ([]*model.Category, error) {
	return s.repo.Category.GetCategories()
}
