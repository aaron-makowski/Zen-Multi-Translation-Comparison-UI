import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"

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
}
