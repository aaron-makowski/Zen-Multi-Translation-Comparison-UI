import { NextResponse } from "next/server"
import { db } from "@/lib/db"
<<<<<<< HEAD
import { userFollows } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

interface RouteParams {
  params: { userId: string }
}

export async function POST(req: Request, { params }: RouteParams) {
=======
import { userFollows, users } from "@/lib/schema"
import { and, eq } from "drizzle-orm"

export async function POST(
  req: Request,
  { params }: { params: { userId: string } },
) {
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

<<<<<<< HEAD
  await db
    .insert(userFollows)
    .values({
      followerId,
      followingId: params.userId,
    })
    .onConflictDoNothing()
=======
  if (followerId === params.userId) {
    return NextResponse.json(
      { error: "Cannot follow yourself" },
      { status: 400 },
    )
  }

  const [follower, following] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, followerId) }),
    db.query.users.findFirst({ where: eq(users.id, params.userId) }),
  ])

  if (!follower || !following) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const existingFollow = await db.query.userFollows.findFirst({
    where: and(
      eq(userFollows.followerId, followerId),
      eq(userFollows.followingId, params.userId),
    ),
  })

  if (existingFollow) {
    return NextResponse.json(
      { error: "Already following" },
      { status: 409 },
    )
  }

  await db.insert(userFollows).values({
    followerId,
    followingId: params.userId,
  })
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature

  return NextResponse.json({ success: true })
}

<<<<<<< HEAD
export async function DELETE(req: Request, { params }: RouteParams) {
=======
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } },
) {
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
  const { followerId } = await req.json()
  if (!followerId) {
    return NextResponse.json({ error: "Missing followerId" }, { status: 400 })
  }

  await db
    .delete(userFollows)
    .where(
      and(
        eq(userFollows.followerId, followerId),
<<<<<<< HEAD
        eq(userFollows.followingId, params.userId)
      )
=======
        eq(userFollows.followingId, params.userId),
      ),
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
    )

  return NextResponse.json({ success: true })
}
