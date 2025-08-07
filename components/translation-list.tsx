"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface Translation {
  id: string
  text: string
  translator: string
  language: string
}

export default function TranslationList({ verseId }: { verseId: string }) {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  async function load() {
    if (loading || !hasMore) return
    setLoading(true)
    const res = await fetch(`/api/translations?verseId=${verseId}&page=${page}`)
    const data: Translation[] = await res.json()
    setTranslations((prev) => [...prev, ...data])
    setHasMore(data.length > 0)
    setPage((prev) => prev + 1)
    setLoading(false)
  }

  useEffect(() => {
    setTranslations([])
    setPage(0)
    setHasMore(true)
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verseId])

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
        <div className="flex justify-center mt-4">
          <Button onClick={load} disabled={loading} size="sm">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  )
}
