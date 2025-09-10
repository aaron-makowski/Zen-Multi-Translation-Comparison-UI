import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const prisma = new PrismaClient()
const bodySchema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown"
  const allowed = await rateLimit(`reset:${ip}`, 5, 60)
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const parse = bodySchema.safeParse(await req.json())
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const { email } = parse.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + 1000 * 60 * 60)
  await prisma.session.create({
    data: { sessionToken: token, userId: user.id, expires },
  })

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset/${token}`
  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Password Reset",
    text: `Reset your password: ${resetUrl}`,
  })

  return NextResponse.json({ ok: true })
}
