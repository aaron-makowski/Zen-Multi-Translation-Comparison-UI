"use client"

import { useEffect, useState } from "react"

export function CommentTimer({
  initialSeconds = 10,
  onExpire
}: {
  initialSeconds?: number
  onExpire?: () => void
}) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) {
      onExpire?.()
      return
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [seconds, onExpire])

  return (
    <div className="text-sm text-muted-foreground">
      {seconds > 0
        ? `Take a breath... ${seconds}s`
        : "You may comment now."}
    </div>
  )
}
