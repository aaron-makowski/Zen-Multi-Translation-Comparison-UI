"use client"
import { useEffect, useState } from "react"

interface CommentTimerProps {
  seconds?: number
  onComplete?: () => void
}

export function CommentTimer({ seconds = 5, onComplete }: CommentTimerProps) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [seconds, onComplete])

  return (
    <div className="text-center text-sm text-muted-foreground">
      {remaining > 0 ? `Take a breath… ${remaining}s` : "Mindful moment complete"}
    </div>
  )
}
