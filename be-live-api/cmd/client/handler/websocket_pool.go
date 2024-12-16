package handler

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var liveUpgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024 * 2,
	WriteBufferSize: 1024 * 12,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type ConnectionPool struct {
	Connections map[*websocket.Conn]uint
	mu          sync.Mutex
}

func NewConnectionPool() *ConnectionPool {
	return &ConnectionPool{
		Connections: make(map[*websocket.Conn]uint),
	}
}

func (pool *ConnectionPool) Add(conn *websocket.Conn, userID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	pool.Connections[conn] = userID
}

func (pool *ConnectionPool) Remove(conn *websocket.Conn) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	delete(pool.Connections, conn)
	conn.Close()
}

func (pool *ConnectionPool) Broadcast(message []byte) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	for conn := range pool.Connections {
		err := conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Printf("Error writing to WebSocket: %v", err)
			pool.Remove(conn)
		}
	}
}
