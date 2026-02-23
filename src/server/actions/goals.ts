"use server"

import { db } from "@/lib/db"
import { goals } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export interface CreateGoalData {
  userId: string
  name: string
  targetAmount: number
  deadline?: string
  color?: string
  icon?: string
  notes?: string
}

/**
 * Get all goals for a user
 */
export async function getUserGoals(userId: string) {
  try {
    const userGoals = await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(goals.createdAt)

    return userGoals
  } catch (error: any) {
    console.error("Failed to get goals:", error)
    return []
  }
}

/**
 * Create a new savings goal
 */
export async function createGoal(data: CreateGoalData) {
  const goalId = nanoid(12)

  try {
    await db.insert(goals).values({
      id: goalId,
      userId: data.userId,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      deadline: data.deadline,
      color: data.color || "#10b981",
      icon: data.icon || "🎯",
      notes: data.notes,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidatePath("/goals")
    revalidatePath("/dashboard")

    return {
      success: true,
      goalId,
    }
  } catch (error: any) {
    console.error("Failed to create goal:", error)
    return {
      success: false,
      error: error.message || "Failed to create goal",
    }
  }
}

/**
 * Add contribution to a goal
 */
export async function addGoalContribution(goalId: string, amount: number) {
  try {
    const goal = await db
      .select()
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1)

    if (goal.length === 0) {
      return {
        success: false,
        error: "Goal not found",
      }
    }

    const currentGoal = goal[0]
    const newAmount = Math.min(currentGoal.currentAmount + amount, currentGoal.targetAmount)
    const isCompleted = newAmount >= currentGoal.targetAmount

    await db
      .update(goals)
      .set({
        currentAmount: newAmount,
        isCompleted,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(goals.id, goalId))

    revalidatePath("/goals")

    return {
      success: true,
      newAmount,
      isCompleted,
    }
  } catch (error: any) {
    console.error("Failed to add contribution:", error)
    return {
      success: false,
      error: error.message || "Failed to add contribution",
    }
  }
}

/**
 * Update a goal
 */
export async function updateGoal(
  goalId: string,
  data: {
    name?: string
    targetAmount?: number
    deadline?: string
    color?: string
    notes?: string
  }
) {
  try {
    await db
      .update(goals)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(goals.id, goalId))

    revalidatePath("/goals")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to update goal:", error)
    return {
      success: false,
      error: error.message || "Failed to update goal",
    }
  }
}

/**
 * Delete a goal
 */
export async function deleteGoal(goalId: string) {
  try {
    await db.delete(goals).where(eq(goals.id, goalId))

    revalidatePath("/goals")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to delete goal:", error)
    return {
      success: false,
      error: error.message || "Failed to delete goal",
    }
  }
}

/**
 * Reset a goal (set current amount back to 0)
 */
export async function resetGoal(goalId: string) {
  try {
    await db
      .update(goals)
      .set({
        currentAmount: 0,
        isCompleted: false,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(goals.id, goalId))

    revalidatePath("/goals")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to reset goal:", error)
    return {
      success: false,
      error: error.message || "Failed to reset goal",
    }
  }
}
