package repository

import "gorm.io/gorm"

type Repository struct {
	User         *UserRepository
	Admin        *AdminRepository
	Role         *RoleRepository
	Otp          *OtpRepository
	Stream       *StreamRepository
	TwoFA        *TwoFARepository
	Interaction  *InteractionRepository
	Category     *CategoryRepository
	Subscribe    *SubscribeRepository
	Notification *NotificationRepository
}

func NewRepository(db *gorm.DB) *Repository {
	adminRepo := newAdminRepository(db)
	userRepo := newUserRepository(db)
	roleRepo := newRoleRepository(db)
	otpRepo := newOtpRepository(db)
	streamRepo := newStreamRepository(db)
	twoFARepo := newTwoFARepository(db)
	irRepo := newInteractionRepository(db)
	categoryRepo := newCategoryRepository(db)
	subscribeRepo := newSubscribeRepository(db)
	notificationRepo := newNotificationRepository(db)

	return &Repository{
		Admin:        adminRepo,
		User:         userRepo,
		Role:         roleRepo,
		Otp:          otpRepo,
		Stream:       streamRepo,
		TwoFA:        twoFARepo,
		Interaction:  irRepo,
		Category:     categoryRepo,
		Subscribe:    subscribeRepo,
		Notification: notificationRepo,
	}
}
