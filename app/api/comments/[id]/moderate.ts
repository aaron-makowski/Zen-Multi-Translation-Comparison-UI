import { NextResponse } from "next/server"
import { readData, writeData, Comment } from "../route"

function collectDescendants(list: Comment[], id: string, acc: Set<string>) {
  for (const c of list) {
    if (c.parentId === id) {
      acc.add(c.id)
      collectDescendants(list, c.id, acc)
    }
  }
}

export function removeWithDescendants(list: Comment[], id: string) {
  const target = list.find((c) => c.id === id)
  if (!target) return { removed: null, list }
  const ids = new Set<string>([id])
  collectDescendants(list, id, ids)
  return { removed: target, list: list.filter((c) => !ids.has(c.id)) }
}

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
        const { removed, list: updated } = removeWithDescendants(list, params.id)
        data[verseId] = updated
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
