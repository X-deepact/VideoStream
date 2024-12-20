package repository

import (
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/utils"
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

func (s *StreamRepository) PaginateStreamStatisticsData(page, limit int, cond *dto.StatisticsQuery) (*utils.PaginationModel[model.StreamAnalytics], error) {

	var query = s.db.Model(model.StreamAnalytics{}).Preload("Stream")
	if cond != nil && cond.Sort != "" && cond.SortBy != "" {
		if cond.SortBy != "duration" {
			if cond.SortBy == "title" {
				query = query.Joins("LEFT JOIN streams st ON st.id = stream_analytics.stream_id")
				query = query.Order(fmt.Sprintf("st.%s %s", cond.SortBy, cond.Sort))
			} else {

				query = query.Order(fmt.Sprintf("stream_analytics.%s %s", cond.SortBy, cond.Sort))

			}
		}
	} else {
		query = query.Order(fmt.Sprintf("stream_analytics.%s %s", "created_at", "DESC"))
	}
	pagination, err := utils.CreatePage[model.StreamAnalytics](query, page, limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, page, limit)
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

func (s *StreamRepository) PaginateLiveStreamBroadCastData(page, limit int, cond *dto.LiveStreamBroadCastQueryDTO) (*utils.PaginationModel[model.Stream], error) {

	var query = s.db.Model(model.Stream{}).Preload("User")

	// filter
	if cond != nil {
		if cond.Keyword != "" {
			query = query.Where("title LIKE ? OR description LIKE ?", "%"+cond.Keyword+"%", "%"+cond.Keyword+"%")
		}
		if len(cond.Status) > 0 {
			query = query.Where("status IN ?", cond.Status)
		}
		if cond.Type != "" {
			query = query.Where("type = ?", cond.Type)
		}
		if cond.FromStartedTime != 0 && cond.EndStartedTime != 0 {
			from := time.Unix(cond.FromStartedTime, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.EndStartedTime, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("started_at BETWEEN ? AND ?", from, end)
		}
		if cond.FromEndedTime != 0 && cond.EndEndedTime != 0 {
			from := time.Unix(cond.FromEndedTime, 0).Format(utils.DATETIME_LAYOUT)
			end := time.Unix(cond.EndEndedTime, 0).Format(utils.DATETIME_LAYOUT)
			query = query.Where("ended_at BETWEEN ? AND ?", from, end)
		}

		if cond.Sort != "" && cond.SortBy != "" {
			query = query.Order(fmt.Sprintf("%s %s", cond.SortBy, cond.Sort))
		}
	}

	pagination, err := utils.CreatePage[model.Stream](query, page, limit)
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, page, limit)
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
