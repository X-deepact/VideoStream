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

func (s *StreamService) GetStreamAnalyticsData(page, limit int, req *dto.StatisticsQuery) (*utils.PaginationModel[dto.LiveStreamRespDTO], error) {
	pagination, err := s.repo.Stream.PaginateStreamStatisticsData(page, limit, req)
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
		live_stream_dto.CreatedAt = &v.CreatedAt

		if v.Stream.EndedAt.Valid && v.Stream.StartedAt.Valid {
			live_stream_dto.Duration = int64(v.Stream.EndedAt.Time.Sub(v.Stream.StartedAt.Time))
		}
		result.Page = append(result.Page, *live_stream_dto)
	}
	if req != nil && req.SortBy == "duration" && req.Sort != "" {
		result.Page = s.sortByDuration(result.Page, req.Sort)
	}
	return result, nil
}

func (s *StreamService) toLiveStreamBroadCastDto(v *model.Stream, apiUrl string) *dto.LiveStreamBroadCastDTO {

	var liveStreamDto = new(dto.LiveStreamBroadCastDTO)
	liveStreamDto.Title = v.Title
	liveStreamDto.Description = v.Description
	liveStreamDto.Status = v.Status
	liveStreamDto.StreamKey = v.StreamKey
	liveStreamDto.StreamToken = v.StreamToken
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
		if v.EndedAt.Valid && v.StartedAt.Valid {
			liveStreamDto.LiveStreamAnalytic.Duration = int64(v.EndedAt.Time.Sub(v.StartedAt.Time))
		}
		liveStreamDto.LiveStreamAnalytic.Likes = streamAnalytic.Likes
		liveStreamDto.LiveStreamAnalytic.VideoSize = int64(streamAnalytic.VideoSize)
		liveStreamDto.LiveStreamAnalytic.Viewers = streamAnalytic.Views
		liveStreamDto.LiveStreamAnalytic.Comments = streamAnalytic.Comments
	}
	return liveStreamDto
}

func (s *StreamService) GetLiveStreamBroadCastWithPagination(page, limit int, req *dto.LiveStreamBroadCastQueryDTO, apiUrl string) (*utils.PaginationModel[dto.LiveStreamBroadCastDTO], error) {
	pagination, err := s.repo.Stream.PaginateLiveStreamBroadCastData(page, limit, req)
	if err != nil {
		return nil, err
	}

	result := new(utils.PaginationModel[dto.LiveStreamBroadCastDTO])
	result.BasePaginationModel = pagination.BasePaginationModel

	for _, v := range pagination.Page {
		liveStreamDto := s.toLiveStreamBroadCastDto(&v, apiUrl)
		result.Page = append(result.Page, *liveStreamDto)
	}
	return result, nil
}

func (s *StreamService) GetLiveStreamBroadCastByID(id int, apiUrl string) (*dto.LiveStreamBroadCastDTO, error) {
	v, err := s.repo.Stream.GetByID(id)
	if err != nil {
		return nil, err
	}
	return s.toLiveStreamBroadCastDto(v, apiUrl), nil
}

func (s *StreamService) CreateStreamByAdmin(req *dto.StreamRequest) (*model.Stream, error) {
	channelKey := req.Record
	token, err := s.streamServer.GetChannelKey(channelKey)
	if err != nil {
		return nil, err
	}

	stream := &model.Stream{
		UserID:            req.UserID,
		Title:             req.Title,
		Description:       req.Description,
		Status:            model.PENDING,
		StreamToken:       token,
		StreamKey:         channelKey,
		StreamType:        req.StreamType,
		ThumbnailFileName: req.ThumbnailFileName,
	}

	if err := s.repo.Stream.Create(stream); err != nil {
		return nil, err
	}

	return stream, nil
}
