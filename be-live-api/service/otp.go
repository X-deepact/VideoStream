package service

import (
	"github.com/redis/go-redis/v9"
	"gitlab/live/be-live-api/repository"
)

type OtpService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newOtpService(repo *repository.Repository, redis *redis.Client) *OtpService {
	return &OtpService{
		repo:  repo,
		redis: redis,
	}
}

//func (ot *OtpService) GetOtp(userid uint, action string) (*model.Otp, error) {
//	return ot.repo.Otp.GetOtp(userid, action)
//}
//
//func (ot *OtpService) CreateOtp(userId uint, action string) (*model.Otp, error) {
//	return ot.repo.Otp.CreateOtp(&model.Otp{
//		UserID:    userId,
//		Action:    action,
//		OtpCode:   utils.GenerateRandomString(6),
//		CreatedAt: time.Now(),
//		ExpiresAt: time.Now().Add(5 * time.Minute),
//		IsUsed:    false,
//	})
//}
