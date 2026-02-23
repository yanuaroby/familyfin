import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"

// Generate a default secret for development
const defaultSecret = "dev-secret-key-change-in-production-abc123xyz789"

// Get all possible origins
const getTrustedOrigins = () => {
  const origins = [
    "http://localhost:3000",
    "http://localhost:3001",
  ]
  
  // Add production URLs
  if (process.env.NEXT_PUBLIC_APP_URL) {
    origins.push(process.env.NEXT_PUBLIC_APP_URL)
  }
  
  // Add Vercel preview URLs
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`)
  }
  
  // Add all Vercel app URLs (wildcard pattern)
  origins.push("https://familyfin-623w.vercel.app")
  origins.push("https://familyfin-4p437cicr-yanuarobys-projects.vercel.app")
  origins.push("https://*.vercel.app")
  
  // Add Vercel preview pattern
  origins.push("https://familyfin-*.vercel.app")
  origins.push("https://*-yanuaroby-projects.vercel.app")
  
  return origins.filter(Boolean)
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
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: getTrustedOrigins(),
})

export type Session = typeof auth.$Infer.Session
