package utils

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/labstack/echo/v4"
)

const charset = "0123456789"

//func HashingPassword(content, salt_key string) string {
//	data := salt_key + content
//	hash := sha256.New()
//	hash.Write([]byte(data))
//	hashBytes := hash.Sum(nil)
//	return hex.EncodeToString(hashBytes)
//}
//
//func VerifyPassword(storedHash, content, salt_key string) bool {
//	return HashingPassword(content, salt_key) == storedHash
//}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

type Response struct {
	Data    interface{} `json:"data,omitempty"`
	Message interface{} `json:"message,omitempty"`
	Code    interface{} `json:"code,omitempty"`
}

func BuildErrorResponse(ctx echo.Context, status int, err error, body interface{}) error {
	return BuildStandardResponse(ctx, status, Response{Message: err.Error(), Code: status, Data: body})
}

func BuildSuccessResponse(ctx echo.Context, status int, body interface{}) error {
	return BuildStandardResponse(ctx, status, Response{Message: "Successful", Code: status, Data: body})
}

func BuildStandardResponse(ctx echo.Context, status int, resp Response) error {
	return ctx.JSON(status, Response{Data: resp.Data, Code: resp.Code, Message: resp.Message})
}

func GenerateRandomString(length int) string {
	var rng = rand.New(rand.NewSource(time.Now().UnixNano()))
	result := make([]byte, length)

	for i := range result {
		result[i] = charset[rng.Intn(len(charset))] // Use the local RNG instance
	}

	return string(result)
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

func Map[T any, R any](input []T, transform func(T) R) []R {
	result := make([]R, len(input))
	for i, v := range input {
		result[i] = transform(v)
	}
	return result
}

func CreateTxtFile(folderPath string, fileName string) *os.File {
	filename := fmt.Sprintf("%s%s_%s.txt", folderPath, fileName, MakeUniqueIDWithTime())
	file, err := os.Create(filename)
	if err != nil {
		log.Println(err)
		return nil
	}

	return file
}

func ConvertStringToDate(dateString string) (time.Time, error) {
	return time.Parse("2006-01-02", dateString)
}
