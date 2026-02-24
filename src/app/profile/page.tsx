"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Settings, LogOut, CreditCard, Target, PieChart, Bell, Shield, Moon, Sun, Wallet, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const menuItems = [
  { name: "Dompet", icon: Wallet, href: "/wallets", color: "#10b981" },
  { name: "Savings Goals", icon: Target, href: "/goals", color: "#10b981" },
  { name: "Budgets", icon: PieChart, href: "/budgets", color: "#3b82f6" },
  { name: "Debts", icon: CreditCard, href: "/debts", color: "#ef4444" },
  { name: "Categories", icon: User, href: "/categories", color: "#f59e0b" },
]

export default function ProfilePage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    loadSession()
    // Load theme preference
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])

  async function loadSession() {
    try {
      const response = await fetch("/api/auth/get-session")
      const data = await response.json()
      setSession(data)
    } catch (error) {
      console.error("Failed to load session:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/auth/signin")
    router.refresh()
  }

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", newMode ? "dark" : "light")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Akun</h1>
            <p className="text-xs text-muted-foreground">
              Manage your account & settings
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">
                  {session?.user?.name || "User"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email || "user@example.com"}
                </p>
                <Badge className="mt-1 bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
                  {session?.user?.role === "admin" ? "Admin" : "Member"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Wallets</span>
              </div>
              <p className="text-lg font-bold text-white">4</p>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Goals</span>
              </div>
              <p className="text-lg font-bold text-white">0</p>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-4 w-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Budgets</span>
              </div>
              <p className="text-lg font-bold text-white">0</p>
            </CardContent>
          </Card>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground">Debts</span>
              </div>
              <p className="text-lg font-bold text-white">3</p>
            </CardContent>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Quick Access
          </h3>
          {menuItems.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(item.href)}
              className="w-full"
            >
              <Card className="border-white/5 bg-card/50 hover:bg-white/5 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm font-medium text-white flex-1 text-left">
                      {item.name}
                    </span>
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>

        {/* Settings Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Settings
          </h3>
          <Card className="border-white/5 bg-card/50">
            <CardContent className="divide-y divide-white/5">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-white">Notifications</span>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-white">Dark Mode</span>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-white">Privacy & Security</span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>

        {/* App Info */}
        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            UsFin v1.0.0
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Shared Family Cashflow Tracker
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Built with ❤️ for families
          </p>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Settings</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Customize your experience
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-white">Light Mode</span>
              </div>
              <Switch
                checked={!isDarkMode}
                onCheckedChange={() => toggleTheme()}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-white">Push Notifications</span>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
