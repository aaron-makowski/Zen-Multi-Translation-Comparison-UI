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
}
