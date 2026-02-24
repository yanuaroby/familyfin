"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Simple PIN-based authentication
const VALID_PIN = "12345"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [pin, setPin] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (pin === VALID_PIN) {
        // Create a simple session by calling the sign-in API
        // We'll use a fixed user for PIN authentication
        const response = await fetch("/api/auth/simple-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        })

        if (response.ok) {
          router.push("/dashboard")
          router.refresh()
        } else {
          const data = await response.json()
          setError(data.error || "Gagal masuk")
        }
      } else {
        setError("PIN salah. Gunakan: 12345")
      }
    } catch (err: any) {
      setError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Wallet className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">FamilyFin</CardTitle>
          <CardDescription>
            Masukkan PIN untuk masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg dark:bg-red-900/20">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="pin">PIN</Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="12345"
                value={pin}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "")
                  setPin(value)
                }}
                required
                disabled={isLoading}
                className="text-center text-2xl tracking-[1em] font-mono"
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memuat..." : "Masuk"}
            </Button>
          </form>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>PIN Default: <strong>12345</strong></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
