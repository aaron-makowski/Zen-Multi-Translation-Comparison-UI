import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const schema = z.object({ password: z.string().min(6) })

export async function POST(
  req: Request,
  { params }: { params: { token: string } },
) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (await rateLimit(`reset-password:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { password } = parsed.data
  const record = await prisma.verificationToken.findUnique({
    where: { token: params.token },
  })
  if (!record || record.expires < new Date()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({
    where: { email: record.identifier },
    data: { password: hashed },
  })
  await prisma.verificationToken.delete({ where: { token: params.token } })
  return NextResponse.json({ ok: true })
}
