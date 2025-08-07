import { NextResponse } from "next/server"
import { readData, writeData, Comment } from "../route"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (req.headers.get("x-admin") !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { action } = await req.json()
  if (action !== "remove" && action !== "flag") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }

  const data = await readData()
  let found: Comment | null = null

  for (const verseId of Object.keys(data)) {
    const list = data[verseId]
    const idx = list.findIndex((c) => c.id === params.id)
    if (idx !== -1) {
      if (action === "remove") {
        const removed = list.splice(idx, 1)[0]
        data[verseId] = list.filter((c) => c.parentId !== params.id)
        found = removed
      } else {
        list[idx].flagged = true
        found = list[idx]
      }
      break
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await writeData(data)
  return NextResponse.json(found)
}
