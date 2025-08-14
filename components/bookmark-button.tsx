"use client"

import { useEffect, useState } from "react"
import { Bookmark, BookmarkCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
    </Button>
  )
}
