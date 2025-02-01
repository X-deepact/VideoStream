package handler

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type wsHandler struct {
	r      *echo.Group
	srv    *service.Service
	wsPool *ConnectionPool

	rtmpURL      string
	hlsURL       string
	avatarFolder string
	ApiURL       string

	wsWG               *sync.WaitGroup
	mCtx               context.Context
	viewMap            *ViewCache
	wsNotificationPool *wsNotificationPool
}

func newWsHandler(r *echo.Group, srv *service.Service, ctx context.Context, wg *sync.WaitGroup, wsNotificationPool *wsNotificationPool, wsPool *ConnectionPool) *wsHandler {
	streamConfig := conf.GetStreamServerConfig()
	fileStorageCfg := conf.GetFileStorageConfig()

	wsH := &wsHandler{
		r:       r,
		srv:     srv,
		wsPool:  wsPool,
		rtmpURL: streamConfig.RTMPURL,
		hlsURL:  streamConfig.HLSURL,

		mCtx: ctx,
		wsWG: wg,

		viewMap:            newViewCache(),
		wsNotificationPool: wsNotificationPool,
		avatarFolder:       fileStorageCfg.AvatarFolder,
		ApiURL:             conf.GetApiFileConfig().Url,
	}

	wsH.register()

	return wsH
}

func (h *wsHandler) register() {
	group := h.r.Group("ws")

	group.GET("/stream_live/:id", h.StreamLive)
	group.GET("/stream_live/:id/interaction", h.handleUserInteraction)
	group.GET("/notification", h.handleNotification)
}

func (h *wsHandler) StreamLive(c echo.Context) error {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return err
	}

	jwtToken := c.QueryParam("token")

	claims, err := utils.ValidateAccessToken(jwtToken)
	if err != nil {
		log.Println(err)
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, err, nil)
	}
	if claims.RoleType != model.STREAMER {
		log.Println(err)
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, errors.New("you haven't authorized the role streamer"), nil)
	}

	conn, err := streamUpgradeConnection.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	stream, err := h.srv.Stream.GetStreamByIDAndStatus(uint(id), model.PENDING)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, err, nil)
	}

	h.wsPool.InitializePool(stream.ID)
	// before close pool, send message to all client
	defer func() {
		endMessage := dto.LiveEndDto{
			Type: dto.LiveEndType,
		}

		h.wsPool.BroadcastJSON(stream.ID, &endMessage)
		h.wsPool.ClosePool(stream.ID)

	}()

	pushURL := utils.MakePushURL(h.rtmpURL, stream.StreamToken.String)

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

	if stream.StreamType == model.SOFTWARESTREAM {
		stream.Status = model.PENDINGSOFTWARE
	} else {
		stream.Status = model.STARTED
	}
	stream.StartedAt = sql.NullTime{
		Time:  time.Now(),
		Valid: true,
	}
	if err := h.srv.Stream.Update(stream); err != nil {
		return err
	}

	if stream.Status == model.PENDINGSOFTWARE {
		go func() {
			for {
				if CheckStreamStatus(broadCastURL) {
					stream.Status = model.STARTED
					stream.StartedAt = sql.NullTime{
						Time:  time.Now(),
						Valid: true,
					}
					if err := h.srv.Stream.Update(stream); err != nil {
						return
					}

					if err := conn.WriteJSON(map[string]interface{}{
						"type": "started_software",
					}); err != nil {
						log.Println("Failed to write to WebSocket:", err)
						return
					}

					h.sendNotificationLive(stream)

					break
				}

				// Check every 5 seconds
				time.Sleep(5 * time.Second)
			}

			for {
				if !CheckStreamStatus(broadCastURL) {
					if err := conn.WriteJSON(map[string]interface{}{
						"type": "ended_software",
					}); err != nil {
						return
					}

					break
				}

				// Check every 5 seconds
				time.Sleep(5 * time.Second)
			}
		}()
	}

	if err := h.srv.Stream.InitializeStreamAnalytics(stream); err != nil {
		return err
	}

	//send notification live
	if stream.StreamType != model.SOFTWARESTREAM {
		h.sendNotificationLive(stream)
	}

	wsCloseChan := make(chan bool)

	defer func() {
		h.viewMap.Remove(stream.ID)
		wsCloseChan <- true
		log.Println("Send close message to wsCloseChan")
	}()

	isEndByAdmin := make(chan bool)

	go func() {
		h.srv.Stream.IsEndByAdmin(stream.ID, c.Request().Context(), isEndByAdmin)
	}()

	if err := conn.WriteJSON(map[string]interface{}{
		"status":        200,
		"broadcast_url": broadCastURL,
		"started_at":    stream.StartedAt.Time,
	}); err != nil {
		log.Println("Failed to write to WebSocket:", err)
		return err
	}

	h.wsWG.Add(1)
	go func() {
		defer func() {
			h.wsWG.Done()
			log.Println("Live Stream cleanup ended")
		}()

		for {
			select {
			case <-h.mCtx.Done():
				log.Println("Live Stream ending by main CTx")

				// have to close here
				conn.Close()

				if err := h.srv.Stream.FinishLiveStream(stream, true); err != nil {
					log.Println("Failed to finish live stream:", err)
				}

				_ = h.srv.Notification.UpdateEndStream(stream.ID)
				return
			case <-wsCloseChan:
				log.Println("Live Stream ending by websocket")

				if err := h.srv.Stream.FinishLiveStream(stream, false); err != nil {
					log.Println("Failed to finish live stream:", err)
				}

				_ = h.srv.Notification.UpdateEndStream(stream.ID)
				return
			}
		}

	}()

	// Read data from WebSocket and write to FFmpeg's stdin
