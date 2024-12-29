package repository

import "gorm.io/gorm"

type Repository struct {
	User     *UserRepository
	Admin    *AdminRepository
	Role     *RoleRepository
	Stream   *StreamRepository
	Category *CategoryRepository
}

func NewRepository(db *gorm.DB) *Repository {
	adminRepo := newAdminRepository(db)
	userRepo := newUserRepository(db)
	roleRepo := NewRoleRepository(db)
	streamRepo := newStreamRepository(db)
	categoryRepo := newCategoryRepository(db)
	return &Repository{
		Admin:    adminRepo,
		User:     userRepo,
		Role:     roleRepo,
		Stream:   streamRepo,
		Category: categoryRepo,
	}
}
