"use client"

import { useEffect } from "react"

<<<<<<< HEAD
interface ShortcutOptions {
  onNextVerse?: () => void
  onSearch?: () => void
}

export function useShortcuts({ onNextVerse, onSearch }: ShortcutOptions) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        onNextVerse?.()
      }
      if (e.key === "/") {
        const tag = (e.target as HTMLElement).tagName
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          e.preventDefault()
          onSearch?.()
        }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onNextVerse, onSearch])
=======
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
>>>>>>> origin/codex/implement-theme-toggle-with-tailwind
}
