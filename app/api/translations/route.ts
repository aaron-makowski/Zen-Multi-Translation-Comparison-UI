import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
<<<<<<< HEAD
import { eq, asc } from "drizzle-orm"
import { redis } from "../../../lib/redis"
=======
import { eq } from "drizzle-orm"
import { Redis } from "@upstash/redis"

let redis: Redis | null = null
try {
  redis = Redis.fromEnv()
} catch {
  redis = null
}
>>>>>>> origin/codex/integrate-postgresql-and-update-db.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const verseId = searchParams.get("verseId")
<<<<<<< HEAD
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "5", 10)
  const offset = (page - 1) * limit
=======
  const page = parseInt(searchParams.get("page") || "0")
  const limit = parseInt(searchParams.get("limit") || "5")
>>>>>>> origin/codex/integrate-postgresql-and-update-db.ts

  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }

<<<<<<< HEAD
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json({ error: "Invalid pagination" }, { status: 400 })
  }

=======
>>>>>>> origin/codex/integrate-postgresql-and-update-db.ts
  const cacheKey = `translations:${verseId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

<<<<<<< HEAD
  const data = await db
    .select()
    .from(translations)
    .where(eq(translations.verseId, verseId))
    .orderBy(asc(translations.translator))
    .limit(limit)
    .offset(offset)
=======
  const data = await db.query.translations.findMany({
    where: eq(translations.verseId, verseId),
    orderBy: (translations, { asc }) => [asc(translations.translator)],
    limit,
    offset: page * limit,
  })
>>>>>>> origin/codex/integrate-postgresql-and-update-db.ts

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}
