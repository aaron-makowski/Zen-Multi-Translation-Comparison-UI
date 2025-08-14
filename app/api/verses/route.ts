import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq, asc } from "drizzle-orm"
import { redis } from "../../../lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const offset = (page - 1) * limit

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json({ error: "Invalid pagination" }, { status: 400 })
  }

  const cacheKey = `verses:${bookId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  const data = await db
    .select()
    .from(verses)
    .where(eq(verses.bookId, bookId))
    .orderBy(asc(verses.number))
    .limit(limit)
    .offset(offset)

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}
