package repository

import (
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/utils"

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

func (r *CategoryRepository) Update(category *model.Category) error {
	if err := r.db.Save(category).Error; err != nil {
		return err
	}
	return nil
}

func (r *CategoryRepository) FindByID(id uint) (*model.Category, error) {
	var category model.Category
	if err := r.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (r *CategoryRepository) Delete(id uint) error {
	if err := r.db.Delete(&model.Category{}, id).Error; err != nil {
		return err
	}
	return nil
}

func (r *CategoryRepository) FindAll(dto *dto.CategoryQueryDTO) (*utils.PaginationModel[model.Category], error) {
	query := r.db.Model(model.Category{}).Joins("LEFT JOIN users cr ON cr.id = categories.created_by_id").Joins("LEFT JOIN users ur ON ur.id = categories.updated_by_id")
	if dto.Name != "" {
		query = query.Where("categories.name = ?", dto.Name)
	}
	if dto.CreatedBy != "" {
		query = query.Where("cr.username = ?", dto.CreatedBy)
	}
	if dto.SortBy != "" {
		if dto.SortBy == "created_by" {
			query = query.Order("cr.username " + dto.Sort)
		} else if dto.SortBy == "updated_by" {
			query = query.Order("ur.username " + dto.Sort)
		} else {
			query = query.Order(fmt.Sprintf("categories.%s %s", dto.SortBy, dto.Sort))
		}
	}

	pagination, err := utils.CreatePage[model.Category](query, int(dto.Page), int(dto.Limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(dto.Page), int(dto.Limit))
}
