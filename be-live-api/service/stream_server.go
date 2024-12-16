package service

import (
	"encoding/json"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"io"
	"log"
	"net/http"
)

type streamServerService struct {
	streamServerHTTPURL string
	rtmpURL             string
}

func newStreamServerService() *streamServerService {
	streamConfig := conf.GetStreamServerConfig()
	return &streamServerService{
		streamServerHTTPURL: streamConfig.HTTPURL,
		rtmpURL:             streamConfig.RTMPURL,
	}
}

type Response struct {
	Status int    `json:"status"`
	Data   string `json:"data"`
}

func (s *streamServerService) GetChannelKey(key string) (string, error) {
	url := fmt.Sprintf("%s/control/get?room=%s", s.streamServerHTTPURL, key)

	resp, err := http.Get(url)
	if err != nil {
		log.Printf("Error sending GET request: %v\n", err)
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v\n", err)
		return "", err
	}

	fmt.Printf("Response Status: %s\n", resp.Status)
	fmt.Printf("Response Body: %s\n", string(body))

	response := Response{}
	if err := json.Unmarshal(body, &response); err != nil {
		log.Printf("Error unmarshalling JSON: %v\n", err)
		return "", err
	}
	fmt.Println(response.Data)

	return response.Data, nil

}
