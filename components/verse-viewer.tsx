"use client"

import { useRef, useState } from "react"

interface VerseViewerProps {
  verseId: string
  text: string
  userId: string
}

export default function VerseViewer({ verseId, text, userId }: VerseViewerProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [range, setRange] = useState<
    | { start: number; end: number; text: string }
    | null
  >(null)

  function getOffset(root: Node, node: Node, nodeOffset: number) {
    let offset = 0
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let current = walker.nextNode()
    while (current) {
      if (current === node) {
        return offset + nodeOffset
      }
      offset += current.textContent?.length ?? 0
      current = walker.nextNode()
    }
    return offset
  }

  function handleMouseUp() {
    const sel = window.getSelection()
    const root = textRef.current
    if (!sel || sel.rangeCount === 0 || !root) {
      setRange(null)
      return
    }
    const r = sel.getRangeAt(0)
    if (r.collapsed) {
      setRange(null)
      return
    }
    const start = getOffset(root, r.startContainer, r.startOffset)
    const end = getOffset(root, r.endContainer, r.endOffset)
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
      <p ref={textRef}>{text}</p>
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

