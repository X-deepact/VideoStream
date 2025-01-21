package service

import (
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/repository"
)

type TwoFAService struct {
	repo *repository.Repository
}

func newTwoFAService(repo *repository.Repository) *TwoFAService {
	return &TwoFAService{
		repo: repo,
	}
}

func (ot *TwoFAService) GetTwoFAInfo(userid uint) (*model.TwoFA, error) {
	return ot.repo.TwoFA.GetTwoFAInfo(userid)
}

func (ot *TwoFAService) CreateTwoFA(twoFA *model.TwoFA) error {
	return ot.repo.TwoFA.CreateTwoFA(twoFA)
}

func (ot *TwoFAService) UpdateTwoFA(twoFA *model.TwoFA) error {
	return ot.repo.TwoFA.UpdateTwoFA(twoFA)
}
