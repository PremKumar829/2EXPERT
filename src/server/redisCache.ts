/**
 * 2EXPERT Quick-Commerce Redis Caching Architecture
 * 
 * In production deployment with Redis (e.g., Upstash Redis, AWS ElastiCache, or Redis Cloud):
 * - Key TTLs:
 *   - `store:status` -> 30 seconds (high frequency lookup for shop open/closed)
 *   - `catalog:products:all` -> 5 minutes (invalidated on product mutations)
 *   - `catalog:category:<name>` -> 5 minutes
 *   - `order:status:<orderId>` -> 15 seconds (frequent polling by customer tracking UI)
 *   - `rate_limit:<ip>` -> 1 minute rolling window (prevents spam orders)
 */

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string | string[]): Promise<void>;
  delPattern(pattern: string): Promise<void>;
}

// In-Memory fallback implementation for standalone demo runtime
class MemoryCacheAdapter implements CacheService {
  private store = new Map<string, { value: unknown; expiry: number | null }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value, expiry });
  }

  async del(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach(k => this.store.delete(k));
  }

  async delPattern(pattern: string): Promise<void> {
    const prefix = pattern.replace('*', '');
    for (const k of this.store.keys()) {
      if (k.startsWith(prefix)) {
        this.store.delete(k);
      }
    }
  }
}

export const redisCache = new MemoryCacheAdapter();
