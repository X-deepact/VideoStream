package cache

import "sync"

// Cache is a generic thread-safe map.
type FCache[K comparable, V any] struct {
	mu   sync.RWMutex
	data map[K]V
}

// NewCache creates and initializes a new Cache instance.
func NewFCache[K comparable, V any]() *FCache[K, V] {
	return &FCache[K, V]{
		data: make(map[K]V),
	}
}

// Get retrieves a value for the given key.
// Returns the value and a boolean indicating if the key exists.
func (c *FCache[K, V]) Get(key K) (V, bool) {
	c.mu.RLock()
	defer c.mu.RUnlock()
	val, exists := c.data[key]
	return val, exists
}

// Set adds or updates the value for a given key.
func (c *FCache[K, V]) Set(key K, value V) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data[key] = value
}

// Delete removes the key-value pair for a given key.
func (c *FCache[K, V]) Delete(key K) {
	c.mu.Lock()
	defer c.mu.Unlock()
	delete(c.data, key)
}

// Clear removes all key-value pairs from the cache.
func (c *FCache[K, V]) Clear() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.data = make(map[K]V)
}

// Size returns the number of items in the cache.
func (c *FCache[K, V]) Size() int {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return len(c.data)
}
