package datasource

import (
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

func LoadRedis() (*redis.Client, error) {
	host := os.Getenv("REDIS_HOST")
	port := os.Getenv("REDIS_PORT")
	user := os.Getenv("REDIS_USER")
	pass := os.Getenv("REDIS_PASS")

	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", host, port),
		Username: user,
		Password: pass,
		DB:       0,
	})

	log.Println("Successfully connected to redis")

	return rdb, nil

	// return nil, nil
}
