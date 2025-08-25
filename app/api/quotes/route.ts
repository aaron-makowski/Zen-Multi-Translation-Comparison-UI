import { NextResponse } from "next/server"
import quotes from "../../../data/quotes.json"

const SUBREDDIT = process.env.QUOTES_SUBREDDIT || "quotes"

interface Quote {
  text: string
  author: string
}

function dayIndex(length: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay) % length
}

async function fetchRedditQuote(): Promise<Quote> {
  const res = await fetch(`https://www.reddit.com/r/${SUBREDDIT}.json`, {
    headers: { "User-Agent": "ZenMultiTranslation/1.0" }
  })
  if (!res.ok) {
    throw new Error("Reddit fetch failed")
  }
  const json = await res.json()
  const posts = (json.data?.children || []) as any[]
  if (!posts.length) throw new Error("No posts")
  const post = posts[dayIndex(posts.length)].data
  return { text: post.title, author: post.author }
}

export async function GET() {
  try {
    const quote = await fetchRedditQuote()
    return NextResponse.json(quote)
  } catch (e) {
    const fallback = (quotes as Quote[])[dayIndex((quotes as Quote[]).length)]
    return NextResponse.json(fallback)
  }
}
