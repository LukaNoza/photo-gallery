import type { UnsplashImage, CacheEntry } from "./types"

class ImageCache {
  private cache: Map<string, CacheEntry> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private getCacheKey(query: string, page: number): string {
    return `${query || "popular"}_${page}`
  }

  get(query: string, page: number): CacheEntry | null {
    const key = this.getCacheKey(query, page)
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key)
      return null
    }

    return entry
  }

  set(query: string, page: number, data: UnsplashImage[], hasMore: boolean): void {
    const key = this.getCacheKey(query, page)
    this.cache.set(key, {
      data,
      page,
      hasMore,
      timestamp: Date.now(),
    })
  }

  clear(): void {
    this.cache.clear()
  }
}

export const imageCache = new ImageCache()
