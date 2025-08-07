"use client"

import { useEffect, useState } from "react"

interface Post {
  id: string
  title: string
  author: string
  url: string
}

export function RedditFeed() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/reddit")
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <div key={p.id} className="p-4 border rounded">
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
          >
            {p.title}
          </a>
          <div className="text-sm text-muted-foreground">by {p.author}</div>
        </div>
      ))}
      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts found.</p>
      )}
    </div>
  )
}

export default RedditFeed
