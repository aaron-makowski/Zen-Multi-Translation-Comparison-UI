import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const QUOTES_FILE = path.join(process.cwd(), "data", "quotes.json")

async function fetchFromReddit() {
  try {
    const res = await fetch(
      "https://www.reddit.com/r/quotes/top.json?limit=50",
      { next: { revalidate: 86400 } }
    )
    const data = await res.json()
    const posts = data?.data?.children
    if (!Array.isArray(posts) || posts.length === 0) return null
    const day = new Date()
    const index = getDayOfYear(day) % posts.length
    const post = posts[index].data
    return {
      text: post.title,
      author: post.author,
    }
  } catch {
    return null
  }
}

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

async function fetchFromStatic() {
  try {
    const data = await fs.readFile(QUOTES_FILE, "utf8")
    const quotes = JSON.parse(data)
    const index = getDayOfYear(new Date()) % quotes.length
    return quotes[index]
  } catch {
    return null
  }
}

export async function GET() {
  const quote =
    (await fetchFromReddit()) ||
    (await fetchFromStatic()) || { text: "Be present.", author: "Unknown" }
  return NextResponse.json(quote)
}
