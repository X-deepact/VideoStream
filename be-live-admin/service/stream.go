package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/cache"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
	"gitlab/live/be-live-admin/utils"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type StreamService struct {
	repo         *repository.Repository
	redisStore   cache.RedisStore
	streamServer *streamServerService
}

func newStreamService(repo *repository.Repository, redis cache.RedisStore, streamServer *streamServerService) *StreamService {
	return &StreamService{
		repo:         repo,
		redisStore:   redis,
		streamServer: streamServer,
	}

}

func (s *StreamService) GetStatisticsTotalLiveStreamData() (*dto.StatisticsTotalLiveStreamDTO, error) {
	total, active, err := s.repo.Stream.GetStatisticsTotalStream()
	if err != nil {
		return nil, err
	}
	return &dto.StatisticsTotalLiveStreamDTO{ActiveLiveStreams: uint(active), TotalLiveStreams: uint(total)}, err
}

func (s *StreamService) sortByDuration(a []dto.LiveStreamRespDTO, sort string) []dto.LiveStreamRespDTO {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].Duration < a[right].Duration && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].Duration > a[right].Duration && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByDuration(a[:left], sort)
	s.sortByDuration(a[left+1:], sort)

	return a
}

func (s *StreamService) sortByCurrentViewers(a []dto.LiveStatRespDTO, sort string) []dto.LiveStatRespDTO {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].CurrentViewers < a[right].CurrentViewers && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].CurrentViewers > a[right].CurrentViewers && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByCurrentViewers(a[:left], sort)
	s.sortByCurrentViewers(a[left+1:], sort)

	return a
}

func (s *StreamService) GetStreamAnalyticsData(req *dto.StatisticsQuery) (*utils.PaginationModel[dto.LiveStreamRespDTO], error) {
	pagination, err := s.repo.Stream.PaginateStreamStatisticsData(req)
	if err != nil {
		return nil, err
	}

	result := new(utils.PaginationModel[dto.LiveStreamRespDTO])
	result.BasePaginationModel = pagination.BasePaginationModel

	for _, v := range pagination.Page {
		var live_stream_dto = new(dto.LiveStreamRespDTO)
		live_stream_dto.Title = v.Stream.Title
		live_stream_dto.Description = v.Stream.Description
		live_stream_dto.Comments = v.Comments
		live_stream_dto.Likes = v.Likes
		live_stream_dto.VideoSize = int64(v.VideoSize)
		live_stream_dto.Viewers = v.Views
		live_stream_dto.CreatedAt = &v.UpdatedAt
		live_stream_dto.StreamID = v.StreamID
		live_stream_dto.Shares = v.Shares
		live_stream_dto.Duration = int64(v.Duration)
		result.Page = append(result.Page, *live_stream_dto)
	}

	return result, nil
}

func (s *StreamService) GetLiveStatDataInDay(cond *dto.StatisticsStreamInDayQuery) (*dto.LiveStatRespInDayDTO, error) {
	var result dto.LiveStatRespInDayDTO
	var inDays []time.Time

	startedDate, endDay, err := utils.GetStartDateEndDateSameDay(cond.TargetedDate)
	if err != nil {
		return nil, err
	}

	for i := 0; i <= 24; i++ {
		inDays = append(inDays, startedDate.Add(time.Hour*time.Duration(i)))
	}

	var wg sync.WaitGroup
	var mu sync.Mutex

	for i := 1; i <= 24; i++ {
		wg.Add(1)
		go func(prev, cur time.Time) {
			defer wg.Done()
			count, err := s.repo.Stream.GetViewsByDuration(prev, cur)
			if err != nil {
				log.Println("get views by duration error: ", err)
				count = 0
			}
			mu.Lock()
			result.Elements = append(result.Elements, dto.LiveStatRespInDayElementDTO{Time: prev.Format("2006-01-02 15:04"), Views: uint(count)})
			mu.Unlock()
		}(inDays[i-1], inDays[i])
	}

	// get total views the day before
	wg.Add(1)
	go func(beforeMidnight, beforeEndDay time.Time) {
		defer wg.Done()
		count, err := s.repo.Stream.GetViewsByDuration(beforeMidnight, beforeEndDay)
		if err != nil {
			log.Println("get views by duration error: ", err)
			count = 0
		}
		mu.Lock()
		result.TheDayBeforeTotalViews = uint(count)
		mu.Unlock()
	}(startedDate.AddDate(0, 0, -2), endDay.AddDate(0, 0, -2))

	wg.Wait()
	return &result, nil
}

