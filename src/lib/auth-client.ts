import { createAuthClient } from "better-auth/react"

// Get the current origin (works in browser)
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  // Server-side: use env var or default
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
})

export const { signIn, signOut, signUp } = authClient
