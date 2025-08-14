import { NextResponse } from "next/server"
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
  return NextResponse.json({ ok: true })
}
