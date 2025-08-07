"use client"
import { useEffect, useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { formatKarmaBadge } from "@/lib/karma"

interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
  user: {
    name: string
    karma: number
  }
}

export function CommentSection({ verseId }: { verseId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [content, setContent] = useState("")

  async function load() {
    const res = await fetch(`/api/comments?verseId=${verseId}`)
    if (res.ok) setComments(await res.json())
  }

  useEffect(() => {
    load()
  }, [verseId])

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content })
    })
    setContent("")
    load()
  }

  async function vote(id: string, delta: number) {
    await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, commentId: id, delta })
    })
    load()
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border rounded p-2 text-sm"
        />
        <Button type="submit" size="sm">Post</Button>
      </form>
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-muted rounded">
            <div className="flex items-center justify-between">
              <div className="text-sm flex-1">
                <span className="font-medium">{c.user.name}</span>
                <span className="ml-1 text-xs text-muted-foreground">
                  {formatKarmaBadge(c.user.karma)}
                </span>
                : {c.content}
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  aria-label="upvote"
                  className="text-xs"
                  onClick={() => vote(c.id, 1)}
                >
                  ▲
                </button>
                <span className="text-xs w-4 text-center">{c.votes}</span>
                <button
                  aria-label="downvote"
                  className="text-xs"
                  onClick={() => vote(c.id, -1)}
                >
                  ▼
                </button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
