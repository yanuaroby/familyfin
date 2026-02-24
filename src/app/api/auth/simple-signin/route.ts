import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

// Simple PIN-based authentication endpoint
// Creates a session for a default user when correct PIN is provided
export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    // Simple PIN validation
    if (pin !== "12345") {
      return NextResponse.json(
        { error: "PIN salah" },
        { status: 401 }
      )
    }

    // Create session for default user
    // First, try to sign in with the default user credentials
    try {
      // Use BetterAuth's API to create a session
      const session = await auth.api.createSession({
        body: {
          userId: "default_user",
        },
      })

      // Return success with session
      const response = NextResponse.json({ success: true })
      
      // Set session cookie
      if (session?.token) {
        response.cookies.set("better-auth.session_token", session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      return response
    } catch (authError: any) {
      // If BetterAuth fails, fall back to simple cookie-based auth
      const sessionToken = `pin_session_${Date.now()}_${Math.random().toString(36).substring(7)}`
      
      const response = NextResponse.json({ success: true })
      response.cookies.set("better-auth.session_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
      
      return response
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal masuk" },
      { status: 500 }
    )
  }
}
