"use client"

import { useEffect, useState } from "react"

interface RedditPost {
  id: string
  title: string
  author: string
  url: string
  upvotes: number
}

export default function FeedPage() {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"upvotes" | "title">("upvotes")

  useEffect(() => {
    fetch("/api/reddit")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
  }, [])

  const filtered = posts
    .filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) =>
      sort === "title" ? a.title.localeCompare(b.title) : b.upvotes - a.upvotes,
    )

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Feed</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded px-2 py-1 flex-grow"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as "upvotes" | "title")}
          className="border rounded px-2 py-1"
        >
          <option value="upvotes">Upvotes</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="space-y-4">
        {filtered.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              {post.title}
            </a>
            <div className="text-sm text-muted-foreground">
              by {post.author} • {post.upvotes} upvotes
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No posts available.</p>
        )}
      </div>
    </main>
  )
}
