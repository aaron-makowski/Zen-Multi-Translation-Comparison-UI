import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const prisma = new PrismaClient()

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown"
  const allowed = await rateLimit(`signup:${ip}`, 5, 60)
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const parse = signupSchema.safeParse(await req.json())
  if (!parse.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const { email, username, password } = parse.data
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
