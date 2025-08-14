<<<<<<< HEAD
import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
=======
import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
>>>>>>> origin/codex/implement-auth-routes-and-features

const prisma = new PrismaClient()

export async function POST(req: Request) {
<<<<<<< HEAD
  const { email, username, password } = await req.json()
  if (!email || !username || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  const hashed = await bcrypt.hash(password, 10)
  if (existing) {
    if (existing.password) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }
    await prisma.user.update({
      where: { id: existing.id },
      data: { username, password: hashed },
    })
    return NextResponse.json({ ok: true })
  }
  await prisma.user.create({
    data: { email, username, password: hashed },
  })
  return NextResponse.json({ ok: true })
=======
  const { email, password, username } = await req.json()
  if (!email || !password || !username) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 })
  }
  const hashed = await hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      name: username,
      password: hashed,
    },
  })
  return NextResponse.json({ id: user.id, email: user.email })
>>>>>>> origin/codex/implement-auth-routes-and-features
}
