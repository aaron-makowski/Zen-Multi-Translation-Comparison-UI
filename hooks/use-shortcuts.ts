"use client"

import { useEffect } from "react"

interface ShortcutHandlers {
  onNextVerse?: () => void
  onPrevVerse?: () => void
  onSearch?: () => void
}

export function useShortcuts({ onNextVerse, onPrevVerse, onSearch }: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        onNextVerse?.()
      }
      if (event.key === "ArrowLeft") {
        onPrevVerse?.()
      }
      if (event.key === "/" || (event.ctrlKey && event.key.toLowerCase() === "f")) {
        event.preventDefault()
        onSearch?.()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onNextVerse, onPrevVerse, onSearch])
}
