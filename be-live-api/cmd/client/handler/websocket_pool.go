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

var streamUpgradeConnection = websocket.Upgrader{
	ReadBufferSize:  1024 * 4,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type ConnectionPool struct {
	// Connections map[*websocket.Conn]uint
	mu sync.Mutex

	// [stream_id][conn]user_id
	Connections map[uint]map[*websocket.Conn]uint
}

func NewConnectionPool() *ConnectionPool {
	return &ConnectionPool{
		Connections: make(map[uint]map[*websocket.Conn]uint),
		mu:          sync.Mutex{},
	}
}

func (pool *ConnectionPool) InitializePool(streamID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	pool.Connections[streamID] = make(map[*websocket.Conn]uint)
}

func (pool *ConnectionPool) ClosePool(streamID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()

	for conn := range pool.Connections[streamID] {
		conn.Close()
	}
	delete(pool.Connections, streamID)
}

func (pool *ConnectionPool) Add(streamID uint, conn *websocket.Conn, userID uint) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	pool.Connections[streamID][conn] = userID
}

func (pool *ConnectionPool) Remove(streamID uint, conn *websocket.Conn) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	delete(pool.Connections[streamID], conn)
	conn.Close()
}

func (pool *ConnectionPool) Broadcast(streamID uint, message []byte) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	for conn := range pool.Connections[streamID] {
		err := conn.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			log.Printf("Error writing to WebSocket: %v", err)
			pool.Remove(streamID, conn)
		}
	}
}

func (pool *ConnectionPool) BroadcastJSON(streamID uint, message any) {
	pool.mu.Lock()
	defer pool.mu.Unlock()
	for conn := range pool.Connections[streamID] {
		err := conn.WriteJSON(message)
		if err != nil {
			log.Printf("Error writing to WebSocket: %v", err)
			pool.Remove(streamID, conn)
		}
	}
}

// func (pool *ConnectionPool) Add(conn *websocket.Conn, userID uint) {
// 	pool.mu.Lock()
// 	defer pool.mu.Unlock()
// 	pool.Connections[conn] = userID
// }

// func (pool *ConnectionPool) Remove(conn *websocket.Conn) {
// 	pool.mu.Lock()
// 	defer pool.mu.Unlock()
// 	delete(pool.Connections, conn)
// 	conn.Close()
// }

// func (pool *ConnectionPool) Broadcast(message []byte) {
// 	pool.mu.Lock()
// 	defer pool.mu.Unlock()
// 	for conn := range pool.Connections {
// 		err := conn.WriteMessage(websocket.TextMessage, message)
// 		if err != nil {
// 			log.Printf("Error writing to WebSocket: %v", err)
// 			pool.Remove(conn)
// 		}
// 	}
// }

type ViewCache struct {
	mu      sync.RWMutex
	viewMap map[uint]uint
}

func newViewCache() *ViewCache {
	return &ViewCache{
		viewMap: make(map[uint]uint),
	}
}

func (vc *ViewCache) Add(streamID uint, userID uint) {
	vc.mu.Lock()         // Acquire write lock
	defer vc.mu.Unlock() // Release write lock

	vc.viewMap[streamID] += 1
}

func (vc *ViewCache) Subtract(streamID uint, userID uint) {
	vc.mu.Lock()
	defer vc.mu.Unlock()

	if vc.viewMap[streamID] == 0 {
		return
	}

	vc.viewMap[streamID] -= 1
}

func (vc *ViewCache) Remove(streamID uint) {
	vc.mu.Lock()
	defer vc.mu.Unlock()

	delete(vc.viewMap, streamID)
}

func (vc *ViewCache) Get(streamID uint) uint {
	vc.mu.RLock()         // Acquire read lock
	defer vc.mu.RUnlock() // Release read lock

	return vc.viewMap[streamID]
}
