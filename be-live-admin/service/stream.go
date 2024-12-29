package service

import (
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/utils"
	"log"
	"math/rand"

	"github.com/redis/go-redis/v9"
)

type StreamService struct {
	repo         *repository.Repository
	redis        *redis.Client
	streamServer *streamServerService
}

func newStreamService(repo *repository.Repository, redis *redis.Client, streamServer *streamServerService) *StreamService {
	return &StreamService{
		repo:         repo,
		redis:        redis,
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
		if a[i].Duration < a[right].Duration && sort == "ASC" {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].Duration > a[right].Duration && sort == "DESC" {
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
		if a[i].CurrentViewers < a[right].CurrentViewers && sort == "ASC" {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].CurrentViewers > a[right].CurrentViewers && sort == "DESC" {
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
		live_stream_dto.Duration = int64(v.Duration)
		result.Page = append(result.Page, *live_stream_dto)
	}
	if req != nil && req.SortBy == "duration" && req.Sort != "" {
		result.Page = s.sortByDuration(result.Page, req.Sort)
	}
	return result, nil
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

	//user if exist
	liveStreamDto.User = new(dto.UserResponseDTO)
	liveStreamDto.User.Username = v.User.Username
	liveStreamDto.User.DisplayName = v.User.DisplayName
	liveStreamDto.User.Email = v.User.Email
	liveStreamDto.User.ID = v.UserID
	liveStreamDto.User.CreatedAt = v.User.CreatedAt
	liveStreamDto.User.UpdatedAt = v.User.UpdatedAt

	//user if exist
	streamAnalytic, err := s.repo.Stream.GetStreamAnalyticByStream(int(v.ID))
	if err != nil {
		log.Println(err.Error())

		return nil
	}

	if streamAnalytic != nil {
		liveStreamDto.LiveStreamAnalytic = new(dto.LiveStreamRespDTO)
		liveStreamDto.LiveStreamAnalytic.Duration = int64(streamAnalytic.Duration)
		liveStreamDto.LiveStreamAnalytic.Likes = streamAnalytic.Likes
		liveStreamDto.LiveStreamAnalytic.VideoSize = int64(streamAnalytic.VideoSize)
		liveStreamDto.LiveStreamAnalytic.Viewers = streamAnalytic.Views
		liveStreamDto.LiveStreamAnalytic.Comments = streamAnalytic.Comments
		liveStreamDto.LiveStreamAnalytic.StreamID = v.ID
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

	if req != nil && req.SortBy == "duration" && req.Sort != "" {

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
	v, err := s.repo.Stream.GetByID(id)
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

func (s *StreamService) DeleteLiveStream(id int) error {
	if err := s.repo.Stream.DeleteLiveStream(id); err != nil {
		return err
	}
	return nil
}

func (s *StreamService) toLiveStatDto(v *model.StreamAnalytics, currentViewers uint) *dto.LiveStatRespDTO {

	var live = new(dto.LiveStatRespDTO)
	live.Comments = v.Comments
	live.CurrentViewers = currentViewers
	live.TotalViewers = v.Views
	live.Likes = v.Likes
	live.StreamID = v.StreamID
	live.Title = v.Stream.Title
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

	if req.SortBy == "current_viewers" && req.Sort != "" {
		result.Page = s.sortByCurrentViewers(containCurrentViewers, req.Sort)
		if req.Sort == "DESC" {
			result.Page = append(result.Page, notContainCurrentViewers...)
		} else {
			result.Page = append(notContainCurrentViewers, result.Page...)
		}
	} else {
		result.Page = append(result.Page, liveStatDtos...)
	}

	return result, nil
}
