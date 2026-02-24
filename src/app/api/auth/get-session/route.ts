import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // First try BetterAuth session
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (session) {
      return NextResponse.json(session)
    }

    // Fallback: Check for PIN-based session token
    const sessionCookie = request.cookies.get("better-auth.session_token")
    if (sessionCookie && sessionCookie.value.startsWith("pin_session_")) {
      // Return a default user for PIN-based sessions
      return NextResponse.json({
        user: {
          id: "default_user",
          name: "User",
          email: "user@familyfin.com",
        },
        session: {
          id: "pin_session",
          userId: "default_user",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
    }

    return NextResponse.json(null, { status: 401 })
  } catch (error) {
    return NextResponse.json(null, { status: 401 })
  }
}
