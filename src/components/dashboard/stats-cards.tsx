"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface FinancialStatsProps {
  totalIncome: number
  totalExpense: number
  period?: string
}

export function FinancialStats({
  totalIncome,
  totalExpense,
  period = "Bulan Ini",
}: FinancialStatsProps) {
  return (
    <section className="px-4 mb-6">
      <div className="grid grid-cols-2 gap-3">
        {/* Total Income */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <span className="text-xs text-muted-foreground">Pemasukan</span>
              </div>
              
              <p className="text-xl font-bold text-blue-500">
                {formatCurrency(totalIncome)}
              </p>
              
              <p className="text-[10px] text-muted-foreground mt-1">
                {period}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Expense */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                </div>
                <span className="text-xs text-muted-foreground">Pengeluaran</span>
              </div>
              
              <p className="text-xl font-bold text-red-500">
                {formatCurrency(totalExpense)}
              </p>
              
              <p className="text-[10px] text-muted-foreground mt-1">
                {period}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
