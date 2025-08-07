"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { renderMarkdown } from "../lib/markdown"

interface Props {
  verseId: string
  parentId?: string
  onSubmitted?: () => void
}

export function CommentForm({ verseId, parentId, onSubmitted }: Props) {
  const [content, setContent] = useState("")

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content, parentId })
    })
    setContent("")
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment in Markdown"
        className="w-full border rounded p-2 text-sm"
      />
      {content && (
        <div
          className="p-2 border rounded text-sm bg-background"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      )}
      <Button type="submit" size="sm">Post</Button>
    </form>
  )
}
