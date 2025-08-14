<<<<<<< HEAD
import { NextResponse } from "next/server"
import { redis } from "../../../lib/redis"

export async function GET() {
  try {
    const res = await fetch("https://www.reddit.com/r/Zen.json")
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: res.status }
      )
    }
    const json = await res.json()
    const posts = (json.data?.children || []).map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      url: `https://www.reddit.com${child.data.permalink}`
    }))

    if (redis) {
      await redis.set(cacheKey, posts, { ex: 300 })
    }

    return NextResponse.json(posts)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
=======
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://www.reddit.com/r/Zen.json", {
    headers: { "User-Agent": "zen-texts-app" },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: res.status }
    );
  }

  const data = await res.json();
  const posts = (data.data?.children || []).map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    author: child.data.author,
    url: `https://www.reddit.com${child.data.permalink}`,
  }));

  return NextResponse.json(posts);
>>>>>>> origin/codex/create-reddit-api-and-components
}
