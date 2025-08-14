import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq, asc } from "drizzle-orm"
import { redis } from "@/lib/redis"

const DEFAULT_LIMIT = 20

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10)

  if (!bookId) {
    return NextResponse.json({ error: "bookId required" }, { status: 400 })
  }

  const cacheKey = `verses:${bookId}:${page}:${limit}`
  const cached = await redis.get(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  const data = await db.query.verses.findMany({
    where: eq(verses.bookId, bookId),
    orderBy: (verses, { asc }) => [asc(verses.number)],
    limit,
    offset: (page - 1) * limit,
  })

  await redis.set(cacheKey, data, { ex: 60 })

  return NextResponse.json(data)
}
