package datasource

import (
	"gitlab/live/be-live-api/cache"

	"gorm.io/gorm"
)

type DataSource struct {
	DB         *gorm.DB
	RedisStore cache.RedisStore
}

func NewDataSource() (*DataSource, error) {
	db, err := LoadDB()
	if err != nil {
		return nil, err
	}

	redisStore, err := LoadRedis()
	if err != nil {
		return nil, err
	}

	return &DataSource{
		DB:         db,
		RedisStore: redisStore,
	}, nil
}
