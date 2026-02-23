import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

// Generate a default secret for development
const defaultSecret = "dev-secret-key-change-in-production-abc123xyz789"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      account: schema.betterAuthAccounts,
      session: schema.betterAuthSessions,
      verification: schema.betterAuthVerifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "member",
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET || defaultSecret,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
})

export type Session = typeof auth.$Infer.Session
