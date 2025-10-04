export interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  likes: number
  downloads?: number
  views?: number
}

export interface UnsplashResponse {
  results: UnsplashImage[]
  total: number
  total_pages: number
}

export interface CacheEntry {
  data: UnsplashImage[]
  page: number
  hasMore: boolean
  timestamp: number
}

export interface SearchHistory {
  term: string
  timestamp: number
}
