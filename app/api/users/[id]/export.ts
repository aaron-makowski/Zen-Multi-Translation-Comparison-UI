import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"

function toCSV(data: Record<string, any>) {
  const keys = Object.keys(data)
  const values = keys.map((k) => JSON.stringify(data[k] ?? ""))
  return keys.join(",") + "\n" + values.join(",")
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const format = new URL(req.url).searchParams.get("format") || "json"
  try {
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, id),
    })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    if (format === "csv") {
      return new NextResponse(toCSV(user), {
        headers: { "Content-Type": "text/csv" },
      })
    }
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 }
    )
  }
}
