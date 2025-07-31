"use client"
import { useEffect, useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"

interface Comment {
  id: string
  content: string
  createdAt: string
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
            <div className="text-sm">{c.content}</div>
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
