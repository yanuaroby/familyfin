"use server"

import { db } from "@/lib/db"
import { wallets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export interface CreateWalletData {
  name: string
  type: "cash" | "bank" | "credit_card"
  balance?: number
  currency?: string
  institution?: string
  color?: string
  icon?: string
  isDefault?: boolean
}

/**
 * Get all wallets for a user
 */
export async function getWallets(userId: string) {
  try {
    console.log("getWallets called with userId:", userId)
    const userWallets = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .orderBy(wallets.name)

    console.log("getWallets result:", userWallets)
    return userWallets
  } catch (error: any) {
    console.error("Failed to get wallets:", error)
    return []
  }
}

/**
 * Get all wallets (admin function)
 */
export async function getAllWallets() {
  try {
    const allWallets = await db
      .select()
      .from(wallets)
      .orderBy(wallets.name)

    return allWallets
  } catch (error: any) {
    console.error("Failed to get all wallets:", error)
    return []
  }
}

/**
 * Create a new wallet
 */
export async function createWallet(data: CreateWalletData & { userId: string }) {
  const walletId = nanoid(12)

  try {
    await db.insert(wallets).values({
      id: walletId,
      userId: data.userId,
      name: data.name,
      type: data.type,
      balance: data.balance || 0,
      currency: data.currency || "IDR",
      institution: data.institution,
      color: data.color || "#888888",
      icon: data.icon,
      isDefault: data.isDefault || false,
      createdAt: new Date().toISOString(),
    })

    revalidatePath("/dashboard")
    revalidatePath("/transactions")

    return {
      success: true,
      walletId,
    }
  } catch (error: any) {
    console.error("Failed to create wallet:", error)
    return {
      success: false,
      error: error.message || "Failed to create wallet",
    }
  }
}

/**
 * Update an existing wallet
 */
export async function updateWallet(
  walletId: string,
  data: { name?: string; balance?: number; color?: string; icon?: string }
) {
  try {
    await db
      .update(wallets)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(wallets.id, walletId))

    revalidatePath("/dashboard")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to update wallet:", error)
    return {
      success: false,
      error: error.message || "Failed to update wallet",
    }
  }
}

/**
 * Delete a wallet
 */
export async function deleteWallet(walletId: string) {
  try {
    await db.delete(wallets).where(eq(wallets.id, walletId))

    revalidatePath("/dashboard")
    revalidatePath("/transactions")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to delete wallet:", error)
    return {
      success: false,
      error: error.message || "Failed to delete wallet",
    }
  }
}
