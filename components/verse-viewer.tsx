"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface VerseViewerProps {
  verseId: string
  text: string
  userId: string
}

export function VerseViewer({ verseId, text, userId }: VerseViewerProps) {
  const verseRef = useRef<HTMLParagraphElement>(null)
  const [selection, setSelection] = useState<{ start: number; end: number; text: string } | null>(null)
  const [note, setNote] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  function handleMouseUp() {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && verseRef.current) {
      const range = sel.getRangeAt(0)
      if (!range.collapsed && verseRef.current.contains(range.commonAncestorContainer)) {
        // Measure text length from the start of the verse element to the
        // selection boundaries. This accounts for selections that span across
        // multiple nodes or include rich markup. It relies on the DOM's
        // text representation, so offsets may be off if the displayed text
        // differs from the `text` prop (e.g. hidden elements or Unicode
        // normalization).
        const preRange = document.createRange()
        preRange.selectNodeContents(verseRef.current)
        preRange.setEnd(range.startContainer, range.startOffset)
        const start = preRange.toString().length

        const postRange = document.createRange()
        postRange.selectNodeContents(verseRef.current)
        postRange.setEnd(range.endContainer, range.endOffset)
        const end = postRange.toString().length

        setSelection({ start, end, text: sel.toString() })
      } else {
        setSelection(null)
      }
    }
  }

  async function saveHighlight() {
    if (!selection) return
    await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        verseId,
        userId,
        start: selection.start,
        end: selection.end,
        content: note,
        isPublic,
      }),
    })
    setSelection(null)
    setNote("")
    setIsPublic(false)
  }

  return (
    <div>
      <p
        ref={verseRef}
        onMouseUp={handleMouseUp}
        className="cursor-text select-text"
      >
        {text}
      </p>
      {selection && (
        <div className="mt-2 space-y-2">
          <Textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Switch id="highlight-public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="highlight-public">Public</Label>
          </div>
          <Button size="sm" onClick={saveHighlight}>
            Save Highlight
          </Button>
        </div>
      )}
    </div>
  )
}
