"use client"

import { useEffect, useState } from "react"

<<<<<<< HEAD
interface RedditPost {
=======
interface Post {
>>>>>>> origin/codex/create-reddit-api-and-components
  id: string
  title: string
  author: string
  url: string
}

export function RedditFeed() {
<<<<<<< HEAD
  const [posts, setPosts] = useState<RedditPost[]>([])

  useEffect(() => {
    fetch("/api/reddit")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
=======
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
>>>>>>> origin/codex/create-reddit-api-and-components
  }, [])

  return (
    <div className="space-y-4">
<<<<<<< HEAD
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            {post.title}
          </a>
          <div className="text-sm text-muted-foreground">by {post.author}</div>
        </div>
      ))}
      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts available.</p>
=======
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
>>>>>>> origin/codex/create-reddit-api-and-components
      )}
    </div>
  )
}
<<<<<<< HEAD
=======

export default RedditFeed
>>>>>>> origin/codex/create-reddit-api-and-components
