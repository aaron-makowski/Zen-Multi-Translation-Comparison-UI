import { NextResponse } from 'next/server'

interface RedditChild {
  data: {
    title: string
    permalink: string
  }
}

interface RedditResponse {
  data: {
    children: RedditChild[]
  }
}

export async function GET() {
  const res = await fetch('https://www.reddit.com/r/zen/top.json?limit=5')
  const json: RedditResponse = await res.json()
  const posts = json.data.children.map((c) => ({
    title: c.data.title,
    url: `https://www.reddit.com${c.data.permalink}`,
  }))
  return NextResponse.json(posts)
}
