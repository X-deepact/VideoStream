package cache

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisStore interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	SetWithDefaultCtx(key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Remove(ctx context.Context, key string) error
	RemoveWithDefaultCtx(key string) error
}

type RedisClient struct {
	Rdb *redis.Client
}

// if for struct send []byte
func (c *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	return c.Rdb.Set(ctx, key, value, expiration).Err()
}

func (c *RedisClient) SetWithDefaultCtx(key string, value interface{}, expiration time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	return c.Set(ctx, key, value, expiration)
}

func (c *RedisClient) Get(ctx context.Context, key string) (string, error) {
	return c.Rdb.Get(ctx, key).Result()
}

func (c *RedisClient) Remove(ctx context.Context, key string) error {
	return c.Rdb.Del(ctx, key).Err()
}

func (c *RedisClient) RemoveWithDefaultCtx(key string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return c.Remove(ctx, key)
}
