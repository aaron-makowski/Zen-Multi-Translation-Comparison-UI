"use client"

import { Button } from "@/components/ui/button"

interface DownloadButtonProps {
  data: any
}

export function DownloadButton({ data }: DownloadButtonProps) {
  const handleDownload = async () => {
    const verses: {
      book: string
      translator: string
      verseNumber: number
      text: string
    }[] = []

    for (const [book, translators] of Object.entries<any>(data.translations)) {
      for (const [translator, items] of Object.entries<any>(translators)) {
        for (const item of items as any[]) {
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
