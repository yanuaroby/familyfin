"use server"

import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"

export interface CreateCategoryData {
  name: string
  type: "income" | "expense"
  parentId?: string
  color?: string
  icon?: string
}

/**
 * Get all categories for a user
 */
export async function getCategories() {
  try {
    console.log("getCategories called")
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.type, categories.name)

    console.log("getCategories result:", allCategories.length, "categories")
    return allCategories
  } catch (error: any) {
    console.error("Failed to get categories:", error)
    return []
  }
}

/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryData) {
  const categoryId = nanoid(12)

  try {
    await db.insert(categories).values({
      id: categoryId,
      name: data.name,
      type: data.type,
      parentId: data.parentId,
      color: data.color || "#888888",
      icon: data.icon,
      isDefault: false,
      createdAt: new Date().toISOString(),
    })

    revalidatePath("/categories")
    revalidatePath("/dashboard")
    revalidatePath("/transactions")

    return {
      success: true,
      categoryId,
    }
  } catch (error: any) {
    console.error("Failed to create category:", error)
    return {
      success: false,
      error: error.message || "Failed to create category",
    }
  }
}

/**
 * Update an existing category
 */
export async function updateCategory(
  categoryId: string,
  data: { name?: string; color?: string; icon?: string }
) {
  try {
    await db
      .update(categories)
      .set({
        ...data,
      })
      .where(eq(categories.id, categoryId))

    revalidatePath("/categories")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to update category:", error)
    return {
      success: false,
      error: error.message || "Failed to update category",
    }
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(categoryId: string) {
  try {
    // Check if category has sub-categories
    const subCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, categoryId))

    if (subCategories.length > 0) {
      return {
        success: false,
        error: "Cannot delete category with sub-categories. Delete sub-categories first.",
      }
    }

    // Check if category is used in any transactions
    // (This is a simplified check - in production you'd want to handle this better)

    await db.delete(categories).where(eq(categories.id, categoryId))

    revalidatePath("/categories")

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("Failed to delete category:", error)
    return {
      success: false,
      error: error.message || "Failed to delete category",
    }
  }
}

/**
 * Get categories grouped by type and parent
 */
export async function getGroupedCategories() {
  const allCategories = await getCategories()

  const incomeCategories = allCategories.filter(c => c.type === "income" && !c.parentId)
  const expenseCategories = allCategories.filter(c => c.type === "expense" && !c.parentId)
  const subCategories = allCategories.filter(c => c.parentId)

  // Group sub-categories by parent
  const incomeCategoriesWithSubs = incomeCategories.map(parent => ({
    ...parent,
    subCategories: subCategories.filter(sub => sub.parentId === parent.id),
  }))

  const expenseCategoriesWithSubs = expenseCategories.map(parent => ({
    ...parent,
    subCategories: subCategories.filter(sub => sub.parentId === parent.id),
  }))

  return {
    income: incomeCategoriesWithSubs,
    expense: expenseCategoriesWithSubs,
    all: allCategories,
  }
}
