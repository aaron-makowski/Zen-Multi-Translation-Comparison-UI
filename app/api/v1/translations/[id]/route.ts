import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { translations } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const translation = await db.query.translations.findFirst({
    where: eq(translations.id, params.id),
  })
  if (!translation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(translation)
}
