package utils

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
)

const MaxImageSize = 1 << 20 // 1MB

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

func GetFileExtension(fileHeader *multipart.FileHeader) string {
	return filepath.Ext(fileHeader.Filename)
}

func GetFileUrl(folderPath string, fileName string) string {
	apiFileConfig := conf.GetApiFileConfig()

	return fmt.Sprintf("%s%s%s%s", apiFileConfig.Url, "/api/file",
		strings.Replace(folderPath, conf.GetFileStorageConfig().RootFolder, "", 1), fileName)
}

func InitFolder() error {
	paths := reflect.ValueOf(conf.GetFileStorageConfig()).Elem()

	for i := 0; i < paths.NumField(); i++ {
		fieldValue := paths.Field(i)

		if err := os.MkdirAll(fieldValue.String(), 0755); err != nil {
			return err
		}
	}

	return nil
}

func SaveImage(c echo.Context, file *multipart.FileHeader, folderPath string) (int, string, error) {
	if file.Size > MaxImageSize {
		return http.StatusBadRequest, "", BuildErrorResponse(c, http.StatusBadRequest, errors.New("file size exceeds the maximum allowed limit of 1MB"), nil)
	}

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

// got in seconds
func getVideoDuration(filePath string) (float64, error) {
	out, err := exec.Command("ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", filePath).Output()
	if err != nil {
		return 0, err
	}

	durationStr := strings.TrimSpace(string(out))
	duration, err := strconv.ParseFloat(durationStr, 64)
	if err != nil {
		return 0, err
	}

	return duration, nil
}

func convertSecondsToTime(seconds float64) time.Duration {
	return time.Duration(seconds * float64(time.Second))
}

func GetDurationInMicroSeconds(filePath string) (uint, error) {
	durationSec, err := getVideoDuration(filePath)
	if err != nil {
		return 0, err
	}

	duration := convertSecondsToTime(durationSec)

	return uint(duration.Microseconds()), nil
}

func GetFilesModifiedBeforeLast7Days(dir string) ([]string, error) {
	var modifiedFiles []string

	// Get the current time in UTC and the time 7 days ago in UTC
	now := time.Now().UTC()
	sevenDaysAgo := now.AddDate(0, 0, -7)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Log file modification time in UTC, file name, and path
		// log.Println(info.ModTime().UTC())
		// log.Println(sevenDaysAgo, info.ModTime().UTC().Before(sevenDaysAgo))
		// log.Println(path)

		// fmt.Println()

		// Check if the file was modified more than 7 days ago in UTC
		if info.ModTime().UTC().Before(sevenDaysAgo) {
			modifiedFiles = append(modifiedFiles, path)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return modifiedFiles, nil
}

func ExtractUUIDFromFilePath(filePath string) (string, error) {
	base := filepath.Base(filePath) // e.g., "2f2ccfc3-3bbb-45a6-9879-0c574576dda6_1735533584.flv"

	parts := strings.Split(base, "_")
	if len(parts) == 0 {
		return "", fmt.Errorf("invalid file format: %s", filePath)
	}

	// The UUID is the first part before "_"
	return parts[0], nil
}
