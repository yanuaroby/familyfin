import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

const handler = toNextJsHandler(auth)

export async function GET(request: NextRequest) {
  const response = await handler.GET(request)
  
  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  
  return response
}

export async function POST(request: NextRequest) {
  const response = await handler.POST(request)
  
  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  response.headers.set("Access-Control-Allow-Credentials", "true")
  
  return response
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  })
}
