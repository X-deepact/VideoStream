package utils

import (
	"errors"

	"github.com/labstack/echo/v4"
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func BindAndValidate(c echo.Context, dto interface{}) error {
	if err := c.Bind(dto); err != nil {
		return errors.New("invalid request")
	}
	if err := c.Validate(dto); err != nil {
		return errors.New("validation error: " + err.Error())
	}
	return nil
}

func BuildStandardResponse(ctx echo.Context, status int, resp Response) error {
	return ctx.JSON(status, resp)
}

func BuildErrorResponse(ctx echo.Context, status int, err error, body interface{}) error {
	message := "An error occurred"
	if err != nil {
		message = err.Error()
	}
	return BuildStandardResponse(ctx, status, Response{Message: message, Code: status, Data: body})
}

func BuildSuccessResponse(ctx echo.Context, status int, message string, body interface{}) error {
	return BuildStandardResponse(ctx, status, Response{Message: message, Code: status, Data: body})
}
