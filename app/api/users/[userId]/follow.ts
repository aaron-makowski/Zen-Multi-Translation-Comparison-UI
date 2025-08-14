import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { userFollows } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

interface RouteParams {
  params: { userId: string }
}

export async function POST(req: Request, { params }: RouteParams) {
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

  await db
    .insert(userFollows)
    .values({
      followerId,
      followingId: params.userId,
    })
    .onConflictDoNothing()

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

  await db
    .delete(userFollows)
    .where(
      and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, params.userId)
      )
    )

  return NextResponse.json({ success: true })
}
