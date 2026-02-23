"use server"

import { db } from "@/lib/db"
import { recurringTransactions, transactions, wallets, streaks } from "@/lib/db/schema"
import { eq, lte, and } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import { addDays, addWeeks, addMonths, addYears } from "date-fns"

/**
 * Get all recurring transactions for a user
 */
export async function getRecurringTransactions(userId: string) {
  try {
    const recurring = await db
      .select()
      .from(recurringTransactions)
      .where(eq(recurringTransactions.userId, userId))
      .orderBy(recurringTransactions.createdAt)

    return recurring
  } catch (error: any) {
    console.error("Failed to get recurring transactions:", error)
    return []
  }
}

/**
 * Create a new recurring transaction template
 */
export async function createRecurringTransaction(data: {
  userId: string
  amount: number
  categoryId: string
  walletId: string
  debtId?: string
  type: "income" | "expense" | "debt_repayment"
  note?: string
  frequency: "daily" | "weekly" | "monthly" | "yearly"
  startDate: string
}) {
  const templateId = nanoid(12)

  try {
    // Calculate first run date
    let nextRunDate = new Date(data.startDate)

    await db.insert(recurringTransactions).values({
      id: templateId,
      userId: data.userId,
      amount: data.amount,
      categoryId: data.categoryId,
      walletId: data.walletId,
      debtId: data.debtId,
      type: data.type,
      note: data.note,
      frequency: data.frequency,
      startDate: data.startDate,
      nextRun: nextRunDate.toISOString().split("T")[0],
      isEnabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidatePath("/recurring")
    revalidatePath("/transactions")

    return {
      success: true,
      templateId,
    }
  } catch (error: any) {
    console.error("Failed to create recurring transaction:", error)
    return {
      success: false,
      error: error.message || "Failed to create recurring transaction",
    }
  }
}

/**
 * Update a recurring transaction template
 */
export async function updateRecurringTransaction(
  templateId: string,
  data: {
    amount?: number
    categoryId?: string
    note?: string
    frequency?: string
    isEnabled?: boolean
  }
) {
  try {
    await db
      .update(recurringTransactions)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(recurringTransactions.id, templateId))

    revalidatePath("/recurring")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to update recurring transaction:", error)
    return {
      success: false,
      error: error.message || "Failed to update recurring transaction",
    }
  }
}

/**
 * Delete a recurring transaction template
 */
export async function deleteRecurringTransaction(templateId: string) {
  try {
    await db.delete(recurringTransactions).where(eq(recurringTransactions.id, templateId))

    revalidatePath("/recurring")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to delete recurring transaction:", error)
    return {
      success: false,
      error: error.message || "Failed to delete recurring transaction",
    }
  }
}

/**
 * Process recurring transactions that are due
 * Call this on page load or via cron job
 */
export async function processDueRecurringTransactions() {
  const today = new Date().toISOString().split("T")[0]

  try {
    // Get all enabled recurring transactions that are due
    const dueTransactions = await db
      .select()
      .from(recurringTransactions)
      .where(
        and(
          eq(recurringTransactions.isEnabled, true),
          lte(recurringTransactions.nextRun, today)
        )
      )

    for (const recurring of dueTransactions) {
      await processSingleRecurringTransaction(recurring)
    }

    return {
      success: true,
      processed: dueTransactions.length,
    }
  } catch (error: any) {
    console.error("Failed to process recurring transactions:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Process a single recurring transaction
 */
async function processSingleRecurringTransaction(recurring: any) {
  await db.transaction(async (tx) => {
    // 1. Create the transaction
    const transactionId = nanoid(12)
    await tx.insert(transactions).values({
      id: transactionId,
      amount: recurring.amount,
      date: recurring.nextRun,
      type: recurring.type,
      categoryId: recurring.categoryId,
      walletId: recurring.walletId,
      debtId: recurring.debtId,
      userId: recurring.userId,
      note: recurring.note,
      isRecurring: true,
      recurringTemplateId: recurring.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // 2. Update wallet balance
    const wallet = await tx
      .select()
      .from(wallets)
      .where(eq(wallets.id, recurring.walletId))
      .limit(1)

    if (wallet.length > 0) {
      const currentWallet = wallet[0]
      let newBalance = currentWallet.balance

      if (recurring.type === "income") {
        newBalance += recurring.amount
      } else if (recurring.type === "expense" || recurring.type === "debt_repayment") {
        newBalance -= recurring.amount
      }

      await tx
        .update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, recurring.walletId))
    }

    // 3. Calculate next run date based on frequency
    let nextRunDate = new Date(recurring.nextRun)

    switch (recurring.frequency) {
      case "daily":
        nextRunDate = addDays(nextRunDate, 1)
        break
      case "weekly":
        nextRunDate = addWeeks(nextRunDate, 1)
        break
      case "monthly":
        nextRunDate = addMonths(nextRunDate, 1)
        break
      case "yearly":
        nextRunDate = addYears(nextRunDate, 1)
        break
    }

    // 4. Update the recurring template
    await tx
      .update(recurringTransactions)
      .set({
        lastRun: recurring.nextRun,
        nextRun: nextRunDate.toISOString().split("T")[0],
        updatedAt: new Date().toISOString(),
      })
      .where(eq(recurringTransactions.id, recurring.id))

    // 5. Update user's streak
    await updateStreak(tx, recurring.userId)
  })

  revalidatePath("/dashboard")
  revalidatePath("/transactions")
}

/**
 * Update user's streak for recurring transaction
 */
async function updateStreak(tx: any, userId: string) {
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

  const userStreak = await tx
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1)

  if (userStreak.length === 0) {
    await tx.insert(streaks).values({
      id: nanoid(12),
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
    })
  } else {
    const streak = userStreak[0]
    const lastActivity = streak.lastActivityDate

    if (lastActivity !== today) {
      let newStreakCount = streak.currentStreak

      if (lastActivity === yesterday) {
        newStreakCount = streak.currentStreak + 1
      } else {
        newStreakCount = 1
      }

      await tx
        .update(streaks)
        .set({
          currentStreak: newStreakCount,
          longestStreak: Math.max(newStreakCount, streak.longestStreak),
          lastActivityDate: today,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(streaks.userId, userId))
    }
  }
}

/**
 * Toggle recurring transaction enabled/disabled
 */
export async function toggleRecurringTransaction(templateId: string, isEnabled: boolean) {
  try {
    await db
      .update(recurringTransactions)
      .set({
        isEnabled,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(recurringTransactions.id, templateId))

    revalidatePath("/recurring")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to toggle recurring transaction:", error)
    return {
      success: false,
      error: error.message || "Failed to toggle recurring transaction",
    }
  }
}