func (s *StreamService) toLiveStreamBroadCastDto(v *model.Stream, apiUrl, rtmpURL, hlsURL string) *dto.LiveStreamBroadCastDTO {

	var liveStreamDto = new(dto.LiveStreamBroadCastDTO)
	liveStreamDto.Title = v.Title
	liveStreamDto.Description = v.Description
	liveStreamDto.Status = v.Status
	liveStreamDto.BroadcastURL = utils.MakeBroadcastURL(hlsURL, v.StreamKey)
	if v.StreamToken.Valid {
		liveStreamDto.PushURL = utils.MakePushURL(rtmpURL, v.StreamToken.String)
	}
	liveStreamDto.StreamType = v.StreamType
	liveStreamDto.ThumbnailFileName = utils.MakeThumbnailURL(apiUrl, v.ThumbnailFileName)
	if v.StartedAt.Valid {
		liveStreamDto.StartedAt = &v.StartedAt.Time
	}
	if v.EndedAt.Valid {
		liveStreamDto.EndedAt = &v.EndedAt.Time
	}
	liveStreamDto.ID = int(v.ID)

	liveStreamDto.User = new(dto.UserResponseDTO)
	liveStreamDto.User.Username = v.User.Username
	liveStreamDto.User.DisplayName = v.User.DisplayName
	liveStreamDto.User.Email = v.User.Email
	liveStreamDto.User.ID = v.UserID
	liveStreamDto.User.CreatedAt = v.User.CreatedAt
	liveStreamDto.User.UpdatedAt = v.User.UpdatedAt

	streamAnalytic, err := s.repo.Stream.GetStreamAnalyticByStream(int(v.ID))
	if err != nil {
		log.Println(err.Error())

		return nil
	}
	//streamAnalytic if exist
	if streamAnalytic != nil {
		liveStreamDto.LiveStreamAnalytic = new(dto.LiveStreamRespDTO)
		liveStreamDto.LiveStreamAnalytic.Duration = int64(streamAnalytic.Duration)
		liveStreamDto.LiveStreamAnalytic.Likes = streamAnalytic.Likes
		liveStreamDto.LiveStreamAnalytic.VideoSize = int64(streamAnalytic.VideoSize)
		liveStreamDto.LiveStreamAnalytic.Viewers = streamAnalytic.Views
		liveStreamDto.LiveStreamAnalytic.Comments = streamAnalytic.Comments
		liveStreamDto.LiveStreamAnalytic.Shares = streamAnalytic.Shares
		liveStreamDto.LiveStreamAnalytic.StreamID = v.ID
	}

	// scheduleStream if exist
	scheduleStream, err := s.repo.Stream.GetScheduleStreamByStreamID(int(v.ID))
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		log.Println(err.Error())
		return nil
	}
	if scheduleStream != nil {
		liveStreamDto.ScheduleStream = new(dto.ScheduleStreamDTO)
		liveStreamDto.ScheduleStream.VideoURL = utils.MakeScheduleVideoURL(apiUrl, scheduleStream.VideoName)
		liveStreamDto.ScheduleStream.VideoName = scheduleStream.VideoName
		liveStreamDto.ScheduleStream.ScheduledAt = scheduleStream.ScheduledAt
	}

	// categories if exist
	categories, err := s.repo.Stream.GetCategoriesByStreamID(v.ID)
	if err != nil {
		return nil
	}
	if len(categories) > 0 {
		liveStreamDto.Categories = utils.Map(categories, func(category model.Category) dto.CategoryDTO {
			return dto.CategoryDTO{ID: category.ID, Name: category.Name, CreatedAt: category.CreatedAt}
		})
	}
	return liveStreamDto
}

