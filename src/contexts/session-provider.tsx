"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"

interface SessionContextType {
  session: any
  isLoading: boolean
  isAuthenticated: boolean
  user?: any
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for session on mount
    fetch("/api/auth/get-session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <SessionContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        user: session?.user,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a SessionProvider")
  }
  return context
}
