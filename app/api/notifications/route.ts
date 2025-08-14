import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

import { getNotifications } from "../../../lib/notifications"
import { db } from "../../../lib/db"
import { notificationPreferences } from "../../../lib/schema"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  const notifs = await getNotifications(userId)
  return NextResponse.json(notifs)
}

export async function POST(req: Request) {
  const { userId, email, push, pushEndpoint } = await req.json()
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  await db
    .insert(notificationPreferences)
    .values({
      id: randomUUID(),
      userId,
      email: email ?? true,
      push: push ?? true,
      pushEndpoint,
    })
    .onConflictDoUpdate({
      target: notificationPreferences.userId,
      set: { email, push, pushEndpoint },
    })
  return NextResponse.json({ ok: true })
}

