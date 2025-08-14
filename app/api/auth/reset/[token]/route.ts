import { NextResponse } from "next/server"
<<<<<<< HEAD
import { db } from "@/lib/db"
import { sessions, users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  const { password } = await req.json()
  const token = params.token
  const record = await db.query.sessions.findFirst({
    where: eq(sessions.id, token),
  })
  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  await db
    .update(users)
    .set({ password: hashed, updatedAt: new Date() })
    .where(eq(users.id, record.userId))
  await db.delete(sessions).where(eq(sessions.id, token))
=======
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { password } = await req.json()
  const session = await prisma.session.findUnique({ where: { sessionToken: params.token } })
  if (!session || session.expires < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
  }
  const hashed = await hash(password, 10)
  await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } })
  await prisma.session.delete({ where: { sessionToken: params.token } })
>>>>>>> origin/codex/implement-auth-routes-and-features
  return NextResponse.json({ ok: true })
}
