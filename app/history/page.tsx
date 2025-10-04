"use client"

import { useState, useCallback, useEffect } from "react"
import type { UnsplashImage, SearchHistory } from "@/lib/types"
import { searchImages } from "@/lib/api-client"
import { imageCache } from "@/lib/cache"
import { getSearchHistory, clearSearchHistory } from "@/lib/history"
import { HistoryList } from "@/components/history-list"
import { ImageGrid } from "@/components/image-grid"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { ImageModal } from "@/components/image-modal"
import { ArrowLeft } from "lucide-react"

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedImage, setSelectedImage] = useState<UnsplashImage | null>(null)

  useEffect(() => {
    setHistory(getSearchHistory())
  }, [])

  const loadImages = useCallback(async (term: string, pageNum: number, append = false) => {
    setIsLoading(true)

    try {
      // Check cache first
      const cached = imageCache.get(term, pageNum)
      if (cached) {
        setImages((prev) => (append ? [...prev, ...cached.data] : cached.data))
        setHasMore(cached.hasMore)
        setIsLoading(false)
        return
      }

      // Fetch from API
      const response = await searchImages(term, pageNum, 20)
      const newImages = response.results
      const hasMorePages = pageNum < response.total_pages

      // Cache the results
      imageCache.set(term, pageNum, newImages, hasMorePages)

      setImages((prev) => (append ? [...prev, ...newImages] : newImages))
      setHasMore(hasMorePages)
    } catch (error) {
      console.error("Failed to load images:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSelectTerm = useCallback(
    (term: string) => {
      setSelectedTerm(term)
      setPage(1)
      setImages([])
      setHasMore(true)
      loadImages(term, 1, false)
    },
    [loadImages],
  )

  const handleBack = useCallback(() => {
    setSelectedTerm(null)
    setImages([])
    setPage(1)
    setHasMore(true)
  }, [])

  const handleClearHistory = useCallback(() => {
    clearSearchHistory()
    setHistory([])
    setSelectedTerm(null)
    setImages([])
  }, [])

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && selectedTerm) {
      const nextPage = page + 1
      setPage(nextPage)
      loadImages(selectedTerm, nextPage, true)
    }
  }, [isLoading, hasMore, page, selectedTerm, loadImages])

  const loadMoreRef = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading,
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!selectedTerm ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground">Search History</h1>
              <p className="mt-2 text-muted-foreground">View and revisit your previous searches</p>
            </div>
            <HistoryList history={history} onSelectTerm={handleSelectTerm} onClearHistory={handleClearHistory} />
          </>
        ) : (
          <>
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to History
              </button>
              <h1 className="text-4xl font-bold text-foreground">Results for &quot;{selectedTerm}&quot;</h1>
            </div>

            <ImageGrid images={images} onImageClick={setSelectedImage} />

            {isLoading && <LoadingSpinner />}

            {!isLoading && images.length > 0 && hasMore && <div ref={loadMoreRef} className="h-20" />}

            {!isLoading && !hasMore && images.length > 0 && (
              <p className="py-8 text-center text-muted-foreground">No more images to load</p>
            )}

            {!isLoading && images.length === 0 && (
              <div className="flex min-h-[400px] items-center justify-center">
                <p className="text-muted-foreground">No images found for this search</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedImage && <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </main>
  )
}
