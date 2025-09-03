import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email, username, password } = await req.json()
  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    )
  }
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
  const hashed = await hash(password, 10)
  const user = await prisma.user.create({
    data: { email, username, password: hashed },
  })
  return NextResponse.json({ id: user.id, email: user.email })
}
