import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { db } from "@/lib/db"
import { auditLogs } from "@/lib/schema"

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

async function readData() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    return JSON.parse(data || "{}")
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, any>) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
}

function removeComment(data: Record<string, any>, commentId: string) {
  for (const verseId of Object.keys(data)) {
    const list = data[verseId]
    const idx = list.findIndex((c: any) => c.id === commentId)
    if (idx !== -1) {
      list.splice(idx, 1)
      return verseId
    }
  }
  return null
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const data = await readData()
  const verseId = removeComment(data, params.id)
  if (!verseId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  await writeData(data)

  const userId = req.headers.get("x-user-id") || undefined
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    action: "delete_comment",
    targetType: "comment",
    targetId: params.id,
    userId,
  })

  return NextResponse.json({ success: true })
}
