"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Translation {
  id: string
  text: string
  translator: string
  language: string
}

interface Props {
  verseId: string
}

const PAGE_SIZE = 5

export function TranslationList({ verseId }: Props) {
  const [page, setPage] = useState(1)
  const [translations, setTranslations] = useState<Translation[]>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch(
        `/api/translations?verseId=${verseId}&page=${page}&limit=${PAGE_SIZE}`
      )
      if (!res.ok) return
      const data: Translation[] = await res.json()
      if (cancelled) return
      setTranslations((prev) => [...prev, ...data])
      if (data.length < PAGE_SIZE) {
        setHasMore(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [verseId, page])

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
          <Button onClick={() => setPage((p) => p + 1)} variant="outline" size="sm">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