func (s *StreamService) GetLiveStreamBroadCastWithPagination(page, limit uint, req *dto.LiveStreamBroadCastQueryDTO, apiUrl, rtmpURL, hlsURL string) (*utils.PaginationModel[dto.LiveStreamBroadCastDTO], error) {
	pagination, err := s.repo.Stream.PaginateLiveStreamBroadCastData(page, limit, req)
	if err != nil {
		return nil, err
	}

	result := new(utils.PaginationModel[dto.LiveStreamBroadCastDTO])
	result.BasePaginationModel = pagination.BasePaginationModel

	for _, v := range pagination.Page {
		liveStreamDto := s.toLiveStreamBroadCastDto(&v, apiUrl, rtmpURL, hlsURL)
		result.Page = append(result.Page, *liveStreamDto)
	}

	if req != nil && req.SortBy == dto.SORT_BY_DURATION && req.Sort != "" {

		var containAnalytics, notContainAnalytics []dto.LiveStreamBroadCastDTO
		for _, v := range result.Page {
			if v.LiveStreamAnalytic != nil {
				containAnalytics = append(containAnalytics, v)
			} else {
				notContainAnalytics = append(notContainAnalytics, v)
			}
		}

		sortedAnalytics := s.sortByDuration(utils.Map(containAnalytics, func(e dto.LiveStreamBroadCastDTO) dto.LiveStreamRespDTO {
			return *e.LiveStreamAnalytic
		}), req.Sort)

		var sortedPage []dto.LiveStreamBroadCastDTO

		for _, v := range sortedAnalytics {
			for _, k := range containAnalytics {
				if k.ID == int(v.StreamID) {
					sortedPage = append(sortedPage, k)
					break
				}
			}

		}
		sortedPage = append(sortedPage, notContainAnalytics...)
		result.Page = sortedPage

	}

	return result, nil
}

func (s *StreamService) GetLiveStreamBroadCastByID(id int, apiUrl, rtmpURL, hlsURL string) (*dto.LiveStreamBroadCastDTO, error) {
	v, err := s.repo.Stream.GetByIDWithUserPreload(id)
	if err != nil {
		return nil, err
	}
	return s.toLiveStreamBroadCastDto(v, apiUrl, rtmpURL, hlsURL), nil
}

func (s *StreamService) CreateStreamByAdmin(req *dto.StreamRequest) (*model.Stream, error) {
	channelKey := utils.MakeUniqueID()
	schduledAt, err := utils.ConvertDatetimeToTimestamp(req.ScheduledAt, utils.DATETIME_LAYOUT)
	if err != nil {
		return nil, err
	}

	stream := &model.Stream{
		UserID:            req.UserID,
		Title:             req.Title,
		Description:       req.Description,
		Status:            model.UPCOMING,
		StreamKey:         channelKey,
		StreamType:        model.PRERECORDSTREAM,
		ThumbnailFileName: req.ThumbnailFileName,
	}

	schduleStream := &model.ScheduleStream{
		ScheduledAt: *schduledAt,
		VideoName:   req.VideoFileName,
	}

	if err := s.repo.Stream.CreateScheduleStream(stream, schduleStream, req.CategoryIDs); err != nil {
		return nil, err
	}

	return stream, nil
}

func (s *StreamService) UpdateScheduledStreamByAdmin(id int, req *dto.UpdateScheduledStreamRequest) error {
	return s.repo.Stream.UpdateScheduledStream(id, req)
}

func (s *StreamService) UpdateStreamByAdmin(id int, req *dto.UpdateStreamRequest) (*model.Stream, error) {
	liveStream, err := s.repo.Stream.GetByIDWithUserPreload(id)
	if err != nil {
		return nil, err
	}
	liveStream.Title = req.Title
	liveStream.Description = req.Description
	if req.Status != "" {
		liveStream.Status = req.Status
	}
	if req.EndedAt != "" {
		endedAt, err := utils.ConvertDatetimeToTimestamp(req.EndedAt, utils.DATETIME_LAYOUT)
		if err != nil {
			return nil, err
		}
		liveStream.EndedAt = sql.NullTime{Valid: true, Time: *endedAt}
	}

	if err := s.repo.Stream.UpdateStream(liveStream, nil, req.CategoryIDs); err != nil {
		return nil, err
	}

	return liveStream, nil
}

func (s *StreamService) UpdateThumbnailStreamByAdmin(id int, req *dto.UpdateStreamThumbnailRequest) error {
	return s.repo.Stream.UpdateThumbnailStream(id, req.ThumbnailFileName)
}

func (s *StreamService) DeleteLiveStream(id int) error {
	return s.repo.Stream.DeleteLiveStream(id)
}

