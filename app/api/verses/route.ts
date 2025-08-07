import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
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
  const bookId = searchParams.get("bookId")
  const page = parseInt(searchParams.get("page") || "0")
  const limit = parseInt(searchParams.get("limit") || "10")

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

  const cacheKey = `verses:${bookId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  const data = await db.query.verses.findMany({
    where: eq(verses.bookId, bookId),
    orderBy: (verses, { asc }) => [asc(verses.number)],
    limit,
    offset: page * limit,
  })

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}
