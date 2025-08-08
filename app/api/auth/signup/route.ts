import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
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
}
