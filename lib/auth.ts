import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { prisma } from "./db"
import { randomUUID } from "crypto"

// Simple session store (in production, this would be in a database)
const sessions: Record<string, { userId: string; expires: Date }> = {}

export async function createSession(userId: string) {
  // Create a session that expires in 30 days
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const sessionId = randomUUID()

  // Store session
  sessions[sessionId] = { userId, expires }

  // Set cookie
  cookies().set("session", sessionId, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return sessionId
}

export async function getSession() {
  const sessionId = cookies().get("session")?.value

  if (!sessionId) return null

  const session = sessions[sessionId]

  if (!session) return null

  // Check if session has expired
  if (new Date() > session.expires) {
    delete sessions[sessionId]
    cookies().delete("session")
    return null
  }

  return session
}

export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.userId) return null

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  })

  return user
}

export async function logout() {
  const sessionId = cookies().get("session")?.value

  if (sessionId) {
    delete sessions[sessionId]
  }

  cookies().delete("session")
}

// For demo purposes - create a guest user session
export async function createGuestSession() {
  // Check if guest user exists
  let guestUser = await prisma.user.findFirst({
    where: { email: "guest@example.com" },
  })

  // Create guest user if it doesn't exist
  if (!guestUser) {
    guestUser = await prisma.user.create({
      data: {
        name: "Guest User",
        email: "guest@example.com",
        password: "guest", // In a real app, you'd hash this
      },
    })
  }

  return createSession(guestUser.id)
}

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function comparePasswords(password: string, hashedPassword: string) {
  const isPasswordValid = await compare(password, hashedPassword)
  return isPasswordValid
}