mainLoop:
	for {
		select {
		case end := <-isEndByAdmin:
			if end {
				log.Println("Stream ended by admin.")
				break mainLoop // Breaks out of the for loop
			}
		default:
			_, msg, err := conn.ReadMessage()
			if err != nil {
				log.Println("WebSocket connection error:", err)
				break mainLoop // Breaks out of the for loop
			}

			_, writeErr := ffmpegStdin.Write(msg)
			if writeErr != nil {
				log.Println("Failed to write to FFmpeg stdin:", writeErr)
				break mainLoop // Breaks out of the for loop
			}
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

func (h *wsHandler) handleUserInteraction(c echo.Context) error {
	// claims := c.Get("user").(*utils.Claims)
	jwtToken := c.QueryParam("token")

	claims, err := utils.ValidateAccessToken(jwtToken)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, err, nil)
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 64)
	if err != nil {
		return err
	}

	streamID := uint(id)

	conn, err := liveUpgradeConnection.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	stream, err := h.srv.Stream.GetStreamByID(streamID)
	if err != nil || stream == nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("stream with id %d not found", id), nil)
	}

	if stream.UserID != claims.ID && stream.Status != model.STARTED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("stream with id %d is not live", id), nil)
	}

	h.wsPool.Add(streamID, conn, claims.ID)
	defer h.wsPool.Remove(streamID, conn)

	// send Initital Message
	initialMessage, err := h.srv.Interaction.GetInitialLiveMessage(streamID, claims.ID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}
	initialMessage.StartedAt = stream.StartedAt.Time

	h.viewMap.Add(streamID, claims.ID)
	defer func() {
		h.viewMap.Subtract(streamID, claims.ID)

		// when someone exits notify all connections related to stream
		go h.sendViewInfoForInteractionWS(streamID)
	}()

	if err = conn.WriteJSON(initialMessage); err != nil {
		log.Printf("Error writing to WebSocket: %v", err)
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	// when someone enters notify all connections related to stream
	go h.sendViewInfoForInteractionWS(streamID)

	wsCloseChan := make(chan bool)

	defer func() {
		wsCloseChan <- true
		log.Println("Send close message to wsCloseChan in interaction ws")
	}()

	h.wsWG.Add(1)
	go func() {
		defer func() {
			h.wsWG.Done()
			log.Println("Interaction ended")
		}()

		if err := h.srv.Stream.AddViewForLive(streamID, claims.ID); err != nil {
			log.Printf("Error adding view for live: %v", err)
		}

		for {
			select {
			case <-h.mCtx.Done():
				log.Println("View Quiting by main CTx in interaction")
				if err := h.srv.Stream.QuitView(streamID, claims.ID); err != nil {
					log.Println("Failed to quit view:", err)
				}
				return
			case <-wsCloseChan:
				log.Println("View Quitting by interaction websocket")
				if err := h.srv.Stream.QuitView(streamID, claims.ID); err != nil {
					log.Println("Failed to quit view:", err)
				}
				return
			}
		}
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Interaction WebSocket read error: %v", err)
			break
		}

		// Handle the received message
		h.handlUserInteractioneMessage(c, msg, claims.ID, streamID, conn)
	}

	return nil
}

