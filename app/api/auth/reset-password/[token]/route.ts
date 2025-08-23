import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request, { params }: { params: { token: string } }) {
  const { password } = await req.json()
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 })
  }
  const record = await prisma.verificationToken.findUnique({
    where: { token: params.token },
  })
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { email: record.identifier },
    data: { password: hashed },
  })
  await prisma.verificationToken.delete({ where: { token: params.token } })
  return NextResponse.json({ ok: true })
}
