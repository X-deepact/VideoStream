package cache

import (
	"context"
	"encoding/json"
	"strconv"
	"time"
)

func GetRedisValWithTyped[T any](r RedisStore, ctx context.Context, key string) (T, error) {
	var result T

	val, err := r.Get(ctx, key)
	if err != nil {
		return result, err
	}

	return ParseAndCast[T](val)
}
func GetRedisValWithTypedAndDefaultctx[T any](r RedisStore, key string) (T, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return GetRedisValWithTyped[T](r, ctx, key)
}

func ParseAndCast[T any](input string) (T, error) {
	var result T
	var err error

	switch any(result).(type) {
	case string:
		return any(input).(T), nil
	case int:
		var intVal int
		intVal, err = strconv.Atoi(input)
		return any(intVal).(T), err
	case float64:
		var floatVal float64
		floatVal, err = strconv.ParseFloat(input, 64)
		return any(floatVal).(T), err
	case bool:
		var boolVal bool
		boolVal, err = strconv.ParseBool(input)
		return any(boolVal).(T), err
	default:
		// Attempt JSON unmarshalling for complex types
		err = json.Unmarshal([]byte(input), &result)
		return result, err
	}
}
