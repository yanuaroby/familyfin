"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Activity, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface HealthScoreProps {
  score: number
  grade: "A" | "B" | "C" | "D" | "F"
  status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical"
  breakdown: {
    ratioScore: number
    cashflowScore: number
    debtScore: number
    savingsScore: number
  }
}

const gradeColors = {
  A: "from-green-500 to-emerald-500",
  B: "from-blue-500 to-cyan-500",
  C: "from-yellow-500 to-orange-500",
  D: "from-orange-500 to-red-500",
  F: "from-red-500 to-rose-500",
}

const gradeBgColors = {
  A: "bg-green-500",
  B: "bg-blue-500",
  C: "bg-yellow-500",
  D: "bg-orange-500",
  F: "bg-red-500",
}

export function HealthScore({ score, grade, status, breakdown }: HealthScoreProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Financial Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="flex items-center justify-center gap-6">
          {/* Grade Circle */}
          <motion.div
            className={`relative h-32 w-32 rounded-full bg-gradient-to-br ${gradeColors[grade]} flex items-center justify-center`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <motion.div
              className="absolute inset-1 rounded-full bg-card"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            />
            <motion.span
              className={`relative text-6xl font-bold bg-gradient-to-br ${gradeColors[grade]} bg-clip-text text-transparent`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {grade}
            </motion.span>
          </motion.div>

          {/* Score Details */}
          <div className="space-y-2">
            <div className="text-4xl font-bold">{score}/100</div>
            <Badge className={gradeBgColors[grade]}>{status}</Badge>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {score >= 90
                ? "Excellent! Keep up the great work!"
                : score >= 75
                ? "Good progress! Room for improvement."
                : score >= 60
                ? "Fair, but there's work to be done."
                : score >= 45
                ? "Poor. Time to make some changes."
                : "Critical. Immediate action needed!"}
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3 pt-4 border-t">
          <p className="text-sm font-medium">Score Breakdown</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Income/Expense Ratio
              </span>
              <span className="font-medium">{breakdown.ratioScore}/40</span>
            </div>
            <Progress value={(breakdown.ratioScore / 40) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                Positive Cashflow
              </span>
              <span className="font-medium">{breakdown.cashflowScore}/20</span>
            </div>
            <Progress value={(breakdown.cashflowScore / 20) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-purple-500" />
                Debt Progress
              </span>
              <span className="font-medium">{breakdown.debtScore}/20</span>
            </div>
            <Progress value={(breakdown.debtScore / 20) * 100} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                Savings Rate
              </span>
              <span className="font-medium">{breakdown.savingsScore}/20</span>
            </div>
            <Progress value={(breakdown.savingsScore / 20) * 100} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
