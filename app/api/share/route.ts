import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const text = searchParams.get("text")
  const url =
    searchParams.get("url") ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"

  if (!text) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 })
  }

  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)

  return NextResponse.json({
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
  })
}
