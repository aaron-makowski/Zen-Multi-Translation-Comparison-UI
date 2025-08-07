import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  if (verseId) {
    const list = await db.query.translations.findMany({
      where: (translations, { eq }) => eq(translations.verseId, verseId),
    })
    return NextResponse.json(list)
  }
  const all = await db.query.translations.findMany()
  return NextResponse.json(all)
}

export async function POST(req: Request) {
  const { text, translator, language, verseId } = await req.json()
  if (!text || !translator || !verseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const [translation] = await db
    .insert(translations)
    .values({
      id: crypto.randomUUID(),
      text,
      translator,
      language: language || "English",
      verseId,
      updatedAt: new Date(),
    })
    .returning()
  return NextResponse.json(translation, { status: 201 })
}