func (s *StreamService) GetLiveStreamByID(id int) (*dto.StreamAndStreamScheduleDto, error) {
	stream, err := s.repo.Stream.GetByIDWithUserPreload(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	scheduleStream, err := s.repo.Stream.GetScheduleStreamByStreamID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &dto.StreamAndStreamScheduleDto{Stream: stream, ScheduleStream: scheduleStream}, nil
}

func (s *StreamService) GetStreamByID(id uint) (*model.Stream, error) {
	return s.repo.Stream.GetByID(id)
}

func (s *StreamService) GetSechduleStreamByID(id uint) (*model.ScheduleStream, error) {
	return s.repo.Stream.GetScheduleStreamByID(id)
}

func (s *StreamService) toLiveStatDto(v *model.StreamAnalytics, currentViewers uint) *dto.LiveStatRespDTO {

	var live = new(dto.LiveStatRespDTO)
	live.Comments = v.Comments
	live.CurrentViewers = currentViewers
	live.TotalViewers = v.Views
	live.Likes = v.Likes
	live.Shares = v.Shares
	live.StreamID = v.StreamID
	live.Title = v.Stream.Title
	live.Status = v.Stream.Status
	live.Description = v.Stream.Description
	return live
}

func (s *StreamService) GetLiveStatWithPagination(req *dto.LiveStatQuery) (*utils.PaginationModel[dto.LiveStatRespDTO], error) {
	pagination, err := s.repo.Stream.PaginateLiveStatData(req)
	if err != nil {
		return nil, err
	}

	// get current viewers
	var curentNumOfViewersGroupByID map[uint]uint
	if curentNumOfViewersGroupByID, err = s.repo.Stream.FindStreamCurrentViews(); err != nil {
		return nil, err
	}

	result := new(utils.PaginationModel[dto.LiveStatRespDTO])
	result.BasePaginationModel = pagination.BasePaginationModel
	var containCurrentViewers, notContainCurrentViewers, liveStatDtos []dto.LiveStatRespDTO

	for _, v := range pagination.Page {
		var live *dto.LiveStatRespDTO
		currentViewers, ok := curentNumOfViewersGroupByID[v.StreamID]
		if ok {
			live = s.toLiveStatDto(&v, currentViewers)
			containCurrentViewers = append(containCurrentViewers, *live)
			liveStatDtos = append(liveStatDtos, *live)
		} else {
			live = s.toLiveStatDto(&v, 0)
			notContainCurrentViewers = append(notContainCurrentViewers, *live)
			liveStatDtos = append(liveStatDtos, *live)
		}

	}

	if req.SortBy == dto.SORT_BY_CURRENT_VIEWERS && req.Sort != "" {
		result.Page = s.sortByCurrentViewers(containCurrentViewers, req.Sort)
		if req.Sort == dto.SORT_DESC {
			result.Page = append(result.Page, notContainCurrentViewers...)
		} else {
			result.Page = append(notContainCurrentViewers, result.Page...)
		}
	} else {
		result.Page = append(result.Page, liveStatDtos...)
	}

	return result, nil
}

func (s *StreamService) IsEncodingVideo(ctx context.Context, streamKey string) (bool, error) {
	cacheKey := fmt.Sprintf(cache.VIDEO_ENCODING_PREFIX, streamKey+".mp4")

	isEncoding, err := cache.GetRedisValWithTyped[bool](s.redisStore, ctx, cacheKey)
	if err != nil {
		if !errors.Is(err, redis.Nil) {
			log.Println(err)
			return false, err
		}
	}

	return isEncoding, nil
}

func (s *StreamService) IsEndingLive(ctx context.Context, id uint) (bool, error) {
	cacheKey := fmt.Sprintf(cache.IS_ENDING_LIVE_PREFIX, id)

	isEndingLive, err := cache.GetRedisValWithTyped[bool](s.redisStore, ctx, cacheKey)
	if err != nil {
		if !errors.Is(err, redis.Nil) {
			log.Println(err)
			return false, err
		}
	}

	return isEndingLive, nil

}

func (s *StreamService) EndLivByRedis(ctx context.Context, id uint) error {
	cacheKey := fmt.Sprintf(cache.IS_ENDING_LIVE_PREFIX, id)
	if err := s.redisStore.Set(ctx, cacheKey, true, time.Hour); err != nil {
		return err
	}

	channelKey := fmt.Sprintf(cache.CHANNEL_END_LIVE, id)

	return s.redisStore.Publish(ctx, channelKey, true)
}
