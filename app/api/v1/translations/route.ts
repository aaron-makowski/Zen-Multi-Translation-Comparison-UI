import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const result = verseId
    ? await db.select().from(translations).where(eq(translations.verseId, verseId))
    : await db.select().from(translations)
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const { text, translator, language, verseId } = await req.json()
  if (!text || !translator || !verseId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const newTranslation = {
    id: crypto.randomUUID(),
    text,
    translator,
    language: language || "English",
    verseId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  await db.insert(translations).values(newTranslation)
  return NextResponse.json(newTranslation, { status: 201 })
}
