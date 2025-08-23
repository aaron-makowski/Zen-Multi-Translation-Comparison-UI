import { NextResponse } from "next/server"
import { db } from "@/lib/db"
<<<<<<< HEAD
import { users, favorites, notes, comments } from "@/lib/schema"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const [userFavorites, userNotes, userComments] = await Promise.all([
    db.query.favorites.findMany({
      where: (favorites, { eq }) => eq(favorites.userId, id),
    }),
    db.query.notes.findMany({
      where: (notes, { eq }) => eq(notes.userId, id),
    }),
    db.query.comments.findMany({
      where: (comments, { eq }) => eq(comments.userId, id),
    }),
  ])
  const data = {
    user,
    favorites: userFavorites,
    notes: userNotes,
    comments: userComments,
  }
  const format = new URL(req.url).searchParams.get("format")
  if (format === "csv") {
    const sections = Object.entries(data).map(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length === 0) return `${key}\n`
        const headers = Object.keys(value[0])
        const rows = value.map((row) =>
          headers.map((h) => JSON.stringify((row as any)[h] ?? "")).join(",")
        )
        return `${key}\n${headers.join(",")}\n${rows.join("\n")}`
      }
      const headers = Object.keys(value)
      const row = headers
        .map((h) => JSON.stringify((value as any)[h] ?? ""))
        .join(",")
      return `${key}\n${headers.join(",")}\n${row}`
    })
    return new Response(sections.join("\n\n"), {
      headers: { "Content-Type": "text/csv" },
    })
  }
  return NextResponse.json(data)
=======
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const format = new URL(req.url).searchParams.get("format") || "json"
  const user = await db.query.users.findFirst({
    where: eq(users.id, params.id),
    with: {
      favorites: true,
      notes: true,
      comments: true,
    },
  })
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  if (format === "csv") {
    let csv = `id,email,username\n${user.id},${user.email},${user.username}\n\n`
    csv += "favorites\nid,bookId\n"
    for (const f of user.favorites) {
      csv += `${f.id},${f.bookId}\n`
    }
    csv += "\nnotes\nid,verseId,content\n"
    for (const n of user.notes) {
      csv += `${n.id},${n.verseId},"${n.content.replace(/"/g, '""')}"\n`
    }
    csv += "\ncomments\nid,verseId,content\n"
    for (const c of user.comments) {
      csv += `${c.id},${c.verseId},"${c.content.replace(/"/g, '""')}"\n`
    }
    return new Response(csv, {
      headers: { "Content-Type": "text/csv" },
    })
  }
  return NextResponse.json(user)
>>>>>>> origin/codex/build-rest-api-for-books-and-translations
}
