import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const schema = z.object({ email: z.string().email() })

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (await rateLimit(`reset:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { email } = parsed.data
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
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
