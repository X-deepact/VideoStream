package repository

import "gorm.io/gorm"

type Repository struct {
	User        *UserRepository
	Admin       *AdminRepository
	Role        *RoleRepository
	Otp         *OtpRepository
	Stream      *StreamRepository
	TwoFA       *TwoFARepository
	Interaction *InteractionRepository
}

func NewRepository(db *gorm.DB) *Repository {
	adminRepo := newAdminRepository(db)
	userRepo := newUserRepository(db)
	roleRepo := newRoleRepository(db)
	otpRepo := newOtpRepository(db)
	streamRepo := newStreamRepository(db)
	twoFARepo := newTwoFARepository(db)
	irRepo := newInteractionRepository(db)

	return &Repository{
		Admin:       adminRepo,
		User:        userRepo,
		Role:        roleRepo,
		Otp:         otpRepo,
		Stream:      streamRepo,
		TwoFA:       twoFARepo,
		Interaction: irRepo,
	}
}
