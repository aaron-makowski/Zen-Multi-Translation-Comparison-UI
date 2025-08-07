"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Props {
  verseId: string
  userId: string
}

export function BookmarkButton({ verseId, userId }: Props) {
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    fetch(`/api/bookmarks?userId=${userId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const isBookmarked = data.some((b: any) => b.verseId === verseId)
        setBookmarked(isBookmarked)
      })
      .catch(() => setBookmarked(false))
  }, [userId, verseId])

  async function toggle() {
    if (bookmarked) {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verseId }),
      })
      setBookmarked(false)
    } else {
      await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, verseId }),
      })
      setBookmarked(true)
    }
  }

  return (
    <Button variant={bookmarked ? "default" : "outline"} onClick={toggle} className="ml-4">
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  )
}
