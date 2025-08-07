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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reddit")
        let data: unknown

        try {
          data = await res.json()
        } catch {
          setError("Invalid response from server")
          return
        }

        if (!res.ok) {
          setError((data as any)?.error || "Failed to fetch posts")
          return
        }

        if (!Array.isArray(data)) {
          setError("Unexpected response format")
          return
        }

        setPosts(data)
      } catch {
        setError("Failed to load posts")
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error &&
        posts.map((p) => (
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
      {!error && posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts found.</p>
      )}
    </div>
  )
}

export default RedditFeed
