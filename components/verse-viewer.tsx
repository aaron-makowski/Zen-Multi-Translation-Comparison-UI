"use client"

import { useState } from "react"

interface VerseViewerProps {
  verseId: string
  text: string
  userId: string
}

interface Selection {
  start: number
  end: number
  text: string
}

export function VerseViewer({ verseId, text, userId }: VerseViewerProps) {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [note, setNote] = useState("")

  const handleMouseUp = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      setSelection(null)
      return
    }
    const range = sel.getRangeAt(0)
    if (range.collapsed) {
      setSelection(null)
      return
    }
    const start = range.startOffset
    const end = range.endOffset
    setSelection({ start, end, text: sel.toString() })
  }

  const saveHighlight = async (isPublic: boolean, withNote?: boolean) => {
    if (!selection) return
    await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verseId,
        userId,
        start: selection.start,
        end: selection.end,
        note: withNote ? note : undefined,
        isPublic,
      }),
    })
    setSelection(null)
    setNote("")
  }

  const saveNote = async () => {
    if (!selection) return
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content: selection.text, userId }),
    })
    setSelection(null)
  }

  return (
    <div onMouseUp={handleMouseUp} className="select-text">
      <p>{text}</p>
      {selection && (
        <div className="mt-2 flex gap-2 items-center bg-background border p-2 rounded shadow">
          <button 
            onClick={() => saveHighlight(true)}
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
          >
            Highlight Public
          </button>
          <button 
            onClick={() => saveHighlight(false)}
            className="text-sm bg-gray-500 text-white px-2 py-1 rounded"
          >
            Highlight Private
          </button>
          <input
            type="text"
            placeholder="Add note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-1 text-sm rounded"
          />
          <button 
            onClick={() => saveHighlight(false, true)}
            className="text-sm bg-green-500 text-white px-2 py-1 rounded"
          >
            Save with Note
          </button>
          <button 
            onClick={saveNote}
            className="text-sm bg-purple-500 text-white px-2 py-1 rounded"
          >
            Save as Note
          </button>
        </div>
      )}
    </div>
  )
}

export default VerseViewer