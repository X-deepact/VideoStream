package datasource

import (
	"fmt"
	"gitlab/live/be-live-api/cache"
	"gitlab/live/be-live-api/conf"
	"log"

	"github.com/redis/go-redis/v9"
)

func LoadRedis() (cache.RedisStore, error) {
	redisCfg := conf.GetRedisConfig()

	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", redisCfg.Host, redisCfg.Port),
		Username: redisCfg.User,
		Password: redisCfg.Pass,
		DB:       0,
	})

	log.Println("Successfully connected to redis")

	return &cache.RedisClient{Rdb: rdb}, nil
}
