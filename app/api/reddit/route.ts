import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subreddit = searchParams.get("subreddit") || "Zen"
  const cacheKey = `reddit:${subreddit}`

  if (redis) {
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
  }

  const res = await fetch(`https://www.reddit.com/r/${subreddit}.json`, {
    headers: { "User-Agent": "zen-texts-app" },
  })

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: res.status })
  }

  const json = await res.json()
  const posts = (json.data?.children || []).map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    author: child.data.author,
    url: `https://www.reddit.com${child.data.permalink}`,
    upvotes: child.data.ups,
  }))

  if (redis) {
    await redis.set(cacheKey, posts, { ex: 300 })
  }

  return NextResponse.json(posts)
}
