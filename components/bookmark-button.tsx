"use client"

import { useEffect, useState } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  )
}
