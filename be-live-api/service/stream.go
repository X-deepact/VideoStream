package service

import (
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"

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

func (s *StreamService) CreateStream(req *dto.StreamRequest) (*model.Stream, error) {
	channelKey := utils.MakeUniqueID()
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

func (s *StreamService) GetStreamByID(id uint) (*model.Stream, error) {
	return s.repo.Stream.GetByID(id)
}

func (s *StreamService) GetStreamByIDAndStatus(id uint, status model.StreamStatus) (*model.Stream, error) {
	return s.repo.Stream.GetByIDAndStatus(id, status)
}

func (s *StreamService) Update(stream *model.Stream) error {
	return s.repo.Stream.Update(stream)
}

func (s *StreamService) GetComments(streamID uint, page int, limit int) (*utils.PaginationModel[dto.LiveCommentDto], error) {
	pagination, err := s.repo.Interaction.GetComments(streamID, page, limit)
	if err != nil {
		return nil, err
	}
	var newPage = new(utils.PaginationModel[dto.LiveCommentDto])
	avtFolder := conf.GetFileStorageConfig().AvatarFolder
	newPage.Page = utils.Map(pagination.Page, func(e model.Comment) dto.LiveCommentDto {
		avtURL := ""
		if e.User.AvatarFileName.String != "" {
			avtURL = utils.GetFileUrl(avtFolder, e.User.AvatarFileName.String)
		} else {
			avtURL = ""
		}

		return dto.LiveCommentDto{
			ID:          e.ID,
			DisplayName: e.User.DisplayName,
			AvatarURL:   avtURL,
			Content:     e.Comment,
		}
	})
	newPage.BasePaginationModel = pagination.BasePaginationModel
	return newPage, err
}
