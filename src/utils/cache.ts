// Enhanced caching utility with TTL and storage options
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  storage?: 'memory' | 'session' | 'local';
  serialize?: boolean;
}

class CacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      ttl = this.defaultTTL,
      storage = 'memory',
      serialize = true,
    } = options;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    try {
      switch (storage) {
        case 'memory':
          this.memoryCache.set(key, entry);
          break;
        case 'session':
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.setItem(
              key,
              serialize ? JSON.stringify(entry) : String(entry.data)
            );
          }
          break;
        case 'local':
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(
              key,
              serialize ? JSON.stringify(entry) : String(entry.data)
            );
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to cache data for key: ${key}`, error);
    }
  }

  get<T>(
    key: string,
    options: Pick<CacheOptions, 'storage' | 'serialize'> = {}
  ): T | null {
    const { storage = 'memory', serialize = true } = options;

    try {
      let entry: CacheEntry<T> | null = null;

      switch (storage) {
        case 'memory':
          entry = this.memoryCache.get(key) || null;
          break;
        case 'session':
          if (typeof window !== 'undefined' && window.sessionStorage) {
            const item = sessionStorage.getItem(key);
            entry = item
              ? serialize
                ? JSON.parse(item)
                : { data: item, timestamp: Date.now(), ttl: this.defaultTTL }
              : null;
          }
          break;
        case 'local':
          if (typeof window !== 'undefined' && window.localStorage) {
            const item = localStorage.getItem(key);
            entry = item
              ? serialize
                ? JSON.parse(item)
                : { data: item, timestamp: Date.now(), ttl: this.defaultTTL }
              : null;
          }
          break;
      }

      if (!entry) return null;

      // Check if entry has expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.delete(key, { storage });
        return null;
      }

      return entry.data;
    } catch (error) {
      console.warn(`Failed to retrieve cached data for key: ${key}`, error);
      return null;
    }
  }

  delete(key: string, options: Pick<CacheOptions, 'storage'> = {}): void {
    const { storage = 'memory' } = options;

    try {
      switch (storage) {
        case 'memory':
          this.memoryCache.delete(key);
          break;
        case 'session':
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.removeItem(key);
          }
          break;
        case 'local':
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem(key);
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to delete cached data for key: ${key}`, error);
    }
  }

  clear(storage: 'memory' | 'session' | 'local' = 'memory'): void {
    try {
      switch (storage) {
        case 'memory':
          this.memoryCache.clear();
          break;
        case 'session':
          if (typeof window !== 'undefined' && window.sessionStorage) {
            sessionStorage.clear();
          }
          break;
        case 'local':
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.clear();
          }
          break;
      }
    } catch (error) {
      console.warn(`Failed to clear ${storage} cache`, error);
    }
  }

  // Clean up expired entries from memory cache
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    return {
      memoryEntries: this.memoryCache.size,
      sessionEntries:
        typeof window !== 'undefined' && window.sessionStorage
          ? sessionStorage.length
          : 0,
      localEntries:
        typeof window !== 'undefined' && window.localStorage
          ? localStorage.length
          : 0,
    };
  }
}

export const cache = new CacheManager();

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(
    () => {
      cache.cleanup();
    },
    5 * 60 * 1000
  );
}

// Utility functions for common caching patterns
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  options?: CacheOptions
) => {
  const generateKey = keyGenerator || ((...args) => JSON.stringify(args));

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = `memoize_${fn.name}_${generateKey(...args)}`;

    let result = cache.get<ReturnType<T>>(key, options);
    if (result === null) {
      result = fn(...args);
      cache.set(key, result, options);
    }

    return result as ReturnType<T>;
  }) as T;
};

export const cacheAsync = async <T>(
  key: string,
  asyncFn: () => Promise<T>,
  options?: CacheOptions
): Promise<T> => {
  // Try to get from cache first
  let result = cache.get<T>(key, options);

  if (result === null) {
    // Not in cache, execute the async function
    result = await asyncFn();
    cache.set(key, result, options);
  }

  return result;
};
