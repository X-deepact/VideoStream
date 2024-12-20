package datasource

import (
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type DataSource struct {
	DB      *gorm.DB
	RClient *redis.Client
}

func NewDataSource() (*DataSource, error) {
	db, err := LoadDB()
	if err != nil {
		return nil, err
	}

	redisClient, err := LoadRedis()
	if err != nil {
		return nil, err
	}

	return &DataSource{
		DB:      db,
		RClient: redisClient,
	}, nil
}
