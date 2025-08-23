import { promises as fs } from "fs"
import path from "path"

export interface Comment {
  id: string
  content: string
  createdAt: string
  votes: number
  flags?: number
}

const COMMENTS_FILE = path.join(process.cwd(), "data", "comments.json")

export async function readComments() {
  try {
    const data = await fs.readFile(COMMENTS_FILE, "utf8")
    return JSON.parse(data || "{}") as Record<string, Comment[]>
  } catch {
    return {}
  }
}

export async function writeComments(data: Record<string, Comment[]>) {
  await fs.mkdir(path.dirname(COMMENTS_FILE), { recursive: true })
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2))
}

export function voteComment(
  data: Record<string, Comment[]>,
  verseId: string,
  commentId: string,
  delta: number
) {
  const list = data[verseId]
  if (!list) return null
  const comment = list.find((c) => c.id === commentId)
  if (!comment) return null
  comment.votes = (comment.votes ?? 0) + delta
  return comment
}

export function findCommentById(data: Record<string, Comment[]>, id: string) {
  for (const [verseId, list] of Object.entries(data)) {
    const index = list.findIndex((c) => c.id === id)
    if (index !== -1) {
      return { verseId, index, comment: list[index] }
    }
  }
  return null
}
