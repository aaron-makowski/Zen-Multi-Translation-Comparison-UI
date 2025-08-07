"use client"

import { useState } from "react"

interface VerseViewerProps {
  verseId: string
  text: string
}

interface Selection {
  start: number
  end: number
}

export function VerseViewer({ verseId, text }: VerseViewerProps) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [note, setNote] = useState("")
  const [showToolbar, setShowToolbar] = useState(false)

  const handleMouseUp = () => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed) {
      setShowToolbar(false)
      return
    }
    const start = Math.min(sel.anchorOffset, sel.focusOffset)
    const end = Math.max(sel.anchorOffset, sel.focusOffset)
    setSelection({ start, end })
    setShowToolbar(true)
  }

  const saveHighlight = async (withNote: boolean) => {
    if (!selection) return
    await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verseId,
        start: selection.start,
        end: selection.end,
        note: withNote ? note : undefined,
      }),
    })
    setSelection(null)
    setNote("")
    setShowToolbar(false)
  }

  return (
    <div onMouseUp={handleMouseUp} className="relative">
      <p>{text}</p>
      {showToolbar && (
        <div className="absolute bg-background border p-2 rounded shadow flex gap-2">
          <button onClick={() => saveHighlight(false)} className="text-sm">
            Highlight
          </button>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="border p-1 text-sm"
            />
            <button onClick={() => saveHighlight(true)} className="text-sm">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default VerseViewer
