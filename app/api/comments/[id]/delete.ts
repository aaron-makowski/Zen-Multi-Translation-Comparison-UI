import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
<<<<<<< HEAD
import { v4 as uuidv4 } from "uuid"
import { getUserFromRequest } from "../../../../lib/auth"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
}
=======
import { db } from "@/lib/db"
import { auditLogs } from "@/lib/schema"
>>>>>>> origin/codex/protect-admin-routes-with-middleware

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

async function readData() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
<<<<<<< HEAD
    return JSON.parse(data || "{}") as Record<string, Comment[]>
=======
    return JSON.parse(data || "{}")
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  } catch {
    return {}
  }
}

<<<<<<< HEAD
async function writeData(data: Record<string, Comment[]>) {
=======
async function writeData(data: Record<string, any>) {
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
}

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/codex/protect-admin-routes-with-middleware
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const data = await readData()
<<<<<<< HEAD
  const found = removeComment(data, params.id)
  if (!found) {
=======
  const verseId = removeComment(data, params.id)
  if (!verseId) {
>>>>>>> origin/codex/protect-admin-routes-with-middleware
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  await writeData(data)

<<<<<<< HEAD
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
=======
  const userId = req.headers.get("x-user-id") || undefined
  await db.insert(auditLogs).values({
    id: crypto.randomUUID(),
    action: "delete_comment",
    targetType: "comment",
    targetId: params.id,
    userId,
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  })

  return NextResponse.json({ success: true })
}
