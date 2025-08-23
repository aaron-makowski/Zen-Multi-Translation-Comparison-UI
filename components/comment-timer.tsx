"use client"

import { useEffect, useState } from "react"

interface CommentTimerProps {
  seconds?: number
  onComplete?: () => void
}

export function CommentTimer({ seconds = 5, onComplete }: CommentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    setTimeLeft(seconds)
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }
    const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, onComplete, seconds])

  return (
    <div className="text-center text-sm text-muted-foreground">
      {timeLeft > 0 ? `Take a breath… ${timeLeft}s` : "Mindful moment complete"}
    </div>
  )
}
