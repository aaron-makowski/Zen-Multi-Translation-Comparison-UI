"use client"

import { useEffect } from "react"

export function VerseViewTracker({ verseId }: { verseId: string }) {
  useEffect(() => {
    fetch("/api/verse-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId }),
    })
  }, [verseId])
  return null
}
