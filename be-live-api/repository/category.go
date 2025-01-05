package repository

import (
	"gitlab/live/be-live-api/model"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func newCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

func (r *CategoryRepository) GetCategories() ([]*model.Category, error) {
	var categories []*model.Category
	if err := r.db.Order("name").Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}
