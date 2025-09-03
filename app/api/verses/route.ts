import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq } from "drizzle-orm"
<<<<<<< HEAD
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
=======
import { redis } from "../../../lib/redis"

export async function GET(req: Request) {
>>>>>>> origin/main
  const { searchParams } = new URL(req.url)
  const bookId = searchParams.get("bookId")
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
  const offset = (page - 1) * limit
<<<<<<< HEAD

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

=======

  if (!bookId) {
    return NextResponse.json({ error: "Missing bookId" }, { status: 400 })
  }

>>>>>>> origin/main
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    return NextResponse.json({ error: "Invalid pagination" }, { status: 400 })
  }
<<<<<<< HEAD

  const cacheKey = `verses:${bookId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

=======
  const cacheKey = `verses:${bookId}:${page}:${limit}`
  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

>>>>>>> origin/main
  const data = await db.query.verses.findMany({
    where: eq(verses.bookId, bookId),
    orderBy: (verses, { asc }) => [asc(verses.number)],
    limit,
    offset,
  })
<<<<<<< HEAD

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}
=======

  if (redis) {
    await redis.set(cacheKey, data, { ex: 60 })
  }

  return NextResponse.json(data)
}
>>>>>>> origin/main
