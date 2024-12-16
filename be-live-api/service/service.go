package service

import (
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
)

type Service struct {
	User         *UserService
	Admin        *AdminService
	StreamServer *streamServerService
	Role         *RoleService
	Otp          *OtpService
	Stream       *StreamService
	TwoFA        *TwoFAService
	Interaction  *interactionService
}

func NewService(repo *repository.Repository, redis *redis.Client) *Service {
	streamServer := newStreamServerService()

	return &Service{
		User:         newUserService(repo, redis),
		Admin:        newAdminService(repo, redis),
		StreamServer: streamServer,
		Role:         newRoleService(repo, redis),
		Otp:          newOtpService(repo, redis),
		Stream:       newStreamService(repo, redis, streamServer),
		TwoFA:        newTwoFAService(repo, redis),
		Interaction:  newInteractionService(repo, redis),
	}
}
