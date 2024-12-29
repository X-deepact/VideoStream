package repository

import (
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/utils"
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

func (s *StreamRepository) PaginateStreamStatisticsData(cond *dto.StatisticsQuery) (*utils.PaginationModel[model.StreamAnalytics], error) {

	var query = s.db.Model(model.StreamAnalytics{}).Preload("Stream")
	query = query.Joins("LEFT JOIN streams st ON st.id = stream_analytics.stream_id")
	if cond != nil && cond.Sort != "" && cond.SortBy != "" {
		if cond.SortBy != "duration" {
			if cond.SortBy == "title" {
				query = query.Order(fmt.Sprintf("st.%s %s", cond.SortBy, cond.Sort))
			} else {
				query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))
			}
		}
	} else {
		query = query.Order(fmt.Sprintf("stream_analytics.%s %s", "created_at", "DESC"))
	}

	if cond != nil {
		if cond.From != 0 && cond.To != 0 {
			from := time.Unix(cond.From, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.To, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("stream_analytics.updated_at BETWEEN ? AND ?", from, end)
		}

		if cond.Status != "" {
			query = query.Where("st.status = ?", cond.Status)
		}

		if cond.Keyword != "" {
			query = query.Where("st.title ILIKE ?", "%"+cond.Keyword+"%")
		}
	}

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
		if cond.Status != "" {
			query = query.Where("st.status = ?", cond.Status)
		}
		if cond.SortBy != "" && cond.Sort != "" {
			if !strings.Contains(cond.SortBy, "title") && !strings.Contains(cond.SortBy, "description") {
				if strings.Contains(cond.SortBy, "total_viewers") {
					query = query.Order(fmt.Sprintf("stream_analytics.views %s", cond.Sort))
				} else if !strings.Contains(cond.SortBy, "current_viewers") {
					query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))
				}
			} else {
				query = query.Order(fmt.Sprintf("st.%s %s", cond.SortBy, cond.Sort))
			}

		}
	}
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
			query = query.Where("streams.type = ?", cond.Type)
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

		if cond.Sort != "" && cond.SortBy != "" && cond.SortBy != "duration" {
			if slices.Contains([]string{"views", "likes", "comments", "video_size"}, cond.SortBy) {
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

func (s *StreamRepository) GetByID(id int) (*model.Stream, error) {
	var result model.Stream

	if err := s.db.Model(model.Stream{}).Where("id=?", id).Preload("User").First(&result).Error; err != nil {
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
