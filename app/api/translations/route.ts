import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { Redis } from "@upstash/redis"

let redis: Redis | null = null
try {
  redis = Redis.fromEnv()
} catch {
  redis = null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
  const page = parseInt(searchParams.get("page") || "0")
  const limit = parseInt(searchParams.get("limit") || "5")

  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }

  const cacheKey = `translations:${verseId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  const data = await db.query.translations.findMany({
    where: eq(translations.verseId, verseId),
    orderBy: (translations, { asc }) => [asc(translations.translator)],
    limit,
    offset: page * limit,
  })

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}

