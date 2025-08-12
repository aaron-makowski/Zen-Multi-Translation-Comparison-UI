"use client"

import { useEffect } from "react"

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
}
