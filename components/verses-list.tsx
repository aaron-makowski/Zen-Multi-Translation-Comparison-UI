"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Verse {
  id: string
  number: number
}

export function VersesList({
  bookId,
  initialVerses,
  pageSize,
}: {
  bookId: string
  initialVerses: Verse[]
  pageSize: number
}) {
  const [verses, setVerses] = useState<Verse[]>(initialVerses)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialVerses.length === pageSize)

  async function loadMore() {
    setLoading(true)
    const nextPage = page + 1
    const res = await fetch(`/api/verses?bookId=${bookId}&page=${nextPage}&limit=${pageSize}`)
    const data: Verse[] = await res.json()
    setVerses((prev) => [...prev, ...data])
    setPage(nextPage)
    setHasMore(data.length === pageSize)
    setLoading(false)
  }

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
          <Button onClick={loadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
