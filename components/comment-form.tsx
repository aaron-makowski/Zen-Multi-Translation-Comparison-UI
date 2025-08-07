"use client"

import { useState, FormEvent } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"

export function CommentForm({
  verseId,
  parentId,
  onSubmitted,
}: {
  verseId: string
  parentId?: string
  onSubmitted?: () => void
}) {
  const [content, setContent] = useState("")

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content, parentId }),
    })
    setContent("")
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment in markdown"
        className="w-full border rounded p-2 text-sm"
      />
      <div className="p-2 border rounded text-sm bg-muted">
        <ReactMarkdown>{content || "Preview"}</ReactMarkdown>
      </div>
      <Button type="submit" size="sm">
        Post
      </Button>
    </form>
  )
}
