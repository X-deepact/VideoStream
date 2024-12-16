package service

import (
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type AdminService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newAdminService(repo *repository.Repository, redis *redis.Client) *AdminService {
	return &AdminService{
		repo:  repo,
		redis: redis,
	}
}
