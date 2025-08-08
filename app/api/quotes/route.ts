import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface Quote {
  text: string
  author?: string
}

const QUOTES_FILE = path.join(process.cwd(), "data", "quotes.json")

export const revalidate = 86400 // revalidate once per day

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

async function fetchFromReddit(): Promise<Quote | null> {
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

async function fetchFromStatic(): Promise<Quote | null> {
  try {
    const data = await fs.readFile(QUOTES_FILE, "utf8")
    const quotes = JSON.parse(data)
    const index = getDayOfYear(new Date()) % quotes.length
    return quotes[index]
  } catch {
    return null
  }
}

async function getLocalQuote(): Promise<Quote | null> {
  try {
    const raw = await fs.readFile(QUOTES_FILE, "utf8")
    const quotes: Quote[] = JSON.parse(raw)
    if (!Array.isArray(quotes) || quotes.length === 0) return null
    return quotes[Math.floor(Math.random() * quotes.length)]
  } catch {
    return null
  }
}

export async function GET() {
  const quote =
    (await fetchFromReddit()) ||
    (await fetchFromStatic()) ||
    (await getLocalQuote()) ||
    { text: "Be present.", author: "Unknown" }
  return NextResponse.json(quote)
}
