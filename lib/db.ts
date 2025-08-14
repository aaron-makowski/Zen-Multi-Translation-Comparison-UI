import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema"

// Create a connection pool to a PostgreSQL database
// Use SSL in production environments for security
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
})

// Pass the schema with relations to the drizzle function
export const db = drizzle(pool, { schema })

// Export the pool for direct queries or debugging
export { pool }
