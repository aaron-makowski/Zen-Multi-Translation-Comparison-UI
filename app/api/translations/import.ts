import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { v4 as uuidv4 } from "uuid"

function parseCSV(text: string) {
  const parseLine = (line: string) => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const [headerLine, ...lines] = text.trim().split(/\r?\n/)
  const headers = parseLine(headerLine)

  const records: Record<string, string>[] = []
  for (const line of lines) {
    if (!line) continue
    let values = parseLine(line)
    if (values.length > headers.length) {
      values = values.slice(0, headers.length)
    } else if (values.length < headers.length) {
      while (values.length < headers.length) values.push("")
    }
    if (values.length === headers.length) {
      const record: Record<string, string> = {}
      headers.forEach((h, i) => (record[h] = values[i]))
      records.push(record)
    }
  }
  return records
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }
  const content = await file.text()
  let records: any[] = []
  try {
    if (file.type === "application/json" || file.name.endsWith(".json")) {
      records = JSON.parse(content)
    } else {
      records = parseCSV(content)
    }
  } catch {
    return NextResponse.json({ error: "Invalid file format" }, { status: 400 })
  }
  let count = 0
  for (const r of records) {
    if (!r.text || !r.translator || !r.verseId) continue
    try {
      await db.insert(translations).values({
        id: uuidv4(),
        text: r.text,
        translator: r.translator,
        verseId: r.verseId,
        language: r.language || "English",
        updatedAt: new Date(),
      })
      count++
    } catch {
      // ignore individual insert errors
    }
  }
  return NextResponse.json({ imported: count })
}
