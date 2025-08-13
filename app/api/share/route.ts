import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || searchParams.get("highlightId");
  if (!id) {
    return NextResponse.json({ error: "Missing highlight id" }, { status: 400 });
  }

  const baseUrl = req.nextUrl.origin;
  const highlightUrl = `${baseUrl}/highlights/${id}`;

  const twitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(highlightUrl)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(highlightUrl)}`;

  return NextResponse.json({ url: highlightUrl, twitter, facebook });
}
