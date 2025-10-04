import type { UnsplashImage, UnsplashResponse } from "./types"

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || ""
const BASE_URL = "https://api.unsplash.com"

export async function fetchPopularImages(page = 1, perPage = 20): Promise<UnsplashImage[]> {
  const response = await fetch(`${BASE_URL}/photos?page=${page}&per_page=${perPage}&order_by=popular`, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch images")
  }

  return response.json()
}

export async function searchImages(query: string, page = 1, perPage = 20): Promise<UnsplashResponse> {
  const response = await fetch(
    `${BASE_URL}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    throw new Error("Failed to search images")
  }

  return response.json()
}

export async function getImageDetails(id: string): Promise<UnsplashImage> {
  const response = await fetch(`${BASE_URL}/photos/${id}`, {
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch image details")
  }

  return response.json()
}
