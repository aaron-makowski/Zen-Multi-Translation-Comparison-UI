"use client"

import { Button } from "@/components/ui/button"

export interface MultiVerseData {
  /**
   * Verses grouped by book title and translator.
   * {
   *   [bookTitle: string]: {
   *     [translator: string]: Array<{
   *       verseId: string
   *       verseNumber: number
   *       text: string
   *     }>
   *   }
   * }
   */
  translations: {
    [bookTitle: string]: {
      [translator: string]: {
        verseId: string
        verseNumber: number
        text: string
      }[]
    }
  }
  /** Identifiers for verses that could not be found. */
  missing: string[]
}

interface DownloadButtonProps {
  data: MultiVerseData
}

/**
 * Button to download grouped verse translations as a JSON file.
 * Accepts data keyed by book and translator along with a list of missing verse IDs.
 */
export function DownloadButton({ data }: DownloadButtonProps) {
  const handleDownload = async () => {
    const verses: {
      book: string
      translator: string
      verseNumber: number
      text: string
    }[] = []

    for (const [book, translators] of Object.entries(data.translations)) {
      for (const [translator, items] of Object.entries(translators)) {
        for (const item of items) {
          verses.push({
            book,
            translator,
            verseNumber: item.verseNumber,
            text: item.text,
          })
        }
      }
    }

    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verses, format: "json" }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "verses.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return <Button onClick={handleDownload}>Download</Button>
}
