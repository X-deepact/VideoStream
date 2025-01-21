package repository

import (
	"gorm.io/gorm"
)

type OtpRepository struct {
	db *gorm.DB
}

func newOtpRepository(db *gorm.DB) *OtpRepository {
	return &OtpRepository{
		db: db,
	}
}

//func (ur *OtpRepository) GetOtp(userId uint, action string) (*model.Otp, error) {
//	var otp model.Otp
//	if err := ur.db.Where("user_id = ? and action = ?", userId, action).Order("id desc").First(&otp).Error; err != nil {
//		return nil, err
//	}
//	return &otp, nil
//}
//
//func (ur *OtpRepository) CreateOtp(otp *model.Otp) (*model.Otp, error) {
//	if err := ur.db.Create(otp).Error; err != nil {
//		return nil, err
//	}
//	return otp, nil
//}
