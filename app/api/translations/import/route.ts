import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { loadCachedTranslations, updateTranslationsCache } from "@/lib/verse-cache"

function parseCSV(text: string) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/)
  const headers = headerLine.split(",")
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",")
    const record: Record<string, string> = {}
    headers.forEach((h, i) => {
      record[h] = values[i]
    })
    return record
  })
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file")
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File required" }, { status: 400 })
  }
  const content = await file.text()
  let records: any[]
  try {
    if (file.type === "text/csv" || file.name?.endsWith(".csv")) {
      records = parseCSV(content)
    } else {
      records = JSON.parse(content)
    }
  } catch {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 })
  }
  if (!Array.isArray(records)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
  const values = records.map((r) => ({
    id: crypto.randomUUID(),
    text: r.text,
    translator: r.translator,
    language: r.language || "English",
    verseId: r.verseId,
    updatedAt: new Date(),
  }))
  if (values.some((v) => !v.text || !v.translator || !v.verseId)) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  await db.insert(translations).values(values)

  const cache = await loadCachedTranslations()
  for (const v of values) {
    for (const book of Object.values(cache) as any[]) {
      const verse = book.verses.find((ver: any) => ver.id === Number(v.verseId))
      if (verse) {
        for (const line of verse.lines) {
          line.translations[v.translator] = v.text
        }
      }
    }
  }
  await updateTranslationsCache(cache)
  revalidateTag("verses")
  revalidateTag("translations")

  return NextResponse.json({ imported: values.length })
}

