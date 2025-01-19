package cache

import (
	"context"
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisStore interface {
	Set(ctx context.Context, key string, value any, expiration time.Duration) error
	SetWithDefaultCtx(key string, value any, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	GetInt(ctx context.Context, key string) (int64, error)
	GetBoolean(ctx context.Context, key string) (bool, error)
	Remove(ctx context.Context, key string) error
	RemoveWithDefaultCtx(key string) error
	Publish(ctx context.Context, channel string, message any) error
	Subscribe(ctx context.Context, handlerFunc func(channel string, message string), channels ...string) error
	Unsubscribe(ctx context.Context, channels ...string) error
}

type RedisClient struct {
	Rdb *redis.Client
}

// if for struct send []byte
func (c *RedisClient) Set(ctx context.Context, key string, value any, expiration time.Duration) error {
	return c.Rdb.Set(ctx, key, value, expiration).Err()
}

func (c *RedisClient) SetWithDefaultCtx(key string, value any, expiration time.Duration) error {
	ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
	defer cancel()
	return c.Set(ctx, key, value, expiration)
}

func (c *RedisClient) Get(ctx context.Context, key string) (string, error) {
	return c.Rdb.Get(ctx, key).Result()
}

func (c *RedisClient) GetInt(ctx context.Context, key string) (int64, error) {
	data, err := c.Rdb.Get(ctx, key).Result()
	if err != nil {
		return 0, err
	}

	return strconv.ParseInt(data, 10, 64)
}

func (c *RedisClient) GetBoolean(ctx context.Context, key string) (bool, error) {
	data, err := c.Rdb.Get(ctx, key).Result()
	if err != nil {
		return false, err
	}

	return strconv.ParseBool(data)
}

func (c *RedisClient) Remove(ctx context.Context, key string) error {
	return c.Rdb.Del(ctx, key).Err()
}

func (c *RedisClient) RemoveWithDefaultCtx(key string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return c.Remove(ctx, key)
}

func (c *RedisClient) Publish(ctx context.Context, channel string, message any) error {
	return c.Rdb.Publish(ctx, channel, message).Err()
}

func (c *RedisClient) Subscribe(ctx context.Context, handlerFunc func(channel string, message string), channels ...string) error {
	pubsub := c.Rdb.Subscribe(ctx, channels...)

	// Close the subscription when done
	defer pubsub.Close()

	// Wait for confirmation that the subscription is active
	_, err := pubsub.Receive(ctx)
	if err != nil {
		log.Printf("Failed to subscribe to channel: %v", err)
		return err
	}

	log.Printf("Subscribed to channel '%s'\n", strings.Join(channels, ", "))

	// Listen for messages
	ch := pubsub.Channel()
	for {
		select {
		case msg := <-ch:
			if msg == nil {
				log.Println("Channel closed.")
				return nil
			}
			// Process the message using the handler function
			handlerFunc(msg.Channel, msg.Payload)
		case <-ctx.Done():
			log.Println("Context canceled, stopping subscription.")
			return ctx.Err()
		}
	}

}

func (c *RedisClient) Unsubscribe(ctx context.Context, channels ...string) error {
	pubsub := c.Rdb.Subscribe(ctx)

	err := pubsub.Unsubscribe(ctx, channels...)
	if err != nil {
		log.Printf("Failed to unsubscribe from channels: %v", err)
		return err
	}

	log.Printf("Unsubscribed from channels: %s\n", strings.Join(channels, ", "))
	return nil
}
