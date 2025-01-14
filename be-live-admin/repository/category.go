package repository

import (
	"gitlab/live/be-live-admin/model"

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

// Create a new category
func (r *CategoryRepository) Create(category *model.Category) error {
	if err := r.db.Create(category).Error; err != nil {
		return err
	}
	return nil
}

func (r *CategoryRepository) FindAll() ([]model.Category, error) {
	var categories []model.Category
	if err := r.db.Model(model.Category{}).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}
