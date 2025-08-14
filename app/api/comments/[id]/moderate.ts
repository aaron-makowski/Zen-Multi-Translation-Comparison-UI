import { NextResponse } from "next/server"
import { readData, writeData, Comment } from "../route"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { verseId, action } = await req.json()
  if (!verseId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const data = await readData()
  const list = data[verseId]
  if (!list) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const idx = list.findIndex((c: Comment) => c.id === params.id)
  if (idx === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (action === "remove") {
    list.splice(idx, 1)
  } else if (action === "flag") {
    list[idx].flagged = true
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
  await writeData(data)
  return NextResponse.json({ success: true })
}
