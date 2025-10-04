import { type NextRequest, NextResponse } from "next/server"
import { fetchPopularImages } from "@/lib/unsplash"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "20")

    const images = await fetchPopularImages(page, perPage)

    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching popular images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}
