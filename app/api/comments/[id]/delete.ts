import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { getUserFromRequest } from "../../../../lib/auth"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

async function readData() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    return JSON.parse(data || "{}") as Record<string, Comment[]>
  } catch {
    return {}
  }
}

async function writeData(data: Record<string, Comment[]>) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
}

export function removeComment(data: Record<string, Comment[]>, commentId: string) {
  for (const verseId of Object.keys(data)) {
    const index = data[verseId].findIndex((c) => c.id === commentId)
    if (index !== -1) {
      data[verseId].splice(index, 1)
      if (data[verseId].length === 0) delete data[verseId]
      return true
    }
  }
  return false
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const data = await readData()
  const found = removeComment(data, params.id)
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  await writeData(data)

  const user = getUserFromRequest(req)
  const { db } = await import("../../../../lib/db")
  const { auditLogs } = await import("../../../../lib/schema")
  await db.insert(auditLogs).values({
    id: uuidv4(),
    userId: user?.id ?? null,
    action: "comment_deleted",
    targetType: "comment",
    targetId: params.id,
    createdAt: new Date(),
  })

  return NextResponse.json({ success: true })
}
