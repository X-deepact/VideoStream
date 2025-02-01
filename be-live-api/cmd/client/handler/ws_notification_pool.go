package handler

import (
	"github.com/gorilla/websocket"
	"net/http"
	"sync"
)

var notificationUpgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024 * 2,
	WriteBufferSize: 1024 * 12,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type wsNotificationPool struct {
	Connections map[uint][]*websocket.Conn
	mu          sync.Mutex
}

func NewWSNotificationPool() *wsNotificationPool {
	return &wsNotificationPool{
		Connections: make(map[uint][]*websocket.Conn),
		mu:          sync.Mutex{},
	}
}

func (pool *wsNotificationPool) Add(conn *websocket.Conn, userID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()

	if _, exists := pool.Connections[userID]; !exists {
		pool.Connections[userID] = []*websocket.Conn{}
	}

	pool.Connections[userID] = append(pool.Connections[userID], conn)
}

func (pool *wsNotificationPool) Remove(conn *websocket.Conn, userID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()

	if _, exists := pool.Connections[userID]; exists {
		filtered := []*websocket.Conn{}
		for _, c := range pool.Connections[userID] {
			if c != conn {
				filtered = append(filtered, c)
			}
		}
		pool.Connections[userID] = filtered

		if len(pool.Connections[userID]) == 0 {
			delete(pool.Connections, userID)
		}
	}
	conn.Close()
}

func (pool *wsNotificationPool) SendMessage(userID uint, message any) error {
	pool.mu.Lock()
	defer pool.mu.Unlock()

	connections, exists := pool.Connections[userID]
	if !exists {
		return nil
	}

	var lastError error
	for _, conn := range connections {
		if err := conn.WriteJSON(message); err != nil {
			lastError = err
		}
	}

	return lastError
}

func (pool *wsNotificationPool) CheckExist(userID uint) bool {
	pool.mu.Lock()
	defer pool.mu.Unlock()

	_, exists := pool.Connections[userID]
	return exists
}
