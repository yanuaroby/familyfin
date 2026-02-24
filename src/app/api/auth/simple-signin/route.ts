import { NextRequest, NextResponse } from "next/server"

// Simple PIN-based authentication endpoint
// Creates a session cookie when correct PIN is provided
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

    // Create a simple session token
    const sessionToken = `pin_session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: "default_user",
        name: "User",
        email: "user@familyfin.com",
      }
    })
    
    // Set session cookie
    response.cookies.set("better-auth.session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal masuk" },
      { status: 500 }
    )
  }
}
