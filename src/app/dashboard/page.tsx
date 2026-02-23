"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WalletsSection } from "@/components/dashboard/wallets-section"
import { FinancialStats } from "@/components/dashboard/stats-cards"
import { SpendingTrendChart } from "@/components/dashboard/spending-trend-chart"
import { DebtProgress } from "@/components/dashboard/debt-progress"
import { AddTransactionModal } from "@/components/transactions/add-transaction-modal"
import { getDashboardData, createTransaction } from "@/server/actions/transactions"
import { processDueRecurringTransactions } from "@/server/actions/recurring"
import { useModal } from "@/contexts/modal-provider"
import type { Category } from "@/lib/db/schema"

// Mock data for now - will be replaced with real API calls
const mockCategories: Category[] = [
  { id: "1", name: "Salary", type: "income", color: "#22c55e", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "2", name: "Bonus", type: "income", color: "#16a34a", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "4", name: "Household", type: "expense", color: "#f97316", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "6", name: "Groceries", type: "expense", color: "#f59e0b", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "8", name: "Transport", type: "expense", color: "#3b82f6", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "9", name: "Fuel", type: "expense", color: "#2563eb", createdAt: "", icon: null, isDefault: false, parentId: null },
  { id: "14", name: "Food & Dining", type: "expense", color: "#8b5cf6", createdAt: "", icon: null, isDefault: false, parentId: null },
]

const mockSpendingData = [
  { date: "1", currentMonth: 150000, previousMonth: 120000 },
  { date: "5", currentMonth: 280000, previousMonth: 250000 },
  { date: "10", currentMonth: 420000, previousMonth: 380000 },
  { date: "15", currentMonth: 350000, previousMonth: 400000 },
  { date: "20", currentMonth: 520000, previousMonth: 480000 },
  { date: "23", currentMonth: 380000, previousMonth: 350000 },
]

export default function DashboardPage() {
  const { isTransactionModalOpen, closeTransactionModal } = useModal()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load dashboard data
    loadDashboardData()

    // Check recurring transactions
    processDueRecurringTransactions()
  }, [])

  async function loadDashboardData() {
    try {
      // For now, use mock user ID - will be replaced with real auth
      const userId = "1" // This should come from auth session

      const result = await getDashboardData(userId)
      setData(result)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleTransactionSubmit(formData: any) {
    try {
      // Map payer to user ID (in real app, this comes from auth)
      const userId = formData.payer === "husband" ? "1" : "2"

      await createTransaction({
        ...formData,
        userId,
      })

      // Reload dashboard data
      await loadDashboardData()
      closeTransactionModal()
    } catch (error) {
      console.error("Failed to create transaction:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-emerald-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <DashboardHeader
        streak={data?.streak || 5}
        healthScore={85}
        healthGrade="B"
        userName="Family"
      />

      <main className="pb-20">
        {/* Wallets Section */}
        {data?.wallets && (
          <WalletsSection
            wallets={data.wallets.map((w: any) => ({
              ...w,
              userName: w.userId === "1" ? "Husband" : "Wife",
            }))}
          />
        )}

        {/* Financial Stats */}
        <FinancialStats
          totalIncome={data?.monthlyIncome || 0}
          totalExpense={data?.monthlyExpense || 0}
        />

        {/* Spending Trend Chart */}
        <SpendingTrendChart data={mockSpendingData} />

        {/* Debt Progress */}
        {data?.debts && <DebtProgress debts={data.debts} />}
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        categories={mockCategories}
        wallets={data?.wallets || []}
        debts={data?.debts || []}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  )
}
