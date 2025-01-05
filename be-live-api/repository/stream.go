package repository

import (
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"log"
	"slices"
	"time"

	"gorm.io/gorm/clause"

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

func (r *StreamRepository) CreaateStreamCategory(streamCategory *model.StreamCategory) error {
	return r.db.Create(streamCategory).Error
}

func (r *StreamRepository) CreateStreamAndStreamCategory(stream *model.Stream, categoryIDs []uint) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var existingCategoryIDs []uint
	if err := r.db.Model(&model.Category{}).Where("id IN ?", categoryIDs).Pluck("id", &existingCategoryIDs).Error; err != nil {
		return err
	}

	log.Println(existingCategoryIDs, categoryIDs)

	for _, categoryID := range categoryIDs {
		if !slices.Contains(existingCategoryIDs, categoryID) {
			return fmt.Errorf("category id %d does not exist", categoryID)
		}
	}

	if err := tx.Create(stream).Error; err != nil {
		tx.Rollback()
		return err
	}

	for _, categoryID := range categoryIDs {
		streamCategory := &model.StreamCategory{
			StreamID:   stream.ID,
			CategoryID: categoryID,
		}

		if err := tx.Create(streamCategory).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil

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

func (r *StreamRepository) GetStreamAnalyticsByStreamID(streamID uint) (*model.StreamAnalytics, error) {
	var streamAnalytics model.StreamAnalytics
	if err := r.db.Where("stream_id = ?", streamID).First(&streamAnalytics).Error; err != nil {
		return nil, err
	}
	return &streamAnalytics, nil
}
func (r *StreamRepository) CreateStreamAnalytics(streamAnalytics *model.StreamAnalytics) error {
	return r.db.Create(streamAnalytics).Error
}

func (r *StreamRepository) UpdateStreamAnalytics(streamAnalytics *model.StreamAnalytics) error {
	return r.db.Save(streamAnalytics).Error
}

func (r *StreamRepository) GetViewByStreamIDAndUserID(streamID uint, userID uint) (*model.View, error) {
	var view model.View
	if err := r.db.Where("stream_id = ? and user_id = ?", streamID, userID).First(&view).Error; err != nil {
		return nil, err
	}
	return &view, nil
}

func (r *StreamRepository) FirstOrCreateView(view *model.View) error {
	return r.db.Where("stream_id = ? and user_id = ?", view.StreamID, view.UserID).FirstOrCreate(&view).Error

}

func (r *StreamRepository) CreateView(view *model.View) error {
	return r.db.Create(view).Error
}

func (r *StreamRepository) UpdateViewStatus(streamID uint, userID uint, isViewing bool) error {
	return r.db.Model(&model.View{}).Where("stream_id = ? and user_id = ?", streamID, userID).Update("is_viewing", isViewing).Error
}

func (r *StreamRepository) GetStreams(filter *dto.StreamQuery) (*utils.PaginationModel[dto.Stream], error) {
	var query = r.db.Model(dto.Stream{})

	if filter != nil {
		if filter.Title != "" {
			query = query.Where("title ilike ?", "%"+filter.Title+"%")
		}

		if filter.Status != "" {
			if filter.Status == dto.VIDEO {
				filter.Status = dto.StreamStatus(model.ENDED)
			} else if filter.Status == dto.LIVE {
				filter.Status = dto.StreamStatus(model.STARTED)
			}

			query = query.Where("status = ?", filter.Status)
		}

		if filter.IsMe != nil {
			if *filter.IsMe {
				query = query.Where("user_id = ?", filter.UserID)
			} else {
				query = query.Where("user_id != ?", filter.UserID)
			}
		}

		if len(filter.CategoryIDs) > 0 {
			query = query.Where("streams.id IN (?)", r.db.Table("stream_categories").
				Select("stream_id").Where("category_id IN ?", filter.CategoryIDs))
		}
	}

	query = query.Where("status IN (?)", []model.StreamStatus{model.STARTED, model.ENDED, model.UPCOMING})

	query = query.Order(fmt.Sprintf("%s %s", "created_at", "DESC"))

	query = query.Preload("User").Preload("StreamAnalytics")

	pagination, err := utils.CreatePage[dto.Stream](query, filter.Page, filter.Limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, filter.Page, filter.Limit)
}

func (r *StreamRepository) GetStream(id uint) (*dto.Stream, error) {
	var stream dto.Stream
	if err := r.db.Preload("User").Preload("Categories").Preload("StreamAnalytics").First(&stream, id).Error; err != nil {
		return nil, err
	}
	return &stream, nil
}

func (r *StreamRepository) CheckScheduledStream() ([]*model.ScheduleStream, error) {
	var streams []*model.ScheduleStream
	if err := r.db.
		Preload("Stream").
		Joins("JOIN streams ON streams.id = schedule_streams.stream_id").
		Where("streams.status = ?", model.UPCOMING).
		Where("schedule_streams.scheduled_at <= ?", time.Now().UTC()).
		Find(&streams).Error; err != nil {
		return nil, err
	}
	return streams, nil
}

func (r *StreamRepository) UpdateStreamAndStreamCategory(stream *model.Stream, categoryIDs []uint) error {
	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var existingCategoryIDs []uint
	if err := r.db.Model(&model.Category{}).Where("id IN ?", categoryIDs).Pluck("id", &existingCategoryIDs).Error; err != nil {
		return err
	}

	for _, categoryID := range categoryIDs {
		if !slices.Contains(existingCategoryIDs, categoryID) {
			return fmt.Errorf("category id %d does not exist", categoryID)
		}
	}

	if err := tx.Save(stream).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Get current stream category associations
	var currentCategoryIDs []uint
	if err := r.db.Model(&model.StreamCategory{}).
		Where("stream_id = ?", stream.ID).
		Pluck("category_id", &currentCategoryIDs).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Find the IDs to remove and remove them
	toRemove := []uint{}
	for _, currentID := range currentCategoryIDs {
		if !slices.Contains(categoryIDs, currentID) {
			toRemove = append(toRemove, currentID)
		}
	}
	if len(toRemove) > 0 {
		if err := tx.Where("stream_id = ? AND category_id IN ?", stream.ID, toRemove).Delete(&model.StreamCategory{}).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// Update or create new stream category associations
	for _, categoryID := range categoryIDs {
		streamCategory := &model.StreamCategory{
			StreamID:   stream.ID,
			CategoryID: categoryID,
		}

		if err := tx.Clauses(clause.OnConflict{
			Columns: []clause.Column{
				{Name: "stream_id"},
				{Name: "category_id"}},
			DoNothing: true,
		}).Create(streamCategory).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

func (r *StreamRepository) GetScheduleStreamsBetweenLast5And3DaysUTC() ([]*model.ScheduleStream, error) {
	currentTimeUTC := time.Now().UTC()

	// Calculate the time for 5 days ago and 3 days ago in UTC
	fiveDaysAgoUTC := currentTimeUTC.Add(-5 * 24 * time.Hour)
	threeDaysAgoUTC := currentTimeUTC.Add(-3 * 24 * time.Hour)

	var schedules []*model.ScheduleStream
	err := r.db.Debug().Where("scheduled_at > ? AND scheduled_at < ?", fiveDaysAgoUTC, threeDaysAgoUTC).Find(&schedules).Error
	if err != nil {
		return nil, err
	}

	return schedules, nil
}

func (r *StreamRepository) GetEndedLiveStreamsBetweenLast5And3DaysUTC() ([]*model.Stream, error) {
	currentTimeUTC := time.Now().UTC()

	// Calculate the time for 5 days ago and 3 days ago in UTC
	fiveDaysAgoUTC := currentTimeUTC.Add(-5 * 24 * time.Hour)
	threeDaysAgoUTC := currentTimeUTC.Add(-3 * 24 * time.Hour)

	var streams []*model.Stream
	err := r.db.Debug().Where("status = ? AND ended_at > ? AND ended_at < ?", model.ENDED, fiveDaysAgoUTC, threeDaysAgoUTC).Find(&streams).Error
	if err != nil {
		return nil, err
	}

	return streams, nil
}

func (r *StreamRepository) GetStreamByStreamKey(streamKey string) (*model.Stream, error) {
	var stream model.Stream
	if err := r.db.Where("stream_key = ?", streamKey).First(&stream).Error; err != nil {
		return nil, err
	}
	return &stream, nil
}
