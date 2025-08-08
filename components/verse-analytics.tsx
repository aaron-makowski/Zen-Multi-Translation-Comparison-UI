"use client"
import { useEffect } from "react"

export function VerseAnalytics({ verseId }: { verseId: string }) {
  useEffect(() => {
    fetch("/api/verse-views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, eventType: "view" })
    })
  }, [verseId])
  return null
}
