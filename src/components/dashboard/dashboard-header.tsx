"use client"

import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface DashboardHeaderProps {
  streak: number
  healthScore: number
  healthGrade: string
  userName?: string
}

export function DashboardHeader({
  streak,
  healthScore,
  healthGrade,
  userName,
}: DashboardHeaderProps) {
  // Calculate circumference for progress ring
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const progress = healthScore > 0 ? (healthScore / 100) * circumference : 0

  // Grade colors
  const gradeColors: Record<string, string> = {
    A: "#10b981",
    B: "#3b82f6",
    C: "#f59e0b",
    D: "#ef4444",
    F: "#7f1d1d",
    "-": "#404040",
  }

  const gradeColor = gradeColors[healthGrade] || "#404040"

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between p-4">
        {/* Left: User Greeting */}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gradient">
            Hi, {userName || "Family"} 👋
          </h1>
          <p className="text-xs text-muted-foreground">
            Let&apos;s grow your wealth
          </p>
        </div>

        {/* Right: Streak + Health Ring */}
        <div className="flex items-center gap-3">
          {/* Daily Win-Streak */}
          <motion.div
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
            </motion.div>
            <span className="text-sm font-bold text-orange-500">{streak}</span>
          </motion.div>

          {/* Health Score Ring */}
          <div className="relative">
            <svg
              width="56"
              height="56"
              className="transform -rotate-90"
            >
              {/* Background Circle */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="4"
              />
              
              {/* Progress Circle */}
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke={gradeColor}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - progress }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </svg>

            {/* Grade Badge */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-center"
              >
                <span
                  className="text-lg font-black"
                  style={{ color: gradeColor }}
                >
                  {healthGrade}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Tooltip for Health Score */}
          {healthScore === 0 && (
            <div className="absolute -bottom-8 right-0 text-[9px] text-muted-foreground whitespace-nowrap">
              Tambah transaksi untuk melihat skor
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
