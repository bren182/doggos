/**
 * Simple in-memory cache implementation with TTL (Time-To-Live) support
 */
class CacheManager {
  constructor(defaultTtl = 3600000) { // Default TTL: 1 hour
    this.cache = {};
    this.defaultTtl = defaultTtl;
  }

  /**
   * Set a value in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to store
   * @param {number} ttl - Time to live in milliseconds (optional)
   */
  set(key, value, ttl = this.defaultTtl) {
    const expiresAt = Date.now() + ttl;
    this.cache[key] = { value, expiresAt };
    return value;
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache[key];
    
    // Check if item exists and is not expired
    if (item && item.expiresAt > Date.now()) {
      return item.value;
    }
    
    // Remove expired item
    if (item) {
      delete this.cache[key];
    }
    
    return null;
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean} - True if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Remove an item from the cache
   * @param {string} key - Cache key
   */
  remove(key) {
    delete this.cache[key];
  }

  /**
   * Clear all items from the cache
   */
  clear() {
    this.cache = {};
  }
}

// Create and export a singleton instance
export const cacheManager = new CacheManager();

export default cacheManager;
