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
  try {
    const res = await fetch('https://www.reddit.com/r/zen/top.json?limit=5')
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Reddit feed' },
        { status: res.status }
      )
    }

    const json: RedditResponse = await res.json()
    const posts = json.data.children.map((c) => ({
      title: c.data.title,
      url: `https://www.reddit.com${c.data.permalink}`,
    }))
    return NextResponse.json(posts)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch Reddit feed' }, { status: 500 })
  }
}
