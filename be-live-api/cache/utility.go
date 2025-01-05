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

	switch any(result).(type) {
	case string:
		return any(val).(T), nil
	case int:
		var intVal int
		if intVal, err = strconv.Atoi(val); err != nil {
			return result, err
		}
		return any(intVal).(T), nil
	case float64:
		var floatVal float64
		if floatVal, err = strconv.ParseFloat(val, 64); err != nil {
			return result, err
		}
		return any(floatVal).(T), nil
	case bool:
		var boolVal bool
		if boolVal, err = strconv.ParseBool(val); err != nil {
			return result, err
		}
		return any(boolVal).(T), nil
	default:
		// Attempt JSON unmarshalling for complex types
		if err := json.Unmarshal([]byte(val), &result); err != nil {
			return result, err
		}
		return result, nil
	}
}

func GetRedisValWithTypedAndDefaultctx[T any](r RedisStore, key string) (T, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	return GetRedisValWithTyped[T](r, ctx, key)
}
