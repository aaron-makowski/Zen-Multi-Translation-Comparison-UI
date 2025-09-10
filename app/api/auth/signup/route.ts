import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hash } from "bcryptjs"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(1),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"

  if (await rateLimit(`signup:${ip}`)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { email, username, password } = parsed.data

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
