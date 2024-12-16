package repository

import (
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"

	"gorm.io/gorm"
)

type InteractionRepository struct {
	db *gorm.DB
}

func newInteractionRepository(db *gorm.DB) *InteractionRepository {
	return &InteractionRepository{
		db: db,
	}
}

func (ir *InteractionRepository) CreateComment(comment *model.Comment) error {
	return ir.db.Create(comment).Error
}

func (ir *InteractionRepository) CreateLike(like *model.Like) error {
	return ir.db.Create(like).Error
}

func (ir *InteractionRepository) GetLike(streamID uint, userID uint) (*model.Like, error) {
	var like model.Like
	if err := ir.db.Where("stream_id = ? and user_id = ?", streamID, userID).First(&like).Error; err != nil {
		return nil, err
	}
	return &like, nil
}

func (ir *InteractionRepository) UpdateLike(like *model.Like) error {
	return ir.db.Save(like).Error
}

func (ir *InteractionRepository) DeleteLike(streamID, userID uint) error {
	return ir.db.Where("stream_id = ? and user_id = ?", streamID, userID).Delete(&model.Like{}).Error
}

func (ir *InteractionRepository) GetLikeCount(streamID uint) (int64, error) {
	var count int64
	if err := ir.db.Model(&model.Like{}).Where("stream_id = ?", streamID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (ir *InteractionRepository) GetLatest100Comments(streamID uint) ([]*dto.LiveComment, error) {
	var comments []*dto.LiveComment
	if err := ir.db.Model(&model.Comment{}).
		Select("comment as content").
		Where("stream_id = ?", streamID).
		Order("created_at desc").
		Limit(100).
		Find(&comments).Error; err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *InteractionRepository) GetComments(streamID uint, page, limit int) (*utils.PaginationModel[model.Comment], error) {
	var query = r.db.Model(model.Comment{})

	query = query.Order(fmt.Sprintf("comments.%s %s", "created_at", "DESC"))

	query = query.Where("comments.stream_id = ?", streamID).Preload("User")
	pagination, err := utils.CreatePage[model.Comment](query, page, limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, page, limit)
}
