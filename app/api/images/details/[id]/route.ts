import { type NextRequest, NextResponse } from "next/server"
import { getImageDetails } from "@/lib/unsplash"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    const image = await getImageDetails(id)

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error fetching image details:", error)
    return NextResponse.json({ error: "Failed to fetch image details" }, { status: 500 })
  }
}
