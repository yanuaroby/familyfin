"use server"

import { db } from "@/lib/db"
import { budgets, categories, transactions } from "@/lib/db/schema"
import { eq, and, gte, lte, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import { startOfMonth, endOfMonth, format } from "date-fns"

export interface CreateBudgetData {
  userId: string
  categoryId: string
  monthlyLimit: number
  alertThreshold?: number
}

export interface BudgetWithCategory {
  id: string
  userId: string
  categoryId: string
  monthlyLimit: number
  spent: number
  period: string
  alertThreshold: number
  category: {
    name: string
    color: string
  }
  percentage: number
  remaining: number
  isOverBudget: boolean
  isApproachingLimit: boolean
}

/**
 * Get all budgets for a user with current spending
 */
export async function getUserBudgets(userId: string, period?: string): Promise<BudgetWithCategory[]> {
  const now = new Date()
  const currentPeriod = period || format(now, "yyyy-MM")
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)

  // Get budgets for the period
  const userBudgets = await db
    .select()
    .from(budgets)
    .where(
      and(
        eq(budgets.userId, userId),
        eq(budgets.period, currentPeriod)
      )
    )

  // Get spending for each budget
  const budgetsWithSpending: BudgetWithCategory[] = []

  for (const budget of userBudgets) {
    // Get category
    const categoryResult = await db
      .select({ name: categories.name, color: categories.color })
      .from(categories)
      .where(eq(categories.id, budget.categoryId))
      .limit(1)

    const category = categoryResult[0] || { name: "Unknown", color: "#888888" }

    // Calculate actual spending for this category
    const spendingResult = await db
      .select({ total: sql<number>`SUM(${transactions.amount})` })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.categoryId, budget.categoryId),
          eq(transactions.type, "expense"),
          gte(transactions.date, monthStart.toISOString().split("T")[0]),
          lte(transactions.date, monthEnd.toISOString().split("T")[0])
        )
      )

    const spent = spendingResult[0]?.total || 0
    const percentage = (spent / budget.monthlyLimit) * 100
    const remaining = budget.monthlyLimit - spent

    budgetsWithSpending.push({
      ...budget,
      category,
      spent,
      percentage,
      remaining,
      isOverBudget: spent > budget.monthlyLimit,
      isApproachingLimit: percentage >= (budget.alertThreshold || 80),
    })
  }

  return budgetsWithSpending
}

/**
 * Create a new budget
 */
export async function createBudget(data: CreateBudgetData) {
  const budgetId = nanoid(12)
  const now = new Date()
  const period = format(now, "yyyy-MM")

  try {
    // Check if budget already exists for this category and period
    const existing = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.userId, data.userId),
          eq(budgets.categoryId, data.categoryId),
          eq(budgets.period, period)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      return {
        success: false,
        error: "Budget already exists for this category this month",
      }
    }

    await db.insert(budgets).values({
      id: budgetId,
      userId: data.userId,
      categoryId: data.categoryId,
      monthlyLimit: data.monthlyLimit,
      alertThreshold: data.alertThreshold || 80,
      period,
      spent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidatePath("/budgets")
    revalidatePath("/dashboard")

    return {
      success: true,
      budgetId,
    }
  } catch (error: any) {
    console.error("Failed to create budget:", error)
    return {
      success: false,
      error: error.message || "Failed to create budget",
    }
  }
}

/**
 * Update an existing budget
 */
export async function updateBudget(
  budgetId: string,
  data: { monthlyLimit?: number; alertThreshold?: number }
) {
  try {
    await db
      .update(budgets)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(budgets.id, budgetId))

    revalidatePath("/budgets")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to update budget:", error)
    return {
      success: false,
      error: error.message || "Failed to update budget",
    }
  }
}

/**
 * Delete a budget
 */
export async function deleteBudget(budgetId: string) {
  try {
    await db.delete(budgets).where(eq(budgets.id, budgetId))

    revalidatePath("/budgets")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to delete budget:", error)
    return {
      success: false,
      error: error.message || "Failed to delete budget",
    }
  }
}
