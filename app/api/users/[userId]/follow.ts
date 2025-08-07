import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { follows } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { v4 as uuidv4 } from "uuid"

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

  await db.insert(follows).values({
    id: uuidv4(),
    followerId,
    followingId: params.userId,
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

  await db
    .delete(follows)
    .where(
      and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, params.userId)
      )
    )

  return NextResponse.json({ success: true })
}

