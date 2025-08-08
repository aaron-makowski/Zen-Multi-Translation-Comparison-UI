"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Translation {
  id: string
  text: string
  translator: string
  language: string
}

export function TranslationsList({
  verseId,
  initialTranslations,
  pageSize,
}: {
  verseId: string
  initialTranslations: Translation[]
  pageSize: number
}) {
  const [translations, setTranslations] = useState<Translation[]>(initialTranslations)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialTranslations.length === pageSize)

  async function loadMore() {
    setLoading(true)
    const nextPage = page + 1
    const res = await fetch(`/api/translations?verseId=${verseId}&page=${nextPage}&limit=${pageSize}`)
    const data: Translation[] = await res.json()
    setTranslations((prev) => [...prev, ...data])
    setPage(nextPage)
    setHasMore(data.length === pageSize)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {translations.map((translation) => (
        <div key={translation.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <h3 className="font-medium text-lg mb-2">Translation by {translation.translator}</h3>
          <p className="text-gray-800 whitespace-pre-line">{translation.text}</p>
          <p className="text-sm text-gray-500 mt-2">Language: {translation.language}</p>
        </div>
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
