import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
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
  const allowed = await rateLimit(`reset-password:${ip}`, 5, 60)
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
    return NextResponse.json({ ok: true })
  }
  // Continue even if the user signed up with OAuth and has no local password
  const token = randomUUID()
  const expires = new Date(Date.now() + 60 * 60 * 1000)
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  })
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Password Reset",
    text: `Reset your password: ${resetUrl}`,
  })
  return NextResponse.json({ ok: true })
}
