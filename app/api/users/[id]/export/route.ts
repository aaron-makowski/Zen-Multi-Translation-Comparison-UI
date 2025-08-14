import { NextResponse } from "next/server"
import { db } from "@/lib/db"
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
}
