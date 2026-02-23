"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  lastActivityDate?: string
}

export function StreakCounter({ currentStreak, longestStreak, lastActivityDate }: StreakCounterProps) {
  // Check if streak is active (last activity was today or yesterday)
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const isActive = lastActivityDate === today || lastActivityDate === yesterday

  return (
    <Card className="relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10"
        animate={{
          opacity: isActive ? [0.5, 1, 0.5] : 0.3,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Daily Streak</p>
            <div className="flex items-baseline gap-2">
              <motion.div
                className="flex items-center gap-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{
                    rotate: isActive ? [0, 10, -10, 0] : 0,
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Flame
                    className={`h-8 w-8 ${
                      isActive
                        ? "fill-orange-500 text-orange-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span
                  className={`text-4xl font-bold ${
                    isActive ? "text-orange-500" : "text-muted-foreground"
                  }`}
                >
                  {currentStreak}
                </span>
              </motion.div>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                {isActive ? "🔥 On Fire!" : "Needs Attention"}
              </Badge>
              {lastActivityDate === today && (
                <span className="text-xs text-green-500">✓ Today logged</span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">Longest Streak</p>
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
