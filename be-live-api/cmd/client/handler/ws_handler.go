package handler

import (
	"database/sql"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type wsHandler struct {
	r       *echo.Group
	srv     *service.Service
	rtmpURL string
	hlsURL  string
}

var upgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024 * 4,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func newWsHandler(r *echo.Group, srv *service.Service) *wsHandler {
	streamConfig := conf.GetStreamServerConfig()

	ws := &wsHandler{
		r:       r,
		srv:     srv,
		rtmpURL: streamConfig.RTMPURL,
		hlsURL:  streamConfig.HLSURL,
	}

	ws.register()

	return ws
}

func (h *wsHandler) register() {

	group := h.r.Group("ws")

	// group.Use(utils.JWTMiddlewareStreamer())
	group.GET("/stream_live/:id", h.StreamLive)
}

func (h *wsHandler) StreamLive(c echo.Context) error {

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return err
	}

	jwtToken := c.QueryParam("token")

	log.Println(jwtToken)

	_, err = utils.ValidateAccessToken(jwtToken)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, err, nil)
	}

	conn, err := upgradeConnection.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	stream, err := h.srv.Stream.GetStreamByID(uint(id))
	if err != nil {
		return err
	}
	pushURL := utils.MakePushURL(h.rtmpURL, stream.StreamToken)

	ffmpegCmd := exec.Command("ffmpeg",
		"-f", "webm",
		"-i", "pipe:0",
		"-c:v", "libx264", // Use libx264 for efficient H.264 encoding
		"-c:a", "aac",
		"-f", "flv",
		pushURL,
	)

	ffmpegStdin, err := ffmpegCmd.StdinPipe()
	if err != nil {
		log.Println("Failed to get FFmpeg stdin pipe:", err)
		return err
	}
	defer ffmpegStdin.Close()

	if err := ffmpegCmd.Start(); err != nil {
		log.Println("Failed to start FFmpeg:", err)
		return err
	}
	defer ffmpegCmd.Wait()

	log.Println("FFmpeg process started...")

	broadCastURL := utils.MakeBroadcastURL(h.hlsURL, stream.StreamKey)

	log.Println("Broadcasting live stream url:", broadCastURL)

	stream.Status = model.STARTED
	stream.StartedAt = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	if err := h.srv.Stream.Update(stream); err != nil {
		return err
	}

	defer func() {
		stream.Status = model.ENDED
		stream.EndedAt = sql.NullTime{
			Time:  time.Now(),
			Valid: true,
		}
		if err := h.srv.Stream.Update(stream); err != nil {
			log.Println(err)
		}
	}()

	if err := conn.WriteJSON(map[string]interface{}{
		"status":        200,
		"broadcast_url": broadCastURL,
	}); err != nil {
		log.Println("Failed to write to WebSocket:", err)
		return err
	}

	// Read data from WebSocket and write to FFmpeg's stdin
	for {

		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("WebSocket connection error:", err)
			break
		}

		_, writeErr := ffmpegStdin.Write(msg)
		if writeErr != nil {
			log.Println("Failed to write to FFmpeg stdin:", writeErr)
			break
		}
	}

	// Stop FFmpeg process gracefully
	if err := ffmpegCmd.Process.Kill(); err != nil {
		log.Println("Failed to kill FFmpeg process:", err)
	} else {
		log.Println("FFmpeg process terminated.")
	}

	return nil

}
