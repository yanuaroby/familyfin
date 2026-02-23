"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PieChart, Plus, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUserBudgets, createBudget } from "@/server/actions/budgets"
import { formatCurrency } from "@/lib/utils"

const mockCategories = [
  { id: "4", name: "Household", color: "#f97316" },
  { id: "6", name: "Groceries", color: "#f59e0b" },
  { id: "8", name: "Transport", color: "#3b82f6" },
  { id: "9", name: "Fuel", color: "#2563eb" },
  { id: "14", name: "Food & Dining", color: "#8b5cf6" },
  { id: "15", name: "Restaurants", color: "#7c3aed" },
]

export default function BudgetsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [budgets, setBudgets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    categoryId: "",
    monthlyLimit: "",
    alertThreshold: "80",
  })

  useEffect(() => {
    loadBudgets()
  }, [])

  async function loadBudgets() {
    try {
      // Use mock user ID for now
      const userId = "1"
      const result = await getUserBudgets(userId)
      setBudgets(result)
    } catch (error) {
      console.error("Failed to load budgets:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const userId = "1" // From auth
      await createBudget({
        userId,
        categoryId: formData.categoryId,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        alertThreshold: parseInt(formData.alertThreshold),
      })

      setIsAddOpen(false)
      setFormData({ categoryId: "", monthlyLimit: "", alertThreshold: "80" })
      await loadBudgets()
    } catch (error) {
      console.error("Failed to create budget:", error)
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-emerald-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Anggaran</h1>
            <p className="text-xs text-muted-foreground">
              Track your spending limits
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Budget</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Set a monthly spending limit for a category.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      {mockCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="text-white"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Monthly Limit (IDR)</Label>
                  <Input
                    type="number"
                    placeholder="2000000"
                    value={formData.monthlyLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyLimit: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Alert Threshold (%)</Label>
                  <Input
                    type="number"
                    placeholder="80"
                    value={formData.alertThreshold}
                    onChange={(e) =>
                      setFormData({ ...formData, alertThreshold: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get notified when you reach this percentage
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Create Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-3 gap-3 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <PieChart className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
            <p className="text-sm font-bold text-white">
              {formatCurrency(totalBudget)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Spent</span>
            </div>
            <p className="text-sm font-bold text-red-500">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Left</span>
            </div>
            <p
              className={`text-sm font-bold ${
                totalRemaining >= 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {formatCurrency(totalRemaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <div className="px-4 space-y-3">
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <PieChart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No budgets yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first budget to track spending
            </p>
          </div>
        ) : (
          budgets.map((budget, index) => (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-white/5 bg-card/50 overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: budget.category.color }}
                      />
                      <span className="text-sm font-medium text-white">
                        {budget.category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {budget.isOverBudget && (
                        <Badge
                          variant="destructive"
                          className="bg-red-500/20 text-red-500 border-red-500/30"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Over
                        </Badge>
                      )}
                      {budget.isApproachingLimit && !budget.isOverBudget && (
                        <Badge
                          className="bg-orange-500/20 text-orange-500 border-orange-500/30"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Almost
                        </Badge>
                      )}
                      <span className="text-sm font-bold text-white">
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                  </div>

                  <Progress
                    value={budget.percentage}
                    className="h-2"
                    style={
                      {
                        "--progress-background": budget.isOverBudget
                          ? "#ef4444"
                          : budget.isApproachingLimit
                          ? "#f59e0b"
                          : "#10b981",
                      } as React.CSSProperties
                    }
                  />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {formatCurrency(budget.remaining)} left
                    </span>
                    <span className="text-muted-foreground">
                      {budget.percentage.toFixed(0)}% used
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
