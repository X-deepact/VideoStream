package repository

import "gorm.io/gorm"

type AdminRepository struct {
	db *gorm.DB
}

func newAdminRepository(db *gorm.DB) *AdminRepository {
	return &AdminRepository{
		db: db,
	}
}
