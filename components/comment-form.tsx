"use client"
<<<<<<< HEAD
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
=======

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
>>>>>>> origin/codex/extend-api-for-nested-comments-support

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
      body: JSON.stringify({ verseId, content, parentId }),
    })
    setContent("")
    setPreview("")
=======
      body: JSON.stringify({ verseId, content, parentId })
    })
    setContent("")
>>>>>>> origin/codex/extend-api-for-nested-comments-support
    onSubmitted?.()
  }

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/codex/extend-api-for-nested-comments-support
    </form>
  )
}
