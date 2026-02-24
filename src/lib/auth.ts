import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

// Generate a default secret for development
const defaultSecret = "dev-secret-key-change-in-production-abc123xyz789"

// Get base URL from environment or use localhost for development
const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Extract domain from baseURL for trusted origins
const getTrustedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://localhost:3001",
  ]

  // Add production URLs
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL)
  }

  // Add Vercel preview and production domains
  origins.push("https://familyfin-taupe.vercel.app")
  origins.push("https://familyfin-yanuarobys-projects.vercel.app")
  origins.push("https://familyfin-623w.vercel.app")
  origins.push("https://familyfin.vercel.app")

  return origins
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
  baseURL,
  trustedOrigins: getTrustedOrigins(),
})

export type Session = typeof auth.$Infer.Session
