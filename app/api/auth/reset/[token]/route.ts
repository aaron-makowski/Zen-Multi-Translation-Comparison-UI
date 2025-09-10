import { NextResponse } from "next/server"
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
  return NextResponse.json({ ok: true })
}
