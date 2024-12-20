package utils

import "fmt"

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
