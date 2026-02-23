import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

// Generate a default secret for development
const defaultSecret = "dev-secret-key-change-in-production-abc123xyz789"

// Get current URL dynamically
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return "http://localhost:3000"
}

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
  baseURL: getBaseURL(),
  // Disable origin check for Vercel deployment
  trustedOrigins: [getBaseURL(), "http://localhost:3000", "http://localhost:3001"],
})

export type Session = typeof auth.$Infer.Session
