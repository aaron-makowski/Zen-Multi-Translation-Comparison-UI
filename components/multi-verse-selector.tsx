"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface VerseInfo {
  id: string
  number: number
}

interface BookInfo {
  id: string
  title: string
  verses: VerseInfo[]
}

interface MultiVerseSelectorProps {
  books: BookInfo[]
  initialSelected: string[]
}

export function MultiVerseSelector({ books, initialSelected }: MultiVerseSelectorProps) {
  const router = useRouter()
  const [bookId, setBookId] = useState<string>(books[0]?.id || "")
  const [verseId, setVerseId] = useState<string>(books[0]?.verses[0]?.id || "")
  const [selected, setSelected] = useState<string[]>(initialSelected)

  useEffect(() => {
    setSelected(initialSelected)
  }, [initialSelected])

  useEffect(() => {
    const currentBook = books.find((b) => b.id === bookId)
    if (currentBook) {
      if (!currentBook.verses.find((v) => v.id === verseId)) {
        setVerseId(currentBook.verses[0]?.id || "")
      }
    }
  }, [bookId, verseId, books])

  const addVerse = () => {
    if (verseId && !selected.includes(verseId)) {
      setSelected((prev) => [...prev, verseId])
    }
  }

  const removeVerse = (id: string) => {
    setSelected((prev) => prev.filter((v) => v !== id))
  }

  const handleCompare = () => {
    if (selected.length > 0) {
      router.push(`/compare/multi?verses=${selected.join(",")}`)
    }
  }

  const getVerseLabel = (id: string) => {
    for (const book of books) {
      const verse = book.verses.find((v) => v.id === id)
      if (verse) {
        return `${book.title} v${verse.number}`
      }
    }
    return id
  }

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-2">
        <Select value={bookId} onValueChange={setBookId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select book" />
          </SelectTrigger>
          <SelectContent>
            {books.map((book) => (
              <SelectItem key={book.id} value={book.id}>
                {book.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={verseId} onValueChange={setVerseId}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Verse" />
          </SelectTrigger>
          <SelectContent>
            {books
              .find((b) => b.id === bookId)?.verses.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  Verse {v.number}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button type="button" onClick={addVerse}>
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-1 mb-2">
        {selected.map((id) => (
          <Badge key={id} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-0">
            <span className="text-xs">{getVerseLabel(id)}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeVerse(id)}
            >
              <X size={10} />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        ))}
      </div>

      <Button onClick={handleCompare} disabled={selected.length === 0}>
        Compare
      </Button>
    </div>
  )
}
