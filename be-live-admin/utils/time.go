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
	dateStr := currentDate.Format("2006-01-02")

	// Create 12 AM (midnight) on the same day
	amTimeStr := dateStr + " 00:00:00"
	amTime, err := time.Parse("2006-01-02 15:04:05", amTimeStr)
	if err != nil {
		return nil, nil, err
	}

	// Create 11 PM (23:00:00) on the same day
	pmTimeStr := dateStr + " 23:00:00"
	pmTime, err := time.Parse("2006-01-02 15:04:05", pmTimeStr)
	if err != nil {
		return nil, nil, err
	}

	return &amTime, &pmTime, nil
}
