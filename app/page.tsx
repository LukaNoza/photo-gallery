"use client"

import { useState, useCallback, useEffect } from "react"
import type { UnsplashImage } from "@/lib/types"
import { fetchPopularImages, searchImages } from "@/lib/api-client"
import { imageCache } from "@/lib/cache"
import { addToSearchHistory } from "@/lib/history"
import { SearchBar } from "@/components/search-bar"
import { ImageGrid } from "@/components/image-grid"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { ImageModal } from "@/components/image-modal"

export default function HomePage() {
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null)

  const loadImages = useCallback(async (query: string, pageNum: number, append = false) => {
    setIsLoading(true)

    try {
      // Check cache first
      const cached = imageCache.get(query, pageNum)
      if (cached) {
        setImages((prev) => (append ? [...prev, ...cached.data] : cached.data))
        setHasMore(cached.hasMore)
        setIsLoading(false)
        return
      }

      // Fetch from API
      let newImages: UnsplashImage[]
      let totalPages = 1

      if (query) {
        const response = await searchImages(query, pageNum, 20)
        newImages = response.results
        totalPages = response.total_pages

        // Add to search history only on first page
        if (pageNum === 1) {
          addToSearchHistory(query)
        }
      } else {
        newImages = await fetchPopularImages(pageNum, 20)
        totalPages = 10 // Assume 10 pages for popular images
      }

      const hasMorePages = pageNum < totalPages

      // Cache the results
      imageCache.set(query, pageNum, newImages, hasMorePages)

      setImages((prev) => (append ? [...prev, ...newImages] : newImages))
      setHasMore(hasMorePages)
    } catch (error) {
      console.error("Failed to load images:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      setPage(1)
      setImages([])
      setHasMore(true)
      loadImages(query, 1, false)
    },
    [loadImages],
  )

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadImages(searchQuery, nextPage, true)
    }
  }, [isLoading, hasMore, page, searchQuery, loadImages])

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading,
  })

  // Load initial popular images
  useEffect(() => {
    loadImages("", 1, false)
  }, [loadImages])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold text-foreground">Discover Images</h1>
          <p className="text-muted-foreground">
            {searchQuery ? `Results for "${searchQuery}"` : "Popular images from Unsplash"}
          </p>
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>

        <ImageGrid images={images} onImageClick={setSelectedImage} />

        {isLoading && <LoadingSpinner />}

        {!isLoading && images.length > 0 && hasMore && <div ref={loadMoreRef} className="h-20" />}

        {!isLoading && !hasMore && images.length > 0 && (
          <p className="py-8 text-center text-muted-foreground">No more images to load</p>
        )}
      </div>

      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </main>
  )
}
