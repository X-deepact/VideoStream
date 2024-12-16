package repository

import (
	"gitlab/live/be-live-api/model"

	"gorm.io/gorm"
)

type TwoFARepository struct {
	db *gorm.DB
}

func newTwoFARepository(db *gorm.DB) *TwoFARepository {
	return &TwoFARepository{
		db: db,
	}
}

func (ur *TwoFARepository) GetTwoFAInfo(userId uint) (*model.TwoFA, error) {
	var twoFA model.TwoFA
	if err := ur.db.Where("user_id = ?", userId).First(&twoFA).Error; err != nil {
		return nil, err
	}
	return &twoFA, nil
}

func (ur *TwoFARepository) CreateTwoFA(twoFA *model.TwoFA) error {
	return ur.db.Create(twoFA).Error
}

func (ur *TwoFARepository) UpdateTwoFA(twoFA *model.TwoFA) error {
	if err := ur.db.Save(twoFA).Error; err != nil {
		return err
	}
	return nil
}

func (tr *TwoFARepository) DeleteTwoFA(userID uint) error {
	result := tr.db.Unscoped().Where("user_id = ?", userID).Delete(&model.TwoFA{})
	if result.Error != nil {
		return result.Error
	}
	// Check if any record was actually deleted
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
