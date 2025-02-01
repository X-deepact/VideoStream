package service

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"

	"gorm.io/gorm"
)

type interactionService struct {
	repo *repository.Repository
}

func newInteractionService(repo *repository.Repository) *interactionService {
	return &interactionService{
		repo: repo,
	}
}

func (s *interactionService) CreateComment(comment *model.Comment) error {
	return s.repo.Interaction.CreateComment(comment)
}

func (s *interactionService) CreateLike(like *model.Like) error {
	return s.repo.Interaction.CreateLike(like)
}

func (s *interactionService) GetLike(streamID uint, userID uint) (*model.Like, error) {
	return s.repo.Interaction.GetLike(streamID, userID)
}

func (s *interactionService) UpdateLike(like *model.Like) error {
	return s.repo.Interaction.UpdateLike(like)
}

func (s *interactionService) DeleteLike(streamID, userID uint) error {
	return s.repo.Interaction.DeleteLike(streamID, userID)
}

// beaware for StartedAt field
func (s *interactionService) GetInitialLiveMessage(streamID, userID uint) (*dto.InitialLiveMessage, error) {
	message := &dto.InitialLiveMessage{
		Type: dto.LiveInitalType,
	}

	likeCount, err := s.repo.Interaction.GetLikeCount(streamID)
	if err != nil {
		return nil, err
	}
	message.LikeCount = likeCount

	message.Comments, err = s.repo.Interaction.GetLatest100Comments(streamID)
	if err != nil {
		return nil, err
	}

	// rearrange to asc
	for i, j := 0, len(message.Comments)-1; i < j; i, j = i+1, j-1 {
		message.Comments[i], message.Comments[j] = message.Comments[j], message.Comments[i]
	}

	for _, comment := range message.Comments {
		comment.AvatarURL = utils.GetFileUrl(conf.GetFileStorageConfig().AvatarFolder, comment.AvatarFileName)
	}

	likeInfo, err := s.GetLikeInfo(streamID)
	if err != nil {
		return nil, err
	}

	message.LikeInfo = likeInfo

	currentEmote, err := s.repo.Interaction.GetCurrentLikeEmoteType(userID, streamID)
	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		message.CurrentLikeType = nil
	} else {
		message.CurrentLikeType = &currentEmote
	}

	shareCount, err := s.CountSharesByStreamID(streamID)
	if err != nil {
		return nil, err
	}
	message.ShareCount = shareCount

	return message, nil

}

func (s *interactionService) GetCommentInfoByCommentID(commentID uint) (*dto.LiveCommentInfo, error) {
	comment, err := s.repo.Interaction.GetCommentInfoByCommentID(commentID)
	if err != nil {
		return nil, err
	}

	if comment.AvatarFileName != "" {
		comment.AvatarURL = utils.GetFileUrl(conf.GetFileStorageConfig().AvatarFolder, comment.AvatarFileName)
	}
	return comment, nil
}

func (s *interactionService) GetLikeInfo(streamID uint) (*dto.LikeInfo, error) {
	total, err := s.repo.Interaction.GetLikeCount(streamID)
	if err != nil {
		return nil, err
	}
	message := &dto.LikeInfo{
		Total: total,
	}

	reactionCounts := map[model.LikeEmoteType]int64{
		model.LikeEmoteTypeLike:    0,
		model.LikeEmoteTypeDislike: 0,
		model.LikeEmoteTypeLaugh:   0,
		model.LikeEmoteTypeSad:     0,
		model.LikeEmoteTypeWow:     0,
		model.LikeEmoteTypeHeart:   0,
	}

	for reactionType := range reactionCounts {
		count, err := s.repo.Interaction.GetLikeCountByLikeEmoteType(streamID, reactionType)
		if err != nil {
			return nil, fmt.Errorf("failed to count reactions for %s: %w", reactionType, err)
		}

		switch reactionType {
		case model.LikeEmoteTypeLike:
			message.Like = count
		case model.LikeEmoteTypeDislike:
			message.Dislike = count
		case model.LikeEmoteTypeLaugh:
			message.Laugh = count
		case model.LikeEmoteTypeSad:
			message.Sad = count
		case model.LikeEmoteTypeWow:
			message.Wow = count
		case model.LikeEmoteTypeHeart:
			message.Heart = count
		}
	}

	// currentEmote, err := s.repo.Interaction.GetCurrentLikeEmoteType(userID, streamID)
	// if err != nil {
	// 	if !errors.Is(err, gorm.ErrRecordNotFound) {
	// 		return nil, err
	// 	}
	// 	message.CurrentLikeType = nil
	// } else {
	// 	message.CurrentLikeType = &currentEmote
	// }

	return message, nil
}

