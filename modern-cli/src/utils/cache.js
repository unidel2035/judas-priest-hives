/**
 * Universal Cache System - LRU Cache with TTL support
 * Provides in-memory caching for expensive operations
 */

import { EventEmitter } from 'events';

export class Cache extends EventEmitter {
  constructor(options = {}) {
    super();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutes default
    this.map = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * Get value from cache
   */
  get(key) {
    const item = this.map.get(key);
    
    if (!item) {
      this.stats.misses++;
      this.emit('miss', key);
      return null;
    }

    // Check TTL
    if (item.expires && Date.now() > item.expires) {
      this.delete(key);
      this.stats.misses++;
      this.emit('expired', key);
      return null;
    }

    // Update access order (LRU)
    this.map.delete(key);
    this.map.set(key, item);
    
    this.stats.hits++;
    this.emit('hit', key);
    return item.value;
  }

  /**
   * Set value in cache
   */
  set(key, value, ttl) {
    // Remove old entry if exists
    if (this.map.has(key)) {
      this.map.delete(key);
    }

    const expires = ttl ? Date.now() + ttl : null;
    const item = { value, expires };

    // Check size limit
    if (this.map.size >= this.maxSize) {
      const oldestKey = this.map.keys().next().value;
      this.delete(oldestKey);
      this.stats.evictions++;
      this.emit('evicted', oldestKey);
    }

    this.map.set(key, item);
    this.emit('set', key, value);
  }

  /**
   * Delete key from cache
   */
  delete(key) {
    const deleted = this.map.delete(key);
    if (deleted) {
      this.emit('deleted', key);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear() {
    this.map.clear();
    this.emit('cleared');
  }

  /**
   * Check if key exists
   */
  has(key) {
    const item = this.map.get(key);
    if (!item) return false;
    
    if (item.expires && Date.now() > item.expires) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.stats,
      size: this.map.size,
      maxSize: this.maxSize,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
    };
  }

  /**
   * Clean expired entries
   */
  cleanup() {
    const now = Date.now();
    const expiredKeys = [];

    for (const [key, item] of this.map.entries()) {
      if (item.expires && now > item.expires) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.delete(key);
    }

    return expiredKeys.length;
  }

  /**
   * Get all keys
   */
  keys() {
    return Array.from(this.map.keys());
  }

  /**
   * Get all values
   */
  values() {
    return Array.from(this.map.values()).map(item => item.value);
  }
}

/**
 * File System Cache - Specialized cache for file operations
 */
export class FileSystemCache extends Cache {
  constructor(options = {}) {
    super({ maxSize: options.maxSize || 500, ttl: options.ttl || 300000 }); // 5 minutes default
    this.baseDirs = options.baseDirs || [process.cwd()];
    this.fileHashes = new Map(); // Track file content hashes for change detection
  }

  /**
   * Generate cache key for file operation
   */
  generateKey(operation, path, options = {}) {
    return `${operation}:${path}:${JSON.stringify(options)}`;
  }

  /**
   * Check if path is cacheable (within monitored directories)
   */
  isCacheable(path) {
    return this.baseDirs.some(baseDir => path.startsWith(baseDir));
  }

  /**
   * Cache directory tree structure
   */
  cacheDirectoryTree(dirPath, depth = 2, files = []) {
    const key = this.generateKey('dir_tree', dirPath, { depth });
    this.set(key, files, 300000); // 5 minutes TTL
    return files;
  }

  /**
   * Get cached directory tree
   */
  getCachedDirectoryTree(dirPath, depth = 2) {
    const key = this.generateKey('dir_tree', dirPath, { depth });
    return this.get(key);
  }

  /**
   * Invalidate cache when file changes
   */
  invalidateFileChange(filePath) {
    // Remove all entries that might be affected by this file change
    const keysToRemove = [];
    
    for (const key of this.map.keys()) {
      if (key.includes(filePath) || key.includes(filePath.split('/').slice(0, -1).join('/'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => this.delete(key));
  }
}

/**
 * Configuration Cache - For expensive config operations
 */
export class ConfigCache extends Cache {
  constructor(options = {}) {
    super({ maxSize: options.maxSize || 100, ttl: options.ttl || 300000 }); // 5 minutes default
  }
}

/**
 * MCP Cache - For MCP server and tool operations
 */
export class MCPCache extends Cache {
  constructor(options = {}) {
    super({ maxSize: options.maxSize || 50, ttl: options.ttl || 60000 }); // 1 minute default
  }
}

/**
 * Search Cache - For fuzzy search operations
 */
export class SearchCache extends Cache {
  constructor(options = {}) {
    super({ maxSize: options.maxSize || 200, ttl: options.ttl || 60000 }); // 1 minute default
  }

  /**
   * Generate cache key for search operation
   */
  generateSearchKey(pattern, source, sourceHash) {
    return `search:${pattern}:${sourceHash || source.join('|')}`;
  }

  /**
   * Cache search results
   */
  cacheSearch(pattern, source, results, sourceHash = null) {
    const key = this.generateSearchKey(pattern, source, sourceHash);
    this.set(key, results, 60000); // 1 minute TTL
    return results;
  }

  /**
   * Get cached search results
   */
  getCachedSearch(pattern, source, sourceHash = null) {
    const key = this.generateSearchKey(pattern, source, sourceHash);
    return this.get(key);
  }
}

/**
 * Context Cache - For context file operations
 */
export class ContextCache extends Cache {
  constructor(options = {}) {
    super({ maxSize: options.maxSize || 50, ttl: options.ttl || 600000 }); // 10 minutes default
    this.fileHashes = new Map();
  }

  /**
   * Cache context file content with hash for change detection
   */
  cacheContextFile(filePath, content, type = 'unknown') {
    const hash = this.generateContentHash(content);
    const key = `context:${filePath}`;
    
    this.fileHashes.set(filePath, hash);
    this.set(key, { content, hash, type, timestamp: Date.now() }, 600000);
    
    return { content, hash, type };
  }

  /**
   * Get cached context file if unchanged
   */
  getCachedContextFile(filePath) {
    const key = `context:${filePath}`;
    const cached = this.get(key);
    
    if (!cached) return null;
    
    // Check if file hash matches (content unchanged)
    const currentHash = this.fileHashes.get(filePath);
    if (currentHash && cached.hash === currentHash) {
      return cached;
    }
    
    // Content changed, invalidate cache
    this.delete(key);
    return null;
  }

  /**
   * Simple hash function for content change detection
   */
  generateContentHash(content) {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Invalidate context cache for file
   */
  invalidateContextFile(filePath) {
    const key = `context:${filePath}`;
    this.delete(key);
    this.fileHashes.delete(filePath);
  }
}

/**
 * Global cache manager
 */
export class CacheManager extends EventEmitter {
  constructor() {
    super();
    this.caches = {
      fileSystem: new FileSystemCache(),
      config: new ConfigCache(),
      mcp: new MCPCache(),
      search: new SearchCache(),
      context: new ContextCache(),
      general: new Cache()
    };

    // Cleanup intervals
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000); // Every minute
    
    // Watch for file changes to invalidate caches
    this.setupFileWatching();
  }

  /**
   * Get cache by type
   */
  getCache(type) {
    return this.caches[type] || this.caches.general;
  }

  /**
   * Setup file system watching for cache invalidation
   */
  setupFileWatching() {
    // Watch for changes in common config directories
    const watchDirs = [
      process.cwd(),
      '.hives-cli',
      '.hives'
    ];

    try {
      const fs = require('fs');
      const path = require('path');

      for (const dir of watchDirs) {
        if (fs.existsSync(dir)) {
          fs.watch(dir, { recursive: true }, (eventType, filename) => {
            if (filename) {
              const filePath = path.join(dir, filename);
              this.invalidateFileChange(filePath);
            }
          });
        }
      }
    } catch (error) {
      // File watching might not be available in all environments
      console.debug('File watching not available:', error.message);
    }
  }

  /**
   * Invalidate caches when file changes
   */
  invalidateFileChange(filePath) {
    // Invalidate relevant caches
    this.caches.fileSystem.invalidateFileChange(filePath);
    this.caches.context.invalidateContextFile(filePath);
    
    // Emit event for other components to handle
    this.emit('fileChanged', filePath);
  }

  /**
   * Cleanup all caches
   */
  cleanup() {
    let totalCleaned = 0;
    for (const cache of Object.values(this.caches)) {
      totalCleaned += cache.cleanup();
    }
    
    if (totalCleaned > 0) {
      this.emit('cleanup', totalCleaned);
    }
  }

  /**
   * Get statistics for all caches
   */
  getAllStats() {
    const stats = {};
    for (const [name, cache] of Object.entries(this.caches)) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  /**
   * Clear all caches
   */
  clearAll() {
    for (const cache of Object.values(this.caches)) {
      cache.clear();
    }
    this.emit('cleared');
  }

  /**
   * Get cache performance summary
   */
  getPerformanceSummary() {
    const allStats = this.getAllStats();
    const summary = {
      totalHits: 0,
      totalMisses: 0,
      totalSize: 0,
      avgHitRate: 0
    };

    let cacheCount = 0;
    
    for (const [name, stats] of Object.entries(allStats)) {
      summary.totalHits += stats.hits;
      summary.totalMisses += stats.misses;
      summary.totalSize += stats.size;
      summary.avgHitRate += stats.hitRate;
      cacheCount++;
    }

    summary.avgHitRate = cacheCount > 0 ? summary.avgHitRate / cacheCount : 0;
    
    return summary;
  }

  /**
   * Shutdown cache manager
   */
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clearAll();
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();