import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verses } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const verse = await db.query.verses.findFirst({
    where: eq(verses.id, params.id),
    with: { translations: true },
  })
  if (!verse) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(verse)
}