func (s *interactionService) AddViewForRecord(streamID uint, userID uint) (*model.View, int64, error) {
	view := &model.View{
		UserID:    userID,
		StreamID:  streamID,
		ViewType:  model.ViewTypeRecordView,
		IsViewing: false,
	}

	rowsAffected, err := s.repo.Interaction.FirstOrCreateViewRecord(view)
	return view, rowsAffected, err
}

func (s *interactionService) GetComment(id uint) (*model.Comment, error) {
	return s.repo.Interaction.GetComment(id)
}

func (s *interactionService) UpdateComment(comment *model.Comment) error {
	return s.repo.Interaction.UpdateComment(comment)
}

func (s *interactionService) DeleteComment(id uint) error {
	return s.repo.Interaction.DeleteComment(id)
}

func (s *interactionService) UpdateStreamAnalyticsView(streamID uint) error {
	views, err := s.repo.Interaction.CountViewsByStreamID(streamID)
	if err != nil {
		return err
	}

	analytics, err := s.repo.Stream.GetStreamAnalyticsByStreamID(streamID)
	if err != nil {
		return err
	}

	analytics.Views = uint(views)

	if err := s.repo.Stream.UpdateStreamAnalytics(analytics); err != nil {
		return err
	}

	return nil
}

func (s *interactionService) UpdateStreamAnalyticsLike(streamID uint) error {
	analytics, err := s.repo.Stream.GetStreamAnalyticsByStreamID(streamID)
	if err != nil {
		return err
	}

	likes, err := s.repo.Interaction.CountLikesByStreamID(streamID)
	if err != nil {
		return err
	}
	analytics.Likes = uint(likes)

	if err := s.repo.Stream.UpdateStreamAnalytics(analytics); err != nil {
		return err
	}

	return nil
}

func (s *interactionService) UpdateStreamAnalyticsComment(streamID uint) error {
	analytics, err := s.repo.Stream.GetStreamAnalyticsByStreamID(streamID)
	if err != nil {
		return err
	}

	comments, err := s.repo.Interaction.CountCommentsByStreamID(streamID)
	if err != nil {
		return err
	}
	analytics.Comments = uint(comments)

	if err = s.repo.Stream.UpdateStreamAnalytics(analytics); err != nil {
		return err
	}

	return nil
}

func (s *interactionService) GetCurrentLikeEmoteType(userID, streamID uint) (*model.LikeEmoteType, error) {
	like, err := s.repo.Interaction.GetCurrentLikeEmoteType(userID, streamID)
	if err != nil {
		return nil, err
	}

	return &like, nil
}

func (s *interactionService) CountViewsByStream(streamID uint) (int64, error) {
	return s.repo.Interaction.CountViewsByStreamID(streamID)
}

func (s *interactionService) CountCommentsByStreamID(streamID uint) (int64, error) {
	return s.repo.Interaction.CountCommentsByStreamID(streamID)
}

func (s *interactionService) CountViewsByStreamLive(streamID uint) (int64, error) {
	return s.repo.Interaction.CountViewsByStreamLiveID(streamID)
}

func (s *interactionService) UpdateViewForRecord(view *model.View) error {
	return s.repo.Interaction.UpdateViewRecord(view)
}

func (s *interactionService) Bookmark(streamID uint, userID uint) error {
	bookmark := &model.Bookmark{
		UserID:   userID,
		StreamID: streamID,
	}

	return s.repo.Interaction.FirstOrCreateBookmarkRecord(bookmark)
}

func (s *interactionService) DeleteBookmark(streamID, userID uint) error {
	return s.repo.Interaction.DeleteBookmark(streamID, userID)
}

func (s *interactionService) AddShare(share *model.Share) (int64, error) {
	return s.repo.Interaction.FirstOrCreateShareRecord(share)
}

func (s *interactionService) UpdateStreamAnalyticsShare(streamID uint) error {
	shares, err := s.CountSharesByStreamID(streamID)
	if err != nil {
		return err
	}

	analytics, err := s.repo.Stream.GetStreamAnalyticsByStreamID(streamID)
	if err != nil {
		return err
	}

	analytics.Shares = uint(shares)

	if err := s.repo.Stream.UpdateStreamAnalytics(analytics); err != nil {
		return err
	}

	return nil
}

func (s *interactionService) CountSharesByStreamID(streamID uint) (int64, error) {
	return s.repo.Interaction.CountSharesByStreamID(streamID)
}
