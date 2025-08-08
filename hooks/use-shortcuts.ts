import { useEffect } from "react"

/**
 * Hook to bind keyboard shortcuts for navigation actions.
 *
 * @param handlers Object containing callback handlers for shortcuts.
 *  - onNextVerse: triggered with ArrowRight
 *  - onPrevVerse: triggered with ArrowLeft
 *  - onSearch: triggered with '/' key or Cmd/Ctrl+F
 */
export interface ShortcutHandlers {
  onNextVerse?: () => void
  onPrevVerse?: () => void
  onSearch?: () => void
}

export function useShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const { onNextVerse, onPrevVerse, onSearch } = handlers
      switch (event.key) {
        case "ArrowRight":
          onNextVerse?.()
          break
        case "ArrowLeft":
          onPrevVerse?.()
          break
        case "/":
          // prevent browser quick find
          event.preventDefault()
          onSearch?.()
          break
        case "f":
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault()
            onSearch?.()
          }
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handlers])
}

export default useShortcuts
