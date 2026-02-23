"use client"

import { motion } from "framer-motion"
import { CreditCard, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import type { Debt } from "@/lib/db/schema"

interface DebtProgressProps {
  debts: Debt[]
}

export function DebtProgress({ debts }: DebtProgressProps) {
  const totalDebt = debts.reduce((acc, debt) => acc + debt.remainingBalance, 0)
  const totalOriginal = debts.reduce((acc, debt) => acc + debt.totalAmount, 0)
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = (totalPaid / totalOriginal) * 100

  return (
    <section className="px-4 mb-6">
      <Card className="border-white/5 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              Progress Hutang
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {overallProgress.toFixed(0)}% Lunas
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <Progress value={overallProgress} className="h-2" />

          {/* Individual Debts */}
          <div className="space-y-3">
            {debts.map((debt, index) => {
              const paid = debt.totalAmount - debt.remainingBalance
              const progress = (paid / debt.totalAmount) * 100
              const monthsRemaining = debt.monthlyInstallment
                ? Math.ceil(debt.remainingBalance / debt.monthlyInstallment)
                : 0

              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: debt.color }}
                      />
                      <span className="text-sm font-medium">{debt.name}</span>
                    </div>
                    <span className="text-sm font-bold">
                      {formatCurrency(debt.remainingBalance)}
                    </span>
                  </div>

                  <Progress value={progress} className="h-1.5" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <TrendingDown className="h-3 w-3" />
                      {monthsRemaining}x cicilan lagi
                    </span>
                    <span className="text-muted-foreground">
                      {formatCurrency(debt.monthlyInstallment)}/bulan
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