func (h *wsHandler) handlUserInteractioneMessage(c echo.Context, message []byte, userID, streamID uint, conn *websocket.Conn) {

	var isBroadcast bool

	var baseMessage dto.BaseMessage
	if err := json.Unmarshal(message, &baseMessage); err != nil {
		log.Printf("Error unmarshaling base message: %v", err)
		return
	}

	// Step 2: Handle based on the message type
	switch baseMessage.Type {
	case dto.LiveCommentType:
		isBroadcast = true

		var comment dto.LiveComment
		if err := json.Unmarshal(baseMessage.Data, &comment); err != nil {
			log.Printf("Error unmarshaling comment: %v", err)
			return
		}

		if err := c.Validate(&comment); err != nil {
			log.Println(err)
			return
		}

		// Process the comment
		fmt.Printf("Received comment: %+v\n", comment)

		commentM := model.Comment{
			UserID:   userID,
			StreamID: streamID,
			Comment:  comment.Content,
		}

		err := h.srv.Interaction.CreateComment(&commentM)
		if err != nil {
			log.Printf("Error creating comment: %v", err)
			return
		}

		commentInfo, err := h.srv.Interaction.GetCommentInfoByCommentID(commentM.ID)
		if err != nil {
			log.Printf("Error getting comment info: %v", err)
			return
		}

		message, err = json.Marshal(commentInfo)
		if err != nil {
			log.Printf("Error marshaling like info: %v", err)
			return
		}

	case dto.LiveLikeType:
		isBroadcast = true
		// var isLikeBroadcast bool
		var like dto.LiveLike
		if err := json.Unmarshal(baseMessage.Data, &like); err != nil {
			log.Printf("Error unmarshaling like: %v", err)
			return
		}

		if err := c.Validate(&like); err != nil {
			log.Println(err)
			return
		}

		// Process the like
		fmt.Printf("Received like: %+v\n", like)

		likeM := model.Like{
			UserID:    userID,
			StreamID:  streamID,
			LikeEmote: like.LikeType,
		}

		pLike, err := h.srv.Interaction.GetLike(streamID, userID)
		if like.LikeStatus {

			// check like exists
			if err != nil {
				if !errors.Is(err, gorm.ErrRecordNotFound) {
					log.Printf("Error getting like: %v", err)
					return
				} else {
					err = h.srv.Interaction.CreateLike(&likeM)
					if err != nil {
						log.Printf("Error creating like: %v", err)
						return
					}

				}
			} else {
				// update
				pLike.LikeEmote = like.LikeType
				err = h.srv.Interaction.UpdateLike(pLike)
				if err != nil {
					log.Printf("Error updating like: %v", err)
					return
				}

			}

		} else {

			if pLike == nil {
				return
			}

			err := h.srv.Interaction.DeleteLike(streamID, userID)
			if err != nil {
				log.Printf("Error deleting like: %v", err)
				return
			}
		}

		// send like message for him or her self.
		if err := conn.WriteMessage(websocket.TextMessage, message); err != nil {
			log.Printf("Error writing to WebSocket: %v", err)
			return
		}

		likeInfo, err := h.srv.Interaction.GetLikeInfo(streamID)
		if err != nil {
			log.Printf("Error getting like info: %v", err)
			return
		}
		liveInfoResp := dto.LikeInfoDto{
			Type: dto.LikeInfoType,
			Data: likeInfo,
		}
		// liveInfo.CurrentLikeType = nil

		// beaware here for message
		message, err = json.Marshal(liveInfoResp)
		if err != nil {
			log.Printf("Error marshaling like info: %v", err)
			return
		}

	case dto.LiveShareType:
		isBroadcast = true

		shareM := model.Share{
			UserID:   userID,
			StreamID: streamID,
		}

		rowsAffected, err := h.srv.Interaction.AddShare(&shareM)
		if err != nil {
			log.Printf("Error creating share: %v", err)
			return
		}
		if rowsAffected == 0 {
			return
		}

		shareCount, err := h.srv.Interaction.CountSharesByStreamID(streamID)
		if err != nil {
			log.Printf("Error getting share count: %v", err)
			return
		}

		liveInfoResp := dto.ShareDto{
			Type:       dto.LiveShareType,
			ShareCount: shareCount,
		}

		message, err = json.Marshal(liveInfoResp)
		if err != nil {
			log.Printf("Error marshaling share info: %v", err)
			return
		}

	default:
		log.Printf("Unknown message type: %s", baseMessage.Type)
	}

	if isBroadcast {
		h.wsPool.Broadcast(streamID, message)
	}

}

func (h *wsHandler) sendViewInfoForInteractionWS(streamID uint) {
	viewTotal := h.viewMap.Get(streamID)
	// remove 1 for the streamer
	if viewTotal > 0 {
		viewTotal -= 1
	}

	go h.wsPool.BroadcastJSON(streamID, &dto.ViewInfoDto{
		Type: dto.ViewInfoType,
		Data: &dto.ViewInfo{
			Total: int64(viewTotal),
		},
	})

}

