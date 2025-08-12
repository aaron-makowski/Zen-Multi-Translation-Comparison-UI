"use client"
import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { marked } from "marked"

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
  const [preview, setPreview] = useState("")

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content, parentId }),
    })
    setContent("")
    setPreview("")
    onSubmitted?.()
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 mb-4">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          setPreview(marked.parse(e.target.value))
        }}
        placeholder="Write a comment in Markdown"
        className="border rounded p-2 text-sm"
      />
      {content && (
        <div
          className="p-2 border rounded text-sm bg-muted"
          dangerouslySetInnerHTML={{ __html: preview }}
        />
      )}
      <div>
        <Button type="submit" size="sm">
          Post
        </Button>
      </div>
    </form>
  )
}
