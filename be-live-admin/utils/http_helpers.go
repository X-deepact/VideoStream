package utils

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
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

func PostAsync[T any](endpoint, token string, bodyMap map[string]interface{}) (*T, error) {

	// Convert the map into JSON
	jsonData, err := json.Marshal(bodyMap)
	if err != nil {
		log.Error(context.TODO(), "Error marshaling JSON: %v", err)
		return nil, err
	}

	req, err := http.NewRequest("POST", fmt.Sprintf("%s", endpoint), bytes.NewBuffer(jsonData))
	if err != nil {
		log.Error(context.TODO(), "GetAsync invalid", err)
		return nil, err
	}
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))
	req.Header.Set("Content-Type", "application/json; charset=utf-8") // UTF-8 encoding for JSON data
	req.Header.Set("Accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Error(context.TODO(), "http.DefaultClient.Do(req) invalid", err)
		return nil, err
	}

	// Check for successful status code (2xx)
	if res.StatusCode < 200 || res.StatusCode >= 300 {
		return nil, fmt.Errorf("received non-2xx response: %s", res.Status)
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {

		}
	}(res.Body)

	body, readErr := io.ReadAll(res.Body)
	if readErr != nil {
		log.Error(context.TODO(), "io.ReadAll(res.Body) invalid", readErr)
		return nil, readErr
	}
	var payload T
	err = json.Unmarshal(body, &payload)
	return &payload, err
}

func GetTokenFromHeader(c echo.Context) (string, error) {
	token := c.Request().Header.Get("Authorization")
	token = token[len("Bearer "):]
	if token == "" {
		return "", errors.New("no token provided")
	}
	return token, nil
}
