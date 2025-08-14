"use client"
import { useEffect, useState } from "react"
import { CommentForm } from "./comment-form"

interface Comment {
  id: string
  username?: string
  karma?: number
  content: string
  createdAt: string
  updatedAt: string
  votes: number
  parentId?: string
  flagged?: boolean
  removed?: boolean
}

export function CommentSection({ verseId, userId }: { verseId: string; userId: string }) {
  const [comments, setComments] = useState<Comment[]>([])

  async function load() {
    const res = await fetch(`/api/comments?verseId=${verseId}`)
    if (res.ok) setComments(await res.json())
  }

  useEffect(() => {
    load()
  }, [verseId])

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
      <CommentForm verseId={verseId} onSubmitted={load} />
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-muted rounded">
            <div className="flex items-center justify-between">
              <div
                className="text-sm flex-1"
                dangerouslySetInnerHTML={{ __html: c.content }}
              />
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
          )
        })}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
