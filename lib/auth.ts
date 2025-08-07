import NextAuth, { type NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"
import { users, sessions } from "./schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db, { users, sessions }),
  session: { strategy: "database" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        })
        if (!user) return null
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.username }
      },
    }),
  ],
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth(authOptions)
