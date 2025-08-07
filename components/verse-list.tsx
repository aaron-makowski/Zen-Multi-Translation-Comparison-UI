"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Verse {
  id: string
  number: number
}

interface Props {
  bookId: string
}

const PAGE_SIZE = 10

export function VerseList({ bookId }: Props) {
  const [page, setPage] = useState(1)
  const [verses, setVerses] = useState<Verse[]>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch(`/api/verses?bookId=${bookId}&page=${page}&limit=${PAGE_SIZE}`)
      if (!res.ok) return
      const data: Verse[] = await res.json()
      if (cancelled) return
      setVerses((prev) => [...prev, ...data])
      if (data.length < PAGE_SIZE) {
        setHasMore(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [bookId, page])

  return (
    <div className="space-y-3 mb-8">
      {verses.map((verse) => (
        <Card key={verse.id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">Verse {verse.number}</span>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/books/${bookId}/verses/${verse.id}`}>View Translations</Link>
            </Button>
          </div>
        </Card>
      ))}
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={() => setPage((p) => p + 1)} variant="outline" size="sm">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
