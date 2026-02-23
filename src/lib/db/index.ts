import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

// For local development with better-sqlite3
// For production, use Turso (libsql)

const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN

let client

if (tursoUrl && tursoToken) {
  // Production: Use Turso (cloud LibSQL)
  client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  })
} else {
  // Development: Use local SQLite file
  client = createClient({
    url: "file:sqlite.db",
  })
}

export const db = drizzle(client, { schema })
export * from "./schema"
