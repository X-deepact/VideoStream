package utils

import (
	"fmt"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

func BuildSuccessResponseWithData(ctx echo.Context, status int, body interface{}) error {
	return BuildStandardResponse(ctx, status, Response{Message: "Successfully", Code: status, Data: body})
}

func ConvertBytes(bytes int64) string {
	if bytes < 1024 {
		return strconv.FormatInt(bytes, 10) + "B" // bytes
	}

	// Define units for bytes, KB, MB, GB, etc.
	units := []string{"B", "KB", "MB", "GB", "TB", "PB", "EB"}

	// Convert the bytes to the appropriate unit
	var unitIndex int
	size := float64(bytes)

	// Iterate to find the appropriate size and unit
	for size >= 1024 && unitIndex < len(units)-1 {
		size /= 1024
		unitIndex++
	}

	// Format the size to two decimal places
	return fmt.Sprintf("%.1f%s", size, units[unitIndex])
}

func ConvertTimestampToDuration(endedAt, startedAt time.Time) string {
	duration := endedAt.Sub(startedAt)
	return fmt.Sprintf("%.2f hours", duration.Hours())
}

const DATETIME_LAYOUT = "2006-01-02 15:04:05.999 -0700"

func ConvertDatetimeToTimestamp(datetimeStr, layout string) (*time.Time, error) {
	timestampTime, err := time.Parse(layout, datetimeStr)
	if err != nil {
		return nil, fmt.Errorf("error parsing datetime to timestamp: %v", err)
	}
	return &timestampTime, nil
}

func Map[T any, R any](input []T, transform func(T) R) []R {
	result := make([]R, len(input))
	for i, v := range input {
		result[i] = transform(v)
	}
	return result
}
