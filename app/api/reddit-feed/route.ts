import { NextResponse } from "next/server";

export interface RedditPost {
  id: string;
  title: string;
  url: string;
}

export async function GET() {
  try {
    const res = await fetch("https://www.reddit.com/r/zen.json");
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Reddit feed" },
        { status: res.status }
      );
    }

    let data: any;
    try {
      data = await res.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from Reddit" },
        { status: 502 }
      );
    }

    const children = data?.data?.children;
    if (!Array.isArray(children)) {
      return NextResponse.json(
        { error: "Unexpected Reddit response structure" },
        { status: 502 }
      );
    }

    try {
      const posts: RedditPost[] = [];
      for (const c of children) {
        const { id, title, url } = c?.data || {};
        if (!id || !title || !url) {
          throw new Error("Missing fields");
        }
        posts.push({ id, title, url });
      }
      return NextResponse.json(posts);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Reddit posts" },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to reach Reddit" },
      { status: 502 }
    );
  }
}
