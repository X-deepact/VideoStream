package repository

import (
	"gitlab/live/be-live-api/model"

	"gorm.io/gorm"
)

type StreamRepository struct {
	db *gorm.DB
}

func newStreamRepository(db *gorm.DB) *StreamRepository {
	return &StreamRepository{
		db: db,
	}
}

func (r *StreamRepository) Create(stream *model.Stream) error {
	return r.db.Create(stream).Error
}

func (r *StreamRepository) GetByID(id uint) (*model.Stream, error) {
	var stream model.Stream
	if err := r.db.Where("id = ?", id).First(&stream).Error; err != nil {
		return nil, err
	}
	return &stream, nil
}

func (r *StreamRepository) GetByIDAndStatus(id uint, status model.StreamStatus) (*model.Stream, error) {
	var stream model.Stream
	if err := r.db.Where("id = ? and status = ?", id, status).First(&stream).Error; err != nil {
		return nil, err
	}
	return &stream, nil
}

func (r *StreamRepository) Update(stream *model.Stream) error {
	return r.db.Save(stream).Error
}
