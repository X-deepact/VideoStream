package service

import (
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type TwoFAService struct {
	repo  *repository.Repository
	redis *redis.Client
}

func newTwoFAService(repo *repository.Repository, redis *redis.Client) *TwoFAService {
	return &TwoFAService{
		repo:  repo,
		redis: redis,
	}
}

func (ot *TwoFAService) GetTwoFAInfo(userid uint) (*model.TwoFA, error) {
	twoFA, err := ot.repo.TwoFA.GetTwoFAInfo(userid)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// Create default 2FA settings if not found
			twoFA = &model.TwoFA{
				UserID:       userid,
				Secret:       "",
				Is2faEnabled: false,
			}
			if err := ot.repo.TwoFA.CreateTwoFA(twoFA); err != nil {
				return nil, err
			}
			return twoFA, nil
		}
		return nil, err
	}
	return twoFA, nil
}

func (ot *TwoFAService) CreateTwoFA(twoFA *model.TwoFA) error {
	// Ensure new 2FA records start with empty secret and disabled
	twoFA.Secret = ""
	twoFA.Is2faEnabled = false
	return ot.repo.TwoFA.CreateTwoFA(twoFA)
}

func (ot *TwoFAService) UpdateTwoFA(twoFA *model.TwoFA) error {
	// When disabling 2FA, ensure the secret is cleared
	if !twoFA.Is2faEnabled {
		twoFA.Secret = ""
	}
	return ot.repo.TwoFA.UpdateTwoFA(twoFA)
}
