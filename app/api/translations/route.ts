import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { eq, asc } from "drizzle-orm"
import { redis } from "@/lib/redis"

const DEFAULT_LIMIT = 20

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10)

  if (!verseId) {
    return NextResponse.json({ error: "verseId required" }, { status: 400 })
  }

  const cacheKey = `translations:${verseId}:${page}:${limit}`
  const cached = await redis.get(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  const data = await db.query.translations.findMany({
    where: eq(translations.verseId, verseId),
    orderBy: (translations, { asc }) => [asc(translations.translator)],
    limit,
    offset: (page - 1) * limit,
  })

  await redis.set(cacheKey, data, { ex: 60 })

  return NextResponse.json(data)
}
