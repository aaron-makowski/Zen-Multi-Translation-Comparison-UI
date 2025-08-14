import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { v4 as uuid } from "uuid"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const { email, username, password } = await req.json()

  const existingEmail = await db.query.users.findFirst({
    where: eq(users.email, email),
  })
  if (existingEmail) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 },
    )
  }

  const existingUsername = await db.query.users.findFirst({
    where: eq(users.username, username),
  })
  if (existingUsername) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 400 },
    )
  }

  const hashed = await bcrypt.hash(password, 10)
  await db.insert(users).values({
    id: uuid(),
    email,
    username,
    password: hashed,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return NextResponse.json({ ok: true })
}
