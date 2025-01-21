package utils

import (
	"errors"
	"math"

	"gorm.io/gorm"
)

type BasePaginationModel struct {
	Index       int     `json:"index,omitempty"`
	CurrentPage int     `json:"current_page,omitempty"`
	Length      int     `json:"length,omitempty"`
	TotalItems  int64   `json:"total_items,omitempty"`
	PageSize    int     `json:"page_size,omitempty"`
	Next        int     `json:"next,omitempty"`
	Previous    int     `json:"previous,omitempty"`
	Query       string  `json:"query,omitempty"`
	IsNewFilter bool    `json:"is_new_filter,omitempty"`
	Route       string  `json:"route,omitempty"`
	ExecTime    float64 `json:"exec_time,omitempty"`
}

type PaginationModel[T any] struct {
	BasePaginationModel
	Page []T                    `json:"page"`
	Obj  map[string]interface{} `json:"obj,omitempty"`
}

const (
	DEFAULT_PAGE  = 1
	DEFAULT_LIMIT = 20
)

func Create[T any](pagination *PaginationModel[T], page, limit int) (*PaginationModel[T], error) {
	if pagination == nil {
		return nil, errors.New("pagination is nil")
	}

	if page < 1 {
		page = DEFAULT_PAGE
	}
	if limit < 1 {
		limit = DEFAULT_LIMIT
	}

	pagination.PageSize = limit
	pagination.Index = (page-1)*limit + 1
	pagination.Length = int(math.Ceil(float64(pagination.TotalItems) / float64(limit)))

	if page > pagination.Length {
		pagination.CurrentPage = pagination.Length
	} else {
		if page < 1 {
			pagination.CurrentPage = 1
		} else {
			pagination.CurrentPage = page
		}
	}

	if pagination.CurrentPage > 1 {
		pagination.Previous = pagination.CurrentPage - 1
	} else {
		pagination.Previous = 0
	}
	if pagination.CurrentPage < pagination.Length {
		pagination.Next = pagination.CurrentPage + 1

	} else {
		pagination.Next = -1
	}
	return pagination, nil
}

func CreatePage[T any](query *gorm.DB, page, limit int) (*PaginationModel[T], error) {

	if query == nil {
		return nil, errors.New("query is nil")
	}
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	pagination := new(PaginationModel[T])
	if err := query.Count(&pagination.TotalItems).Error; err != nil {
		return nil, err
	}
	if err := query.Offset((page - 1) * limit).Limit(limit).Find(&pagination.Page).Error; err != nil {
		return nil, err
	}
	return pagination, nil
}
