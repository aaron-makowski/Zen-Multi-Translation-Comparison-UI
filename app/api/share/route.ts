import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { highlights, verses } from "@/lib/schema";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const [highlight] = await db
    .select()
    .from(highlights)
    .where(eq(highlights.id, id));

  if (!highlight || !highlight.isPublic) {
    return NextResponse.json({ error: "Highlight not found" }, { status: 404 });
  }

  const [verse] = await db
    .select()
    .from(verses)
    .where(eq(verses.id, highlight.verseId));

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en";
  const path = verse
    ? `/books/${verse.bookId}/verses/${verse.id}`
    : "";
  const url = `${baseUrl}/${locale}${path}?highlight=${highlight.id}`;

  return NextResponse.json({ url });
}
