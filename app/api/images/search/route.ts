import { type NextRequest, NextResponse } from "next/server"
import { searchImages } from "@/lib/unsplash"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const perPage = Number.parseInt(searchParams.get("per_page") || "20")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const response = await searchImages(query, page, perPage)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error searching images:", error)
    return NextResponse.json({ error: "Failed to search images" }, { status: 500 })
  }
}
