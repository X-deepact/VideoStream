package handler

import (
	"encoding/json"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/dto"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type userInteractionHandler struct {
	r      *echo.Group
	srv    *service.Service
	wsPool *ConnectionPool
}

func newUserInteractionHandler(r *echo.Group, srv *service.Service) *userInteractionHandler {
	uiH := &userInteractionHandler{
		r:      r,
		srv:    srv,
		wsPool: NewConnectionPool(),
	}

	uiH.register()

	return uiH
}

func (h *userInteractionHandler) register() {
	group := h.r.Group("ws")

	group.GET("/stream_live/:id/interaction", h.handleUserInteraction)
}

func (h *userInteractionHandler) handleUserInteraction(c echo.Context) error {
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

	h.wsPool.Add(conn, claims.ID)
	defer h.wsPool.Remove(conn)

	stream, err := h.srv.Stream.GetStreamByID(streamID)
	if err != nil || stream == nil {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("stream with id %d not found", id), nil)
	}

	if stream.Status != model.STARTED {
		return utils.BuildErrorResponse(c, http.StatusBadRequest, fmt.Errorf("stream with id %d is not live", id), nil)
	}

	// send Initital Message
	initialMessage, err := h.srv.Interaction.GetInitialLiveMessage(streamID)
	if err != nil {
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	if err = conn.WriteJSON(initialMessage); err != nil {
		log.Printf("Error writing to WebSocket: %v", err)
		return utils.BuildErrorResponse(c, http.StatusInternalServerError, err, nil)
	}

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Printf("WebSocket read error: %v", err)
			break
		}

		// Handle the received message
		h.handlUserInteractioneMessage(msg, claims.ID, streamID)
	}

	return nil
}

func (h *userInteractionHandler) handlUserInteractioneMessage(message []byte, userID, streamID uint) {

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

	case dto.LiveLikeType:
		isBroadcast = true
		var like dto.LiveLike
		if err := json.Unmarshal(baseMessage.Data, &like); err != nil {
			log.Printf("Error unmarshaling like: %v", err)
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
					isBroadcast = false
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

				isBroadcast = false

			}

		} else {

			if pLike == nil {
				isBroadcast = false
				return
			}

			err := h.srv.Interaction.DeleteLike(streamID, userID)
			if err != nil {
				log.Printf("Error deleting like: %v", err)
				return
			}
		}

	default:
		log.Printf("Unknown message type: %s", baseMessage.Type)
	}

	if isBroadcast {
		h.wsPool.Broadcast(message)
	}

}
