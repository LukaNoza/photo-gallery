import type { UnsplashImage, UnsplashResponse } from "./types"

export async function fetchPopularImages(page = 1, perPage = 20): Promise<UnsplashImage[]> {
  const response = await fetch(`/api/images/list?page=${page}&per_page=${perPage}`)

  if (!response.ok) {
    throw new Error("Failed to fetch images")
  }

  return response.json()
}

export async function searchImages(query: string, page = 1, perPage = 20): Promise<UnsplashResponse> {
  const response = await fetch(`/api/images/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`)

  if (!response.ok) {
    throw new Error("Failed to search images")
  }

  return response.json()
}

export async function getImageDetails(id: string): Promise<UnsplashImage> {
  const response = await fetch(`/api/images/details/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch image details")
  }

  return response.json()
}
