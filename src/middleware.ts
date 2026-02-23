import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that don't require authentication
const publicRoutes = ["/auth/signin", "/auth/signup"]

// Routes that should never be redirected (assets, API, etc.)
const excludedRoutes = [
  "/api/auth",
  "/manifest.json",
  "/icons",
  "/_next",
  "/favicon.ico",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for excluded routes
  if (excludedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if there's a session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token")

  // If no session and trying to access protected route
  if (!sessionCookie && !publicRoutes.some((route) => pathname.startsWith(route))) {
    // Redirect to sign in
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If already authenticated and trying to access auth pages
  if (sessionCookie && publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