func (h *wsHandler) handleNotification(c echo.Context) error {
	jwtToken := c.QueryParam("token")

	claims, err := utils.ValidateAccessToken(jwtToken)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusUnauthorized, err, nil)
	}

	conn, err := notificationUpgradeConnection.Upgrade(c.Response().Writer, c.Request(), nil)
	if err != nil {
		return err
	}
	defer conn.Close()

	h.wsNotificationPool.Add(conn, claims.ID)
	defer h.wsNotificationPool.Remove(conn, claims.ID)

	user, err := h.srv.User.GetUserLogin(claims.Username)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if user.Status == model.BLOCKED {
		// send Message Blocked
		message := dto.NotificationDto{
			Content:   "Your account is blocked. Please contact the administrator.",
			Type:      model.NotificationTypeBlocked,
			CreatedAt: time.Now(),
			IsRead:    false,
		}

		if err = conn.WriteJSON(message); err != nil {
			log.Printf("Error writing to WebSocket: %v", err)
			return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
		}
	}

	wsCloseChan := make(chan bool)

	defer func() {
		wsCloseChan <- true
		log.Println("Send close message to wsCloseChan in notification ws")
	}()

	h.wsWG.Add(1)
	go func() {
		defer func() {
			h.wsWG.Done()

			log.Println("Notification ended")
		}()

		user, err := h.srv.User.GetUserLogin(claims.Username)
		if err != nil {
			return
		}

		if user.Status != model.BLOCKED {
			user.Status = model.ONLINE
			if err := h.srv.User.UpdateUser(user); err != nil {
				return
			}
		}

		for {
			select {
			case <-h.mCtx.Done():
				user, err := h.srv.User.GetUserLogin(claims.Username)
				if err != nil {
					return
				}

				if user.Status != model.BLOCKED && !h.wsNotificationPool.CheckExist(user.ID) {
					user.Status = model.OFFLINE
					if err := h.srv.User.UpdateUser(user); err != nil {
						return
					}
				}
			case <-wsCloseChan:
				log.Println("Notification ending by websocket")
				user, err := h.srv.User.GetUserLogin(claims.Username)
				if err != nil {
					return
				}

				if user.Status != model.BLOCKED && !h.wsNotificationPool.CheckExist(user.ID) {
					user.Status = model.OFFLINE
					if err := h.srv.User.UpdateUser(user); err != nil {
						return
					}
				}
			}
		}
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("Notification WebSocket read error: %v", err)
			break
		}

		log.Println("Notification WebSocket received: ", string(msg))

		// Handle the received message
	}

	return nil
}

func (h *wsHandler) sendNotificationLive(streamReq *model.Stream) {
	stream, err := h.srv.Stream.GetStream(streamReq.ID, streamReq.UserID)
	if err != nil {
		return
	}

	subscriberIDs, err := h.srv.Subscribe.GetSubscriberIDs(stream.UserID)
	if err != nil || len(subscriberIDs) == 0 {
		return
	}

	notification := &model.Notification{
		StreamID: stream.ID,
		Type:     model.NotificationTypeSubscribeLive,
		Content:  "{{streamer_name}} is live: {{stream_title}}",
	}

	avtURL := ""
	thumbnailURL := ""
	content := ""
	if stream.User.AvatarFileName.String != "" {
		avtURL = utils.GetFileUrl(h.avatarFolder, stream.User.AvatarFileName.String)
	}

	if stream.ThumbnailFileName != "" {
		thumbnailURL = utils.MakeThumbnailURL(h.ApiURL, stream.ThumbnailFileName)
	}

	content = strings.ReplaceAll(notification.Content, "{{streamer_name}}", stream.User.DisplayName)
	content = strings.ReplaceAll(content, "{{stream_title}}", stream.Title)

	for _, subscriberID := range subscriberIDs {
		notificationCreate := &model.Notification{
			UserID:   subscriberID,
			StreamID: notification.StreamID,
			Type:     notification.Type,
			Content:  notification.Content,
		}

		if err = h.srv.Notification.Create(notificationCreate); err != nil {
			continue
		}

		if err = h.srv.User.AddNumNotification(notificationCreate.UserID); err != nil {
			continue
		}

		message := dto.NotificationDto{
			ID:           notificationCreate.ID,
			AvatarURL:    avtURL,
			Content:      content,
			ThumbnailURL: thumbnailURL,
			StreamID:     notificationCreate.StreamID,
			Type:         notificationCreate.Type,
			IsRead:       notificationCreate.ReadAt.Valid,
			CreatedAt:    notificationCreate.CreatedAt,
			StreamerID:   &stream.UserID,
			IsMute:       false,
		}
		_ = h.wsNotificationPool.SendMessage(subscriberID, message)
	}
}

func CheckStreamStatus(url string) bool {
	client := http.Client{
		Timeout: 5 * time.Second,
	}

	resp, err := client.Get(url)
	if err != nil || resp.StatusCode != http.StatusOK {
		return false
	}
	defer resp.Body.Close()

	return true
}
