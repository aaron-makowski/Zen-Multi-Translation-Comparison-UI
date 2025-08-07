import { NextResponse } from "next/server"
import { redis } from "../../../lib/redis"

const SUBREDDIT = process.env.REDDIT_SUBREDDIT || "Zen"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const subreddit = searchParams.get("subreddit") || SUBREDDIT
  const cacheKey = `reddit:${subreddit}`

  try {
    if (redis) {
      const cached = await redis.get(cacheKey)
      if (cached) {
        return NextResponse.json(cached)
      }
    }

    const res = await fetch(`https://www.reddit.com/r/${subreddit}.json`, {
      headers: { "User-Agent": "ZenMultiTranslation/1.0" },
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
  } catch (error) {
    console.error("Reddit fetch failed", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
