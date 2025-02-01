package repository

import (
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/utils"
	"log"
	"slices"
	"strings"
	"time"

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

func (s *StreamRepository) GetStartedStreams() ([]model.Stream, error) {
	var streams []model.Stream
	if err := s.db.Model(model.Stream{}).Where("status = ?", model.STARTED).Find(&streams).Error; err != nil {
		return nil, err
	}
	return streams, nil
}

func (r *StreamRepository) GetLikesByStreamID(id uint, startedDate, endedDate time.Time) ([]dto.BaseDTO, error) {
	var data []dto.BaseDTO
	if err := r.db.Model(model.Like{}).Select("likes.id, likes.created_at").Where("stream_id = ? AND created_at BETWEEN ? AND ?", id, startedDate, endedDate).Scan(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *StreamRepository) GetCommentsByStreamID(id uint, startedDate, endedDate time.Time) ([]dto.BaseDTO, error) {
	var data []dto.BaseDTO
	if err := r.db.Model(model.Comment{}).Select("comments.id, comments.created_at").Where("stream_id = ? AND created_at BETWEEN ? AND ?", id, startedDate, endedDate).Scan(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *StreamRepository) GetViewsByStreamID(id uint, startedDate, endedDate time.Time) ([]dto.BaseDTO, error) {
	var data []dto.BaseDTO
	if err := r.db.Model(model.View{}).Select("views.id, views.created_at").Where("stream_id = ? AND created_at BETWEEN ? AND ?", id, startedDate, endedDate).Scan(&data).Error; err != nil {
		return nil, err
	}
	return data, nil
}

func (r *StreamRepository) GetViewsByDuration(startedDate, endedDate time.Time) (int64, error) {
	var count int64
	if err := r.db.Model(model.View{}).Where("created_at BETWEEN ? AND ?", startedDate, endedDate).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (s *StreamRepository) PaginateStreamStatisticsData(cond *dto.StatisticsQuery) (*utils.PaginationModel[model.StreamAnalytics], error) {

	var query = s.db.Model(model.StreamAnalytics{}).Preload("Stream")
	query = query.Joins("LEFT JOIN streams st ON st.id = stream_analytics.stream_id")
	if cond != nil && cond.Sort != "" && cond.SortBy != "" {
		if cond.SortBy == "title" {
			query = query.Order(fmt.Sprintf("st.%s %s", cond.SortBy, cond.Sort))
		} else {
			query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))
		}
	} else {
		query = query.Order(fmt.Sprintf("stream_analytics.%s %s", "created_at", dto.SORT_DESC))
	}

	if cond != nil {
		if cond.From != 0 && cond.To != 0 {
			from := time.Unix(cond.From, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.To, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("stream_analytics.updated_at BETWEEN ? AND ?", from, end)
		}

		if cond.Keyword != "" {
			query = query.Where("st.title ILIKE ?", "%"+cond.Keyword+"%")
		}
	}

	query = query.Where("st.status = ?", model.ENDED)

	pagination, err := utils.CreatePage[model.StreamAnalytics](query, int(cond.Page), int(cond.Limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(cond.Page), int(cond.Limit))
}

func (s *StreamRepository) PaginateLiveStatData(cond *dto.LiveStatQuery) (*utils.PaginationModel[model.StreamAnalytics], error) {

	var query = s.db.Model(model.StreamAnalytics{})
	query = query.Joins("LEFT JOIN streams st ON st.id = stream_analytics.stream_id")
	if cond != nil {
		if cond.Keyword != "" {
			query = query.Where("st.title ILIKE ?", "%"+cond.Keyword+"%")
			query = query.Or("st.description ILIKE ?", "%"+cond.Keyword+"%")
		}

		if cond.SortBy != "" && cond.Sort != "" {
			if !strings.Contains(cond.SortBy, dto.SORT_BY_TITLE) && !strings.Contains(cond.SortBy, dto.SORT_BY_DESCRIPTION) {
				if strings.Contains(cond.SortBy, dto.SORT_BY_TOTAL_VIEWERS) {
					query = query.Order(fmt.Sprintf("stream_analytics.views %s", cond.Sort))
				} else if !strings.Contains(cond.SortBy, dto.SORT_BY_CURRENT_VIEWERS) {
					query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))
				}
			} else {
				query = query.Order(fmt.Sprintf("st.%s %s", cond.SortBy, cond.Sort))
			}

		}
	}
	query = query.Where("st.status = ?", model.STARTED)
	query = query.Preload("Stream")
	pagination, err := utils.CreatePage[model.StreamAnalytics](query, int(cond.Page), int(cond.Limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(cond.Page), int(cond.Limit))
}

func (s *StreamRepository) FindStreamCurrentViews() (map[uint]uint, error) {
	var liveCurrentViewers []dto.LiveCurrentViewers
	var query = "SELECT stream_id, count(is_viewing) AS viewers FROM \"views\" WHERE is_viewing = true GROUP BY stream_id"
	if err := s.db.Raw(query).Scan(&liveCurrentViewers).Error; err != nil {
		return nil, err
	}
	result := make(map[uint]uint)
	for _, v := range liveCurrentViewers {
		result[v.StreamID] = v.Viewers
	}
	return result, nil
}

func (s *StreamRepository) GetStreamAnalyticByStream(streamId int) (*model.StreamAnalytics, error) {
	var result model.StreamAnalytics
	if err := s.db.Model(model.StreamAnalytics{}).Where("stream_id = ?", streamId).First(&result).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &result, nil
}

func (s *StreamRepository) PaginateLiveStreamBroadCastData(page, limit uint, cond *dto.LiveStreamBroadCastQueryDTO) (*utils.PaginationModel[model.Stream], error) {

	var query = s.db.Debug().Model(model.Stream{}).Preload("User")

	// filter
	if cond != nil {

		if cond.Category != "" {
			query = query.Joins("LEFT JOIN stream_categories stc ON streams.id = stc.stream_id").Joins("LEFT JOIN categories c ON stc.category_id = c.id").
				Where("c.name = ?", cond.Category)
		}

		if cond.Keyword != "" {
			query = query.Where("streams.title ILIKE ? OR streams.description ILIKE ?", "%"+cond.Keyword+"%", "%"+cond.Keyword+"%")
		}
		if len(cond.Status) > 0 {
			query = query.Where("streams.status IN ?", cond.Status)
		}
		if cond.Type != "" {
			query = query.Where("streams.stream_type = ?", cond.Type)
		}
		if cond.FromStartedTime != 0 && cond.EndStartedTime != 0 {
			from := time.Unix(cond.FromStartedTime, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.EndStartedTime, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("streams.started_at BETWEEN ? AND ?", from, end)
		}
		if cond.FromEndedTime != 0 && cond.EndEndedTime != 0 {
			from := time.Unix(cond.FromEndedTime, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.EndEndedTime, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("streams.ended_at BETWEEN ? AND ?", from, end)
		}

		if cond.Sort != "" && cond.SortBy != "" && cond.SortBy != dto.SORT_BY_DURATION {
			if slices.Contains([]string{dto.SORT_BY_VIEWERS, dto.SORT_BY_LIKES, dto.SORT_BY_COMMENTS, dto.SORT_BY_VIDEO_SIZE, dto.SORT_BY_SHARES}, cond.SortBy) {
				query = query.Joins("LEFT JOIN stream_analytics ON streams.id = stream_analytics.stream_id")
				query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))
			} else {
				query = query.Order(fmt.Sprintf("streams.%s %s", cond.SortBy, cond.Sort))
			}

		}
	}
	pagination, err := utils.CreatePage[model.Stream](query, int(page), int(limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(page), int(limit))
}

func (s *StreamRepository) GetByIDWithUserPreload(id int) (*model.Stream, error) {
	var result model.Stream

	if err := s.db.Model(model.Stream{}).Where("id=?", id).Preload("User").First(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *StreamRepository) GetByID(id uint) (*model.Stream, error) {
	var stream model.Stream

	if err := s.db.Model(model.Stream{}).Where("id = ?", id).First(&stream).Error; err != nil {
		return nil, err
	}

	return &stream, nil
}

func (s *StreamRepository) GetScheduleStreamByID(id uint) (*model.ScheduleStream, error) {
	var stream model.ScheduleStream

	if err := s.db.Model(model.ScheduleStream{}).Where("stream_id = ?", id).First(&stream).Error; err != nil {
		return nil, err
	}

	return &stream, nil
}

// func (s *StreamRepository) GetBy

func (s *StreamRepository) GetScheduleStreamByStreamID(id int) (*model.ScheduleStream, error) {
	var result model.ScheduleStream

	if err := s.db.Model(model.ScheduleStream{}).Where("stream_id=?", id).First(&result).Error; err != nil {
		return nil, err
	}
	return &result, nil
}

func (s *StreamRepository) GetStatisticsTotalStream() (int64, int64, error) {
	var activeStream, totalStream int64

	if err := s.db.Model(model.Stream{}).Where("status=?", model.STARTED).Count(&activeStream).Error; err != nil {
		return 0, 0, err
	}
	if err := s.db.Model(model.Stream{}).Count(&totalStream).Error; err != nil {
		return 0, 0, err
	}
	return totalStream, activeStream, nil
}

func (r *StreamRepository) Create(stream *model.Stream) error {
	return r.db.Create(stream).Error
}

func (r *StreamRepository) DeleteLiveStream(id int) error {
	tx := r.db.Begin()

	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.StreamAnalytics{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.View{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.Like{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.Comment{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.StreamCategory{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.Notification{}).Error; err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.Share{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Unscoped().Where("stream_id = ?", id).Delete(&model.ScheduleStream{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Unscoped().Where("id = ?", id).Delete(&model.Stream{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// Defer the commit or rollback of the transaction
	defer func() {
		if r := recover(); r != nil {
			// In case of panic, roll back the transaction
			tx.Rollback()
			log.Println("Transaction failed, rolling back")
		}
	}()

	return tx.Commit().Error

}
func (r *StreamRepository) GetCategoriesByStreamID(id uint) ([]model.Category, error) {
	var streamCategories []model.StreamCategory
	if err := r.db.Model(model.StreamCategory{}).Where("stream_id = ?", id).Preload("Category").Find(&streamCategories).Error; err != nil {
		return nil, err
	}
	var result []model.Category
	for _, v := range streamCategories {
		result = append(result, v.Category)
	}

	return result, nil
}

func (r *StreamRepository) CreateScheduleStream(stream *model.Stream, scheduleStream *model.ScheduleStream, categoryIDs []uint) error {
	tx := r.db.Begin()

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

	scheduleStream.StreamID = stream.ID
	if err := tx.Create(scheduleStream).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

func (r *StreamRepository) UpdateStream(stream *model.Stream, scheduleStream *model.ScheduleStream, categoryIDs []uint) error {
	tx := r.db.Begin()

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

	if err := tx.Updates(stream).Error; err != nil {
		tx.Rollback()
		return err
	}

	// delete old stream categories
	if err := tx.Exec("DELETE FROM stream_categories WHERE stream_id = ?", stream.ID).Error; err != nil {
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

	if scheduleStream != nil {
		if err := tx.Where("stream_id = ?", stream.ID).Updates(scheduleStream).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (r *StreamRepository) UpdateScheduledStream(streamID int, req *dto.UpdateScheduledStreamRequest) error {
	var scheduleStream model.ScheduleStream
	if err := r.db.Model(model.ScheduleStream{}).Where("stream_id = ?", streamID).First(&scheduleStream).Error; err != nil {
		return err
	}
	parsedTime, err := time.Parse(utils.DATETIME_LAYOUT, req.ScheduledAt)
	if err != nil {
		return nil
	}
	scheduleStream.ScheduledAt = parsedTime
	scheduleStream.VideoName = req.VideoFileName
	return r.db.Model(model.ScheduleStream{}).Where("stream_id = ?", streamID).Updates(scheduleStream).Error
}

func (r *StreamRepository) UpdateThumbnailStream(id int, thumbnail string) error {
	return r.db.Model(model.Stream{}).Where("id=?", id).Update("thumbnail_file_name", thumbnail).Error
}
