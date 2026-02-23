"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, TrendingDown, DollarSign, Calendar, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import { mockDebts } from "@/lib/store/mock-data"
import type { Debt } from "@/lib/db/schema"

// Mock payment history data
const mockPaymentHistory = [
  { id: "1", debtId: "1", amount: 4500000, previousBalance: 102500000, newBalance: 98000000, paymentDate: "2025-02-15", note: "Monthly installment" },
  { id: "2", debtId: "1", amount: 4500000, previousBalance: 107000000, newBalance: 102500000, paymentDate: "2025-01-15", note: "Monthly installment" },
  { id: "3", debtId: "2", amount: 2000000, previousBalance: 5500000, newBalance: 3500000, paymentDate: "2025-02-15", note: "CC payment" },
  { id: "4", debtId: "2", amount: 2000000, previousBalance: 7500000, newBalance: 5500000, paymentDate: "2025-01-15", note: "CC payment" },
  { id: "5", debtId: "3", amount: 500000, previousBalance: 2500000, newBalance: 2000000, paymentDate: "2025-02-10", note: "Paylater payment" },
]

interface DebtWithProgress extends Omit<Debt, 'createdAt' | 'updatedAt' | 'notes'> {
  paid: number
  progress: number
  monthsRemaining: number
  createdAt?: string
  updatedAt?: string
  notes?: string | null
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<DebtWithProgress[]>([])
  const [selectedDebt, setSelectedDebt] = useState<DebtWithProgress | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])

  useEffect(() => {
    // Process debts with progress calculation
    const processedDebts = mockDebts.map((debt) => {
      const paid = debt.totalAmount - debt.remainingBalance
      const progress = (paid / debt.totalAmount) * 100
      const monthsRemaining = debt.monthlyInstallment
        ? Math.ceil(debt.remainingBalance / debt.monthlyInstallment)
        : 0

      return {
        ...debt,
        paid,
        progress,
        monthsRemaining,
        color: debt.color ?? null,
        limit: debt.limit ?? null,
        interestRate: debt.interestRate ?? null,
      }
    })

    setDebts(processedDebts)
  }, [])

  const openHistory = (debt: DebtWithProgress) => {
    setSelectedDebt(debt)
    const history = mockPaymentHistory.filter(h => h.debtId === debt.id)
    setPaymentHistory(history)
    setIsHistoryOpen(true)
  }

  const totalDebt = debts.reduce((sum, d) => sum + d.remainingBalance, 0)
  const totalOriginal = debts.reduce((sum, d) => sum + d.totalAmount, 0)
  const totalPaid = totalOriginal - totalDebt
  const overallProgress = (totalPaid / totalOriginal) * 100

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Debts</h1>
            <p className="text-xs text-muted-foreground">
              Track your debt payoff progress
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-3 gap-3 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Remaining</span>
            </div>
            <p className="text-sm font-bold text-white">
              {formatCurrency(totalDebt)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Paid</span>
            </div>
            <p className="text-sm font-bold text-emerald-500">
              {formatCurrency(totalPaid)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <Progress className="h-3.5 w-3.5" value={overallProgress} />
              <span className="text-[10px] text-muted-foreground">Progress</span>
            </div>
            <p className="text-sm font-bold text-white">
              {overallProgress.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="px-4 space-y-4">
        {debts.map((debt, index) => (
          <motion.div
            key={debt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="border-white/5 bg-card/50 overflow-hidden"
              style={{ borderColor: `${debt.color}30` }}
            >
              <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: debt.color ?? '#888888' }}
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{debt.name}</h3>
                      <Badge
                        variant={debt.type === "fixed_term" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {debt.type === "fixed_term" ? "Fixed Term" : "Revolving"}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openHistory(debt)}
                    className="text-muted-foreground hover:text-white"
                  >
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </div>

                {/* Balance */}
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(debt.remainingBalance)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Original</p>
                    <p className="text-sm text-white">
                      {formatCurrency(debt.totalAmount)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={debt.progress} className="h-2" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Left</p>
                      <p className="text-sm font-medium text-white">
                        {debt.monthsRemaining} months
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Monthly</p>
                    <p className="text-sm font-medium text-white">
                      {formatCurrency(debt.monthlyInstallment)}
                    </p>
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {formatDate(new Date(debt.dueDate))}</span>
                  </div>
                  {debt.type === "revolving" && debt.limit && (
                    <div className="text-right">
                      <span className="text-muted-foreground">Limit: </span>
                      <span className="text-white font-medium">
                        {formatCurrency(debt.limit)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payment History Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              Payment History - {selectedDebt?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              All payments made towards this debt
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4 max-h-[60vh] overflow-y-auto">
            {paymentHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No payment history yet
              </p>
            ) : (
              paymentHistory.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg border border-white/5 bg-white/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <TrendingDown className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(new Date(payment.paymentDate))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Before: </span>
                      <span className="text-white">
                        {formatCurrency(payment.previousBalance)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground">After: </span>
                      <span className="text-emerald-500 font-medium">
                        {formatCurrency(payment.newBalance)}
                      </span>
                    </div>
                  </div>
                  {payment.note && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {payment.note}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Summary */}
          {paymentHistory.length > 0 && (
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="text-emerald-500 font-bold">
                  {formatCurrency(paymentHistory.reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
