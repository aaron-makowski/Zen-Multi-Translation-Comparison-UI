import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { bookId, verseId, highlight } = await req.json()

  if (!bookId || !verseId || !highlight) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const url = new URL(req.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const shareUrl = `${baseUrl}/books/${bookId}/verses/${verseId}?highlight=${encodeURIComponent(highlight)}`

  return NextResponse.json({ url: shareUrl })
}
