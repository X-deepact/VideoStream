package datasource

import (
	"fmt"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func LoadDB() (*gorm.DB, error) {
	dbConfig := conf.GetDatabaseConfig()

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=UTC", dbConfig.Host, dbConfig.User, dbConfig.Pass, dbConfig.Name, dbConfig.Port)

	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true,
	}), &gorm.Config{})

	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&model.Role{},
		&model.User{},
		&model.AdminLog{},
		&model.BlockedList{},
		&model.Stream{},
	); err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&model.Category{},
		&model.View{},
		&model.ScheduleStream{},
		&model.Bookmark{},
	); err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&model.Like{},
		&model.Comment{},
		&model.Share{},
		&model.StreamAnalytics{},
		&model.Subscription{},
		&model.Notification{},
	); err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&model.TwoFA{},
		&model.StreamCategory{},
		&model.Action{},
	); err != nil {
		return nil, err
	}

	// for existed db
	if err := db.Exec("ALTER TABLE streams ALTER COLUMN stream_token DROP NOT NULL").Error; err != nil {
		return nil, err
	}

	return db, nil

}
