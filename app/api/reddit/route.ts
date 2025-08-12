import { NextResponse } from "next/server"

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
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    )
  }
}
