"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VerseSelectorProps {
  books: {
    id: string
    title: string
    pdfPath?: string | null
    verses: { id: string; number: number }[]
  }[]
  initialPairs?: { bookId: string; verseId: string }[]
}

export function VerseSelector({ books, initialPairs = [{ bookId: books[0]?.id ?? "", verseId: "" }] }: VerseSelectorProps) {
  const router = useRouter()
  const [pairs, setPairs] = useState(initialPairs)

  const updatePair = (index: number, field: "bookId" | "verseId", value: string) => {
    setPairs((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      if (field === "bookId") {
        next[index].verseId = ""
      }
      return next
    })
  }

  const addPair = () => setPairs([...pairs, { bookId: books[0]?.id ?? "", verseId: "" }])

  const removePair = (index: number) =>
    setPairs((prev) => prev.filter((_, i) => i !== index))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = pairs
      .filter((p) => p.bookId && p.verseId)
      .map((p) => `${p.bookId}:${p.verseId}`)
      .join(",")
    router.push(`/compare/multi?pairs=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {pairs.map((pair, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Select value={pair.bookId} onValueChange={(v) => updatePair(idx, "bookId", v)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Book" />
            </SelectTrigger>
            <SelectContent>
              {books.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={pair.verseId} onValueChange={(v) => updatePair(idx, "verseId", v)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Verse" />
            </SelectTrigger>
            <SelectContent>
              {books
                .find((b) => b.id === pair.bookId)?.verses.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            onClick={() => removePair(idx)}
            className="h-9 px-2"
            aria-label={`Remove verse ${idx + 1}`}
          >
            Remove
          </Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={addPair}>
          Add Verse
        </Button>
        <Button type="submit">Compare</Button>
      </div>
    </form>
  )
}
