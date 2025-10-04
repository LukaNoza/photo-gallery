"use client"

import type { UnsplashImage } from "@/lib/types"
import Image from "next/image"

interface ImageGridProps {
  images: UnsplashImage[]
  onImageClick: (image: UnsplashImage) => void
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">No images found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <button
          key={image.id}
          onClick={() => onImageClick(image)}
          className="group relative aspect-square overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02]"
        >
          <Image
            src={image.urls.small || "/placeholder.svg"}
            alt={image.alt_description || image.description || "Unsplash image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform group-hover:translate-y-0">
            <p className="text-sm font-medium text-white">{image.user.name}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
