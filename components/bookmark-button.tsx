"use client"

import { useEffect, useState } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

<<<<<<< HEAD
interface BookmarkButtonProps {
  verseId: string
}

export function BookmarkButton({ verseId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    let ignore = false
    fetch("/api/bookmarks")
      .then((res) => res.json())
      .then((data: string[]) => {
        if (!ignore) {
          setBookmarked(data.includes(verseId))
        }
      })
    return () => {
      ignore = true
    }
  }, [verseId])

  const toggle = async () => {
    if (bookmarked) {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseId }),
      })
      setBookmarked(false)
    } else {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verseId }),
      })
      setBookmarked(true)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}>
=======
export function BookmarkButton({
  bookId,
  initial = false,
}: {
  bookId: string
  initial?: boolean
}) {
  const [bookmarked, setBookmarked] = useState(initial)
  useEffect(() => setBookmarked(initial), [initial])

  async function toggle() {
    const method = bookmarked ? "DELETE" : "POST"
    const res = await fetch("/api/bookmarks", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId }),
    })
    if (res.ok) setBookmarked(!bookmarked)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="bookmark">
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  )
}
