<<<<<<< HEAD
import { NextRequest, NextResponse } from "next/server"

<<<<<<< HEAD
export interface AuthUser {
  id: string
  role: "user" | "admin"
}

export function getUserFromRequest(req: { headers: Headers }): AuthUser | null {
  const id = req.headers.get("x-user-id")
  const role = req.headers.get("x-user-role") as AuthUser["role"] | null
  if (!id || !role) return null
  return { id, role }
}

export function requireRole(req: NextRequest, role: AuthUser["role"]) {
  const user = getUserFromRequest(req)
  if (!user || user.role !== role) {
    return NextResponse.redirect(new URL("/login", req.url))
=======
export function requireRole(req: NextRequest, role: string) {
  const userRole = req.headers.get("x-user-role")
  if (userRole !== role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  }
  return NextResponse.next()
}

<<<<<<< HEAD
export function requireAdmin(req: NextRequest) {
=======
export function adminMiddleware(req: NextRequest) {
>>>>>>> origin/codex/protect-admin-routes-with-middleware
  return requireRole(req, "admin")
}
=======
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null
        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
}

export default authOptions
>>>>>>> origin/codex/implement-auth-routes-and-features
