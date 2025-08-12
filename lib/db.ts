import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"
import { PrismaClient } from "@prisma/client"

// Optional: Configure neon to use WebSockets for better performance
if (typeof WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = WebSocket
}

// Create a SQL executor using the Neon serverless driver
const sql = neon(process.env.DATABASE_URL!)

// Pass the schema with relations to the drizzle function
export const db = drizzle(sql, { schema })

// Ensure a single PrismaClient instance in serverless environments
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Disconnect Prisma on process exit to free resources
process.on("beforeExit", async () => {
  await prisma.$disconnect()
})

// Export the SQL executor for direct queries
export { sql }
