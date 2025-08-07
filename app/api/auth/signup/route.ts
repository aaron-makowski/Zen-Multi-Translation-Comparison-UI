import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
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
}
