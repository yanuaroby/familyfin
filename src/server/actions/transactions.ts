"use server"

import { db } from "@/lib/db"
import { transactions, wallets, debts, debtPayments, activityLogs, streaks } from "@/lib/db/schema"
import { eq, desc, and, gte, lte, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export type TransactionType = "income" | "expense" | "transfer" | "debt_repayment"

export interface CreateTransactionData {
  amount: number
  date: string
  type: TransactionType
  categoryId: string
  walletId: string
  debtId?: string
  userId: string
  note?: string
}

export interface TransactionResult {
  success: boolean
  error?: string
  transaction?: any
}

/**
 * Create a new transaction with automatic debt reduction and wallet balance update
 */
export async function createTransaction(
  data: CreateTransactionData
): Promise<TransactionResult> {
  const transactionId = nanoid(12)

  try {
    await db.transaction(async (tx) => {
      // 1. Create the transaction
      const newTransaction = {
        id: transactionId,
        amount: data.amount,
        date: data.date,
        type: data.type,
        categoryId: data.categoryId,
        walletId: data.walletId,
        debtId: data.debtId,
        userId: data.userId,
        note: data.note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await tx.insert(transactions).values(newTransaction)

      // 2. Update wallet balance
      const wallet = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.id, data.walletId))
        .limit(1)

      if (wallet.length === 0) {
        throw new Error("Wallet not found")
      }

      const currentWallet = wallet[0]
      let newBalance = currentWallet.balance

      // Update balance based on transaction type
      if (data.type === "income") {
        newBalance += data.amount
      } else if (data.type === "expense" || data.type === "debt_repayment") {
        newBalance -= data.amount
      }

      await tx
        .update(wallets)
        .set({ balance: newBalance })
        .where(eq(wallets.id, data.walletId))

      // 3. If this is a debt repayment, handle auto-reduction
      if (data.type === "debt_repayment" && data.debtId) {
        const debtData = await tx
          .select()
          .from(debts)
          .where(eq(debts.id, data.debtId))
          .limit(1)

        if (debtData.length === 0) {
          throw new Error("Debt not found")
        }

        const currentDebt = debtData[0]
        const previousBalance = currentDebt.remainingBalance
        const newDebtBalance = Math.max(0, previousBalance - data.amount)

        // Update debt remaining balance
        await tx
          .update(debts)
          .set({
            remainingBalance: newDebtBalance,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(debts.id, data.debtId))

        // Record the debt payment history
        await tx.insert(debtPayments).values({
          id: nanoid(12),
          debtId: data.debtId,
          transactionId: transactionId,
          amount: data.amount,
          previousBalance,
          newBalance: newDebtBalance,
          paymentDate: data.date,
          note: data.note,
        })

        // Log activity
        await tx.insert(activityLogs).values({
          id: nanoid(12),
          userId: data.userId,
          action: "debt_payment",
          entityType: "debt",
          entityId: data.debtId,
          metadata: JSON.stringify({
            amount: data.amount,
            previousBalance,
            newBalance: newDebtBalance,
            transactionId,
          }),
        })
      } else {
        // Log regular transaction activity
        await tx.insert(activityLogs).values({
          id: nanoid(12),
          userId: data.userId,
          action: "created",
          entityType: "transaction",
          entityId: transactionId,
          metadata: JSON.stringify({
            amount: data.amount,
            type: data.type,
            categoryId: data.categoryId,
            walletId: data.walletId,
          }),
        })
      }

      // 4. Update user's streak
      await updateStreak(tx, data.userId)
    })

    // Revalidate pages
    revalidatePath("/dashboard")
    revalidatePath("/transactions")
    revalidatePath("/debts")

    return {
      success: true,
      transaction: { id: transactionId, ...data },
    }
  } catch (error: any) {
    console.error("Failed to create transaction:", error)
    return {
      success: false,
      error: error.message || "Failed to create transaction",
    }
  }
}

/**
 * Update user's streak when they create a transaction
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
 * Get dashboard data for a user
 */
export async function getDashboardData(userId: string) {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Get wallet balances
  const userWallets = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))

  // Get monthly income and expense
  const [monthlyIncome, monthlyExpense] = await Promise.all([
    db
      .select({ total: sql<number>`SUM(${transactions.amount})` })
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
      .select({ total: sql<number>`SUM(${transactions.amount})` })
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

  // Get debts
  const allDebts = await db.select().from(debts)

  // Get streak
  const userStreak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1)

  return {
    wallets: userWallets,
    monthlyIncome: monthlyIncome[0]?.total || 0,
    monthlyExpense: monthlyExpense[0]?.total || 0,
    debts: allDebts,
    streak: userStreak[0]?.currentStreak || 0,
  }
}
