import { NextResponse } from "next/server"
<<<<<<< HEAD
import { db } from "@/lib/db"
import { users, sessions } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { v4 as uuid } from "uuid"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  const { email } = await req.json()
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (user) {
    const token = uuid()
    const expires = new Date(Date.now() + 60 * 60 * 1000)
    await db.insert(sessions).values({ id: token, userId: user.id, expiresAt: expires })

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset/${token}`
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_FROM!,
      subject: "Password Reset",
      text: `Reset your password: ${resetUrl}`,
    })
  }
=======
import { PrismaClient } from "@prisma/client"
import { randomBytes } from "crypto"
import nodemailer from "nodemailer"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { email } = await req.json()
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

>>>>>>> origin/codex/implement-auth-routes-and-features
  return NextResponse.json({ ok: true })
}
