package utils

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

func MakeUniqueID() string {
	return uuid.New().String()
}

func MakeUniqueIDWithTime() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
