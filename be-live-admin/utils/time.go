package utils

import (
	"time"
)

func IsValidSchedule(scheduleAt string) bool {
	parsedTime, err := time.Parse(DATETIME_LAYOUT, scheduleAt)
	if err != nil {
		return false
	}

	// log.Println(parsedTime.UTC().String())

	// log.Println(time.Now().UTC().String())

	nowUTC := time.Now().UTC()
	futureUTC := nowUTC.Add(72 * time.Hour)

	// Check if the parsed time is within the valid range
	if parsedTime.After(nowUTC) && parsedTime.Before(futureUTC) {
		return true
	}

	return false
}

func IsValidScheduleTimestamp(scheduleAt uint) bool {
	parsedTime := time.Unix(int64(scheduleAt), 0)
	nowUTC := time.Now().UTC()
	futureUTC := nowUTC.Add(72 * time.Hour)

	// Check if the parsed time is within the valid range
	if parsedTime.After(nowUTC) && parsedTime.Before(futureUTC) {
		return true
	}

	return false
}

func GetStartDateEndDateSameDay(dateString string) (*time.Time, *time.Time, error) {
	currentDate, err := time.Parse(DATETIME_LAYOUT, dateString)
	if err != nil {
		return nil, nil, err
	}
	// Set the time to midnight (00:00:00)
	midnight := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(), 0, 0, 0, 0, currentDate.Location())

	endDay := time.Date(currentDate.Year(), currentDate.Month(), currentDate.Day(), 23, 59, 59, 59, currentDate.Location())

	return &midnight, &endDay, nil
}
