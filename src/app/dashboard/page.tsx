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
import { getCategories } from "@/server/actions/categories"
import { getWallets } from "@/server/actions/wallets"
import { processDueRecurringTransactions } from "@/server/actions/recurring"
import { useModal } from "@/contexts/modal-provider"
import type { Category } from "@/lib/db/schema"

export default function DashboardPage() {
  const { isTransactionModalOpen, closeTransactionModal } = useModal()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [wallets, setWallets] = useState<any[]>([])

  useEffect(() => {
    // Load dashboard data
    loadDashboardData()
    // Load categories and wallets for modal
    loadCategoriesAndWallets()
    // Check recurring transactions
    processDueRecurringTransactions()
  }, [])

  async function loadDashboardData() {
    try {
      // Use default user ID
      const userId = "default_user"

      const result = await getDashboardData(userId)
      setData(result)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function loadCategoriesAndWallets() {
    try {
      const userId = "default_user"
      const [cats, wals] = await Promise.all([
        getCategories(),
        getWallets(userId),
      ])
      setCategories(cats)
      setWallets(wals)
    } catch (error) {
      console.error("Failed to load categories and wallets:", error)
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
        streak={data?.streak || 0}
        healthScore={data?.healthScore || 0}
        healthGrade={data?.healthGrade || "-"}
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
        <SpendingTrendChart data={[]} />

        {/* Debt Progress */}
        {data?.debts && <DebtProgress debts={data.debts} />}
      </main>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        categories={categories}
        wallets={wallets}
        debts={data?.debts || []}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  )
}
