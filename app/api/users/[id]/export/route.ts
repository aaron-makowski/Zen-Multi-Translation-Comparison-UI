import { NextResponse } from "next/server"
import { db } from "@/lib/db"
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
}
