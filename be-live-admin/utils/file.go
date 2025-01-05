package utils

import (
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"reflect"
	"strings"

	"github.com/labstack/echo/v4"
)

func GetfileSize(path string) (int64, error) {
	fileInfo, err := os.Stat(path)
	if err != nil {
		return 0, err
	}

	return fileInfo.Size(), nil
}

// pattern := "/home/user/recordings/live/0f5be8fc-134d-4ed5-843d-a1aa62501264_*.flv"
func getFilePath(pattern string) (string, error) {

	matches, err := filepath.Glob(pattern)
	if err != nil {
		fmt.Println("Error matching files:", err)
		return "", err
	}

	if len(matches) == 0 {
		fmt.Println("No files found matching the pattern.")
		return "", fmt.Errorf("no files found matching the pattern")
	}

	log.Println(len(matches))

	return matches[0], nil
}

func IsImage(fileHeader *multipart.FileHeader) (bool, error) {
	// Open the uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		return false, err
	}
	defer file.Close()

	// Read the first 512 bytes of the file
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return false, err
	}

	// Detect MIME type
	mimeType := http.DetectContentType(buffer)
	return mimeType == "image/jpeg" || mimeType == "image/png" || mimeType == "image/gif", nil
}

func IsFlvFile(fileHeader *multipart.FileHeader) (bool, error) {
	// Open the uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		return false, err
	}
	defer file.Close()

	// Read the first 512 bytes of the file
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return false, err
	}

	// Detect MIME type
	mimeType := http.DetectContentType(buffer)
	fmt.Println("format: ", mimeType)
	return mimeType == "video/x-flv", nil
}

func IsVideoFile(fileHeader *multipart.FileHeader) (bool, error) {
	// Open the uploaded file
	file, err := fileHeader.Open()
	if err != nil {
		return false, err
	}
	defer file.Close()

	// Read the first 512 bytes of the file
	buffer := make([]byte, 512)
	_, err = file.Read(buffer)
	if err != nil {
		return false, err
	}

	// Detect MIME type
	mimeType := http.DetectContentType(buffer)
	fmt.Println("format: ", mimeType)

	// return mimeType == "video/mp4" || mimeType == "video/x-flv" || mimeType == "video/webm" || mimeType == "video/x-matroska", nil
	return mimeType == "video/mp4" || mimeType == "video/x-flv", nil
}

func GetFileExtension(fileHeader *multipart.FileHeader) string {
	return filepath.Ext(fileHeader.Filename)
}

func GetFileUrl(rootFolder, apiUrl, folderPath string, fileName string) string {
	return fmt.Sprintf("%s%s%s%s", apiUrl, "/api/file",
		strings.Replace(folderPath, rootFolder, "", 1), fileName)
}

func InitFolder[T any](cfg *T) error {
	paths := reflect.ValueOf(cfg).Elem()

	for i := 0; i < paths.NumField(); i++ {
		fieldValue := paths.Field(i)

		if err := os.MkdirAll(fieldValue.String(), 0755); err != nil {
			return err
		}
	}

	return nil
}

func SaveImage(c echo.Context, file *multipart.FileHeader, folderPath string) (int, string, error) {
	isImage, err := IsImage(file)
	if err != nil {
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	if !isImage {
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, errors.New("file is not an image"), nil)
	}

	// save image
	name := MakeUniqueIDWithTime()
	path := fmt.Sprintf("%s/%s%s", folderPath, name, GetFileExtension(file))

	src, err := file.Open()
	if err != nil {
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, src); err != nil {
		if err := os.Remove(path); err != nil {
			log.Println(err)
		}
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	name = fmt.Sprintf("%s%s", name, GetFileExtension(file))
	return http.StatusOK, name, nil
}

func RemoveFiles(files []string) error {
	for _, file := range files {
		if err := os.Remove(file); err != nil {
			log.Println(err)
			return err
		}
	}
	return nil
}

func RemoveFilesWithNoErrReturn(files []string) {
	for _, file := range files {
		if err := os.Remove(file); err != nil {
			log.Println(err)
		}
	}
}

const (
	MAX_VIDEO_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
	MAX_IMAGE_SIZE = 1 * 1024 * 1024
)
