import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface Quote {
  text: string
  author?: string
}

const QUOTES_FILE = path.join(process.cwd(), "data", "quotes.json")

export const revalidate = 86400 // revalidate once per day

async function getLocalQuote(): Promise<Quote> {
  try {
    const raw = await fs.readFile(QUOTES_FILE, "utf8")
    const quotes: Quote[] = JSON.parse(raw)
    return quotes[Math.floor(Math.random() * quotes.length)]
  } catch {
    return { text: "Be present. The rest will follow." }
  }
}

export async function GET() {
  try {
    const res = await fetch(
      "https://www.reddit.com/r/quotes/top.json?limit=50&t=day",
      { next: { revalidate: 86400 } }
    )
    const json = await res.json()
    const posts = json?.data?.children
    if (Array.isArray(posts) && posts.length) {
      const post = posts[Math.floor(Math.random() * posts.length)].data
      if (post?.title) {
        return NextResponse.json({ text: post.title })
      }
    }
  } catch {
    // ignore errors and fall back to local quotes
  }
  const quote = await getLocalQuote()
  return NextResponse.json(quote)
}
