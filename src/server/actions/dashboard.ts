"use server"

import { db } from "@/lib/db"
import { transactions, debts, accounts, categories, budgets } from "@/lib/db/schema"
import { eq, sql, and, gte, lte, desc } from "drizzle-orm"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

/**
 * Get financial summary for dashboard
 */
export async function getFinancialSummary(userId: string) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Get total assets (sum of account balances)
  const accountsData = await db.select().from(accounts)
  const totalAssets = accountsData.reduce((sum, acc) => {
    return sum + (acc.balance > 0 ? acc.balance : 0)
  }, 0)

  // Get total debts
  const debtsData = await db.select().from(debts)
  const totalDebts = debtsData.reduce((sum, debt) => sum + debt.remainingBalance, 0)

  // Get monthly income
  const monthlyIncome = await db
    .select({
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "income"),
        gte(transactions.date, monthStart.toISOString().split("T")[0]),
        lte(transactions.date, monthEnd.toISOString().split("T")[0])
      )
    )

  // Get monthly expense
  const monthlyExpense = await db
    .select({
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "expense"),
        gte(transactions.date, monthStart.toISOString().split("T")[0]),
        lte(transactions.date, monthEnd.toISOString().split("T")[0])
      )
    )

  const income = monthlyIncome[0]?.total || 0
  const expense = monthlyExpense[0]?.total || 0
  const cashflow = income - expense

  // Calculate daily burn rate (average daily spending)
  const dayOfMonth = now.getDate()
  const burnRate = expense / dayOfMonth

  // Net worth
  const netWorth = totalAssets - totalDebts

  return {
    netWorth,
    totalAssets,
    totalDebts,
    monthlyIncome: income,
    monthlyExpense: expense,
    cashflow,
    burnRate,
  }
}

/**
 * Get monthly comparison data for cashflow chart (last 6 months)
 */
export async function getMonthlyComparison(userId: string) {
  const data = []

  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const monthStart = startOfMonth(date)
    const monthEnd = endOfMonth(date)
    const monthLabel = format(date, "MMM")

    const [incomeData, expenseData] = await Promise.all([
      db
        .select({
          total: sql<number>`SUM(${transactions.amount})`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.type, "income"),
            gte(transactions.date, monthStart.toISOString().split("T")[0]),
            lte(transactions.date, monthEnd.toISOString().split("T")[0])
          )
        ),
      db
        .select({
          total: sql<number>`SUM(${transactions.amount})`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense"),
            gte(transactions.date, monthStart.toISOString().split("T")[0]),
            lte(transactions.date, monthEnd.toISOString().split("T")[0])
          )
        ),
    ])

    data.push({
      month: monthLabel,
      income: incomeData[0]?.total || 0,
      expense: expenseData[0]?.total || 0,
    })
  }

  return data
}

/**
 * Get category spending breakdown for current month
 */
export async function getCategorySpending(userId: string) {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Get all expenses grouped by category
  const spending = await db
    .select({
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      color: categories.color,
      total: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.type, "expense"),
        gte(transactions.date, monthStart.toISOString().split("T")[0]),
        lte(transactions.date, monthEnd.toISOString().split("T")[0])
      )
    )
    .groupBy(transactions.categoryId, categories.name, categories.color)
    .orderBy(desc(sql`SUM(${transactions.amount})`))

  // Calculate total for percentage
  const total = spending.reduce((sum, item) => sum + item.total, 0)

  return spending.map((item) => ({
    categoryId: item.categoryId || "",
    categoryName: item.categoryName || "Uncategorized",
    color: item.color || "#888888",
    amount: item.total,
    percentage: total > 0 ? (item.total / total) * 100 : 0,
  }))
}

/**
 * Get debt progress data
 */
export async function getDebtProgress() {
  const debtsData = await db.select().from(debts)

  return debtsData.map((debt) => {
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
    }
  })
}

/**
 * Calculate Health Score (A-F grade)
 * Based on: Income-to-Expense ratio, Debt repayment progress, Savings rate
 */
export async function getHealthScore(userId: string) {
  const summary = await getFinancialSummary(userId)
  const debtsData = await getDebtProgress()

  // Score components (0-100 each)
  let score = 0

  // 1. Income-to-Expense ratio (40 points)
  const expenseRatio =
    summary.monthlyExpense > 0
      ? (summary.monthlyIncome / summary.monthlyExpense) * 20
      : 40
  const ratioScore = Math.min(40, expenseRatio)
  score += ratioScore

  // 2. Positive cashflow (20 points)
  if (summary.cashflow > 0) {
    score += Math.min(20, (summary.cashflow / summary.monthlyIncome) * 40)
  }

  // 3. Debt repayment progress (20 points)
  if (debtsData.length > 0) {
    const avgDebtProgress =
      debtsData.reduce((sum, debt) => sum + debt.progress, 0) / debtsData.length
    score += (avgDebtProgress / 100) * 20
  } else {
    score += 20 // No debt = perfect score
  }

  // 4. Savings rate (20 points)
  const savingsRate =
    summary.monthlyIncome > 0
      ? ((summary.monthlyIncome - summary.monthlyExpense) / summary.monthlyIncome) *
        100
      : 0
  score += Math.min(20, Math.max(0, savingsRate * 0.4))

  // Convert to letter grade
  const normalizedScore = score
  let grade: "A" | "B" | "C" | "D" | "F"
  let status: "Excellent" | "Good" | "Fair" | "Poor" | "Critical"

  if (normalizedScore >= 90) {
    grade = "A"
    status = "Excellent"
  } else if (normalizedScore >= 75) {
    grade = "B"
    status = "Good"
  } else if (normalizedScore >= 60) {
    grade = "C"
    status = "Fair"
  } else if (normalizedScore >= 45) {
    grade = "D"
    status = "Poor"
  } else {
    grade = "F"
    status = "Critical"
  }

  return {
    score: Math.round(normalizedScore),
    grade,
    status,
    breakdown: {
      ratioScore: Math.round(ratioScore),
      cashflowScore: Math.min(20, summary.cashflow > 0 ? (summary.cashflow / summary.monthlyIncome) * 40 : 0),
      debtScore: debtsData.length > 0
        ? Math.round((debtsData.reduce((sum, d) => sum + d.progress, 0) / debtsData.length / 100) * 20)
        : 20,
      savingsScore: Math.round(Math.min(20, Math.max(0, savingsRate * 0.4))),
    },
  }
}

/**
 * Get recent transactions
 */
export async function getRecentTransactions(userId: string, limit: number = 10) {
  const result = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.date))
    .limit(limit)

  return result
}

/**
 * Get budget status for current month
 */
export async function getBudgetStatus(userId: string) {
  const now = new Date()
  const period = format(now, "yyyy-MM")
  const monthEnd = endOfMonth(now)

  const budgetData = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.period, period)
      )
    )

  return Promise.all(
    budgetData.map(async (budget) => {
      // Calculate actual spending for this category
      const spending = await db
        .select({
          total: sql<number>`SUM(${transactions.amount})`,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.userId, userId),
            eq(transactions.categoryId, budget.categoryId),
            eq(transactions.type, "expense"),
            gte(transactions.date, format(now, "yyyy-MM-01")),
            lte(transactions.date, monthEnd.toISOString().split("T")[0])
          )
        )

      const spent = spending[0]?.total || 0
      const percentage = (spent / budget.monthlyLimit) * 100

      return {
        ...budget,
        spent,
        percentage,
        remaining: budget.monthlyLimit - spent,
        isOverBudget: spent > budget.monthlyLimit,
        isApproachingLimit: percentage >= (budget.alertThreshold || 80),
      }
    })
  )
}
