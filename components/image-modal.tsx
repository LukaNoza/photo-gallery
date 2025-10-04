"use client"

import { useEffect, useState } from "react"
import type { UnsplashImage } from "@/lib/types"
import { getImageDetails } from "@/lib/api-client"
import Image from "next/image"
import { X, Download, Eye, Heart, User } from "lucide-react"

interface ImageModalProps {
  image: UnsplashImage
  onClose: () => void
}

export function ImageModal({ image, onClose }: ImageModalProps) {
  const [detailedImage, setDetailedImage] = useState<UnsplashImage>(image)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch detailed image data
    const fetchDetails = async () => {
      try {
        const details = await getImageDetails(image.id)
        setDetailedImage(details)
      } catch (error) {
        console.error("Failed to fetch image details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetails()
  }, [image.id])

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = "unset"
      window.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  const formatNumber = (num: number | undefined): string => {
    if (!num) return "0"
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-lg bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Image section */}
          <div className="relative flex-1 bg-muted">
            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:h-[90vh]">
              <Image
                src={detailedImage.urls.regular || "/placeholder.svg"}
                alt={detailedImage.alt_description || detailedImage.description || "Unsplash image"}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Details section */}
          <div className="w-full space-y-6 overflow-y-auto p-6 lg:w-96">
            {/* User info */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{detailedImage.user.name}</p>
                <p className="text-sm text-muted-foreground">@{detailedImage.user.username}</p>
              </div>
            </div>

            {/* Description */}
            {(detailedImage.description || detailedImage.alt_description) && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Description</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {detailedImage.description || detailedImage.alt_description}
                </p>
              </div>
            )}

            {/* Statistics */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Likes</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {isLoading ? "..." : formatNumber(detailedImage.likes)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Downloads</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {isLoading ? "..." : formatNumber(detailedImage.downloads)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">Views</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {isLoading ? "..." : formatNumber(detailedImage.views)}
                  </span>
                </div>
              </div>
            </div>

            {/* Download button */}
            <a
              href={detailedImage.urls.full}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="h-5 w-5" />
              Download Full Size
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
