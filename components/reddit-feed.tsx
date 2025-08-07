"use client"

import { useEffect, useState } from "react"

interface RedditPost {
  id: string
  title: string
  author: string
  url: string
  upvotes: number
}

export function RedditFeed({ subreddit = "Zen" }: { subreddit?: string }) {
  const [posts, setPosts] = useState<RedditPost[]>([])

  useEffect(() => {
    fetch(`/api/reddit?subreddit=${subreddit}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setPosts(data))
      .catch(() => setPosts([]))
  }, [subreddit])

  return (
    <div className="space-y-4">
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
          <div className="text-sm text-muted-foreground">
            by {post.author} • {post.upvotes} upvotes
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <p className="text-sm text-muted-foreground">No posts available.</p>
      )}
    </div>
  )
}
