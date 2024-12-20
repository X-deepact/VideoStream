package service

import "gitlab/live/be-live-api/model"

func CreateAdminLog(userID uint, action model.AdminAction, details string) *model.AdminLog {
	return &model.AdminLog{
		UserID:  userID,
		Action:  string(action),
		Details: details,
	}
}
