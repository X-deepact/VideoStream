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

func (ir *InteractionRepository) GetLikeCountByLikeEmoteType(streamID uint, likeEmoteType model.LikeEmoteType) (int64, error) {
	var count int64
	if err := ir.db.Model(&model.Like{}).Where("stream_id = ? AND like_emote = ?", streamID, likeEmoteType).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (ir *InteractionRepository) GetCurrentLikeEmoteType(userID uint, streamID uint) (model.LikeEmoteType, error) {
	var like model.Like
	if err := ir.db.Where("user_id = ? AND stream_id = ?", userID, streamID).First(&like).Error; err != nil {
		return "", err
	}

	return like.LikeEmote, nil
}

func (ir *InteractionRepository) GetLatest100Comments(streamID uint) ([]*dto.LiveCommentInfo, error) {
	var comments []*dto.LiveCommentInfo

	if err := ir.db.Model(&model.Comment{}).
		Select("comments.id, users.display_name, users.username, users.avatar_file_name, comments.comment as content, comments.created_at").
		Joins("join users on users.id = comments.user_id").
		Where("comments.stream_id = ?", streamID).
		Order("comments.created_at desc").
		Limit(100).
		Find(&comments).Error; err != nil {
		return nil, err
	}
	return comments, nil
}

func (ir *InteractionRepository) GetCommentInfoByCommentID(commentID uint) (*dto.LiveCommentInfo, error) {
	var comment dto.LiveCommentInfo
	if err := ir.db.Model(&model.Comment{}).
		Select("comments.id, users.display_name, users.username, users.avatar_file_name, comments.comment as content, comments.created_at").
		Joins("join users on users.id = comments.user_id").
		Where("comments.id = ?", commentID).First(&comment).Error; err != nil {
		return nil, err
	}
	return &comment, nil

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

func (r *InteractionRepository) CountViewsByStreamID(streamID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.View{}).Where("stream_id = ?", streamID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *InteractionRepository) CountLikesByStreamID(streamID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.Like{}).Where("stream_id = ?", streamID).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (r *InteractionRepository) CountCommentsByStreamID(streamID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.Comment{}).Where("stream_id = ?", streamID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *InteractionRepository) FirstOrCreateViewRecord(view *model.View) (int64, error) {
	result := r.db.Where("stream_id = ? and user_id = ?", view.StreamID, view.UserID).FirstOrCreate(&view)

	return result.RowsAffected, result.Error
}

func (r *InteractionRepository) GetComment(id uint) (*model.Comment, error) {
	var comment model.Comment
	if err := r.db.First(&comment, id).Error; err != nil {
		return nil, err
	}
	return &comment, nil
}

func (r *InteractionRepository) UpdateComment(comment *model.Comment) error {
	return r.db.Save(comment).Error
}

func (r *InteractionRepository) DeleteComment(id uint) error {
	return r.db.Delete(&model.Comment{}, id).Error
}

func (r *InteractionRepository) CountViewsByStreamLiveID(streamID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.View{}).Where("stream_id = ? and is_viewing", streamID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *InteractionRepository) UpdateViewRecord(view *model.View) error {
	return r.db.Save(view).Error
}

func (r *InteractionRepository) FirstOrCreateBookmarkRecord(bookmark *model.Bookmark) error {
	return r.db.Where("stream_id = ? and user_id = ?", bookmark.StreamID, bookmark.UserID).FirstOrCreate(&bookmark).Error
}

func (r *InteractionRepository) DeleteBookmark(streamID, userID uint) error {
	return r.db.Where("stream_id = ? and user_id = ?", streamID, userID).Delete(&model.Bookmark{}).Error
}

func (r *InteractionRepository) FirstOrCreateShareRecord(share *model.Share) (int64, error) {
	result := r.db.Where("stream_id = ? and user_id = ?", share.StreamID, share.UserID).FirstOrCreate(&share)

	return result.RowsAffected, result.Error
}

func (r *InteractionRepository) CountSharesByStreamID(streamID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&model.Share{}).Where("stream_id = ?", streamID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
