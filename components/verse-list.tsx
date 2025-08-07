"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Verse {
  id: string
  number: number
}

export default function VerseList({ bookId }: { bookId: string }) {
  const [verses, setVerses] = useState<Verse[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function load() {
    if (loading || !hasMore) return
    setLoading(true)
    const res = await fetch(`/api/verses?bookId=${bookId}&page=${page}`)
    const data: Verse[] = await res.json()
    setVerses((prev) => [...prev, ...data])
    setHasMore(data.length > 0)
    setPage((prev) => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    setVerses([])
    setPage(0)
    setHasMore(true)
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId])

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
        <div className="flex justify-center mt-4">
          <Button onClick={load} disabled={loading} size="sm">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
