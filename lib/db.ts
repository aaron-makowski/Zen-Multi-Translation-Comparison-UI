import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// Create a connection pool for the PostgreSQL database
// In production we enable SSL to support managed services like RDS or Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined,
})

// Pass the schema with relations to the drizzle function
export const db = drizzle(pool, { schema })

// Export the pool for direct queries if needed
export { pool }
