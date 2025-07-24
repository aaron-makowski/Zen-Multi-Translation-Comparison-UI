import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// This approach doesn't use Prisma, which is causing deployment issues
// Instead, we'll use Neon's serverless driver directly with Drizzle ORM

// Optional: Configure neon to use WebSockets for better performance
if (typeof WebSocket !== "undefined") {
  neonConfig.webSocketConstructor = WebSocket
}

// Create a SQL executor using the Neon serverless driver
const sql = neon(process.env.DATABASE_URL!)

// Pass the schema with relations to the drizzle function
export const db = drizzle(sql, { schema })

// Export the SQL executor for direct queries
export { sql }
