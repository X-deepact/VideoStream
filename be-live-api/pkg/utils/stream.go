package utils

import (
	"fmt"
)

func MakePushURL(rtmpURL, token string) string {
	return fmt.Sprintf("%s/%s", rtmpURL, token)
}

func MakeBroadcastURL(hlsURL, streamKey string) string {
	return fmt.Sprintf("%s/%s.m3u8", hlsURL, streamKey)
}

// be aware, I haed coded thumbnail
func MakeThumbnailURL(apiURL, fileName string) string {
	return fmt.Sprintf("%s/api/file/thumbnail/%s", apiURL, fileName)
}

func MakeVideoURL(apiURL string, streamKey string) string {
	return fmt.Sprintf("%s/api/file/videos/%s", apiURL, streamKey+".mp4")
}

func MakeVideoPath(videoFolder, fileName string) string {
	return fmt.Sprintf("%s%s", videoFolder, fileName)
}

func MakeLiveVideoPath(liveFolder, streamKey string) (string, error) {
	liveVideoPathPattern := fmt.Sprintf("%s%s_*.flv", liveFolder, streamKey)
	liveVideoPath, err := getFilePath(liveVideoPathPattern)
	if err != nil {
		return "", err
	}
	return liveVideoPath, nil

}

func MakeScheduledVideoPath(scheduledVideosFolder, fileName string) string {
	return fmt.Sprintf("%s%s", scheduledVideosFolder, fileName)
}
