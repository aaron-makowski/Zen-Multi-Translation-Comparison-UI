"use client"

import { useEffect, useState } from "react"

interface CommentTimerProps {
  seconds?: number
  onComplete?: () => void
}

export function CommentTimer({ seconds = 5, onComplete }: CommentTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }
    const id = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, onComplete])

  return (
    <div className="text-sm text-muted-foreground">
      {timeLeft > 0 ? `Pause for ${timeLeft}…` : "You may comment now."}
    </div>
  )
}
