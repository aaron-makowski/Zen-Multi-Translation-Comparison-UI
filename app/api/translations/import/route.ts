import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"

<<<<<<< HEAD
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
  return NextResponse.json({ imported: values.length })
=======
export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file")
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }
  try {
    const text = await (file as File).text()
    const data = JSON.parse(text)
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }
    for (const item of data) {
      if (!item.text || !item.translator || !item.verseId) continue
      await db.insert(translations).values({
        id: crypto.randomUUID(),
        text: item.text,
        translator: item.translator,
        language: item.language || "English",
        verseId: item.verseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return NextResponse.json({ success: true, count: data.length })
  } catch (e) {
    return NextResponse.json({ error: "Failed to import" }, { status: 500 })
  }
>>>>>>> origin/codex/build-rest-api-for-books-and-translations
}
