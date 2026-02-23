"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Tags, Plus, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/server/actions/categories"

interface CategoryWithSubs {
  id: string
  name: string
  type: string
  color: string
  icon?: string
  subCategories?: any[]
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ income: CategoryWithSubs[]; expense: CategoryWithSubs[] }>({
    income: [],
    expense: [],
  })
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [deletingCategory, setDeletingCategory] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense",
    parentId: "",
    color: "#888888",
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const result = await getCategories()
      const income = result.filter((c: any) => c.type === "income" && !c.parentId)
      const expense = result.filter((c: any) => c.type === "expense" && !c.parentId)
      const subCategories = result.filter((c: any) => c.parentId)

      const incomeWithSubs = income.map((parent: any) => ({
        ...parent,
        subCategories: subCategories.filter((sub: any) => sub.parentId === parent.id),
      }))

      const expenseWithSubs = expense.map((parent: any) => ({
        ...parent,
        subCategories: subCategories.filter((sub: any) => sub.parentId === parent.id),
      }))

      setCategories({ income: incomeWithSubs, expense: expenseWithSubs })
    } catch (error) {
      console.error("Failed to load categories:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          color: formData.color,
        })
      } else {
        await createCategory({
          name: formData.name,
          type: formData.type,
          parentId: formData.parentId || undefined,
          color: formData.color,
        })
      }

      setIsAddOpen(false)
      setEditingCategory(null)
      setFormData({ name: "", type: "expense", parentId: "", color: "#888888" })
      await loadCategories()
    } catch (error) {
      console.error("Failed to save category:", error)
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return

    try {
      const result = await deleteCategory(deletingCategory.id)
      if (result.success) {
        setDeletingCategory(null)
        await loadCategories()
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Failed to delete category:", error)
    }
  }

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const openEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      type: category.type,
      parentId: category.parentId || "",
      color: category.color,
    })
    setIsAddOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500">Loading...</div>
      </div>
    )
  }

  const CategoryItem = ({ category, isSub = false }: { category: any; isSub?: boolean }) => {
    const isExpanded = expandedCategories.includes(category.id)
    const hasSubs = category.subCategories && category.subCategories.length > 0

    return (
      <div className="space-y-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg border ${
            isSub ? "bg-white/5 ml-4" : "bg-card/50"
          } border-white/5`}
          style={!isSub ? { borderColor: `${category.color}30` } : {}}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasSubs && !isSub && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-white/5 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{category.name}</p>
              {hasSubs && !isSub && (
                <p className="text-xs text-muted-foreground">
                  {category.subCategories.length} sub-category{category.subCategories.length > 1 ? "ies" : "y"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEdit(category)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-400"
              onClick={() => setDeletingCategory(category)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Sub-categories */}
        {hasSubs && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 ml-4"
          >
            {category.subCategories.map((sub: any) => (
              <CategoryItem key={sub.id} category={sub} isSub />
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Categories</h1>
            <p className="text-xs text-muted-foreground">
              Manage your categories
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) {
              setEditingCategory(null)
              setFormData({ name: "", type: "expense", parentId: "", color: "#888888" })
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {editingCategory
                    ? "Update category details"
                    : "Create a new income or expense category"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Name</Label>
                  <Input
                    placeholder="e.g., Groceries"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                {!editingCategory && (
                  <div className="space-y-2">
                    <Label className="text-white">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "income" | "expense") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/10">
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-white">Parent Category (Optional)</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="None (Top Level)" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="">None (Top Level)</SelectItem>
                      {categories[formData.type]?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 bg-white/5 border-white/10"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories List */}
      <div className="p-4 space-y-6">
        {/* Income Categories */}
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              Income Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.income.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No income categories yet
              </p>
            ) : (
              categories.income.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categories.expense.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No expense categories yet
              </p>
            ) : (
              categories.expense.map((category) => (
                <CategoryItem key={category.id} category={category} />
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Category?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete the category "{deletingCategory?.name}".
              {deletingCategory?.subCategories?.length > 0 && (
                <span className="text-red-500 block mt-2">
                  Warning: This category has {deletingCategory.subCategories.length} sub-category(ies).
                  Please delete them first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
