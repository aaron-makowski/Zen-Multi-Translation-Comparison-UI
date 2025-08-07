"use client"

import { useState } from "react"

interface VerseViewerProps {
  verseId: string
  text: string
  userId: string
}

export default function VerseViewer({ verseId, text, userId }: VerseViewerProps) {
  const [range, setRange] = useState<
    | { start: number; end: number; text: string }
    | null
  >(null)

  function handleMouseUp() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      setRange(null)
      return
    }
    const r = sel.getRangeAt(0)
    if (r.collapsed) {
      setRange(null)
      return
    }
    const start = r.startOffset
    const end = r.endOffset
    setRange({ start, end, text: sel.toString() })
  }

  async function saveHighlight(isPublic: boolean) {
    if (!range) return
    await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verseId,
        start: range.start,
        end: range.end,
        isPublic,
        userId,
      }),
    })
    setRange(null)
  }

  async function saveNote() {
    if (!range) return
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content: range.text, userId }),
    })
    setRange(null)
  }

  return (
    <div onMouseUp={handleMouseUp} className="select-text">
      <p>{text}</p>
      {range && (
        <div className="mt-2 flex gap-2">
          <button onClick={() => saveHighlight(true)}>Highlight Public</button>
          <button onClick={() => saveHighlight(false)}>
            Highlight Private
          </button>
          <button onClick={saveNote}>Save Note</button>
        </div>
      )}
    </div>
  )
}

