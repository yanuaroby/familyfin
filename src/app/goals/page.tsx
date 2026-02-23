"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Target, Plus, Trophy, TrendingUp, Edit2, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  getUserGoals,
  createGoal,
  addGoalContribution,
  deleteGoal,
} from "@/server/actions/goals"
import { formatCurrency } from "@/lib/utils"

const goalIcons = ["🎯", "🏖️", "🏠", "🚗", "💰", "📚", "💻", "📱"]
const goalColors = [
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
]

export default function GoalsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isContributeOpen, setIsContributeOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    color: goalColors[0],
    icon: goalIcons[0],
    notes: "",
  })
  const [contributionAmount, setContributionAmount] = useState("")

  useEffect(() => {
    loadGoals()
  }, [])

  async function loadGoals() {
    try {
      const userId = "1" // From auth
      const result = await getUserGoals(userId)
      setGoals(result)
    } catch (error) {
      console.error("Failed to load goals:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const userId = "1"
      await createGoal({
        userId,
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline || undefined,
        color: formData.color,
        icon: formData.icon,
        notes: formData.notes || undefined,
      })

      setIsAddOpen(false)
      setFormData({
        name: "",
        targetAmount: "",
        deadline: "",
        color: goalColors[0],
        icon: goalIcons[0],
        notes: "",
      })
      await loadGoals()
    } catch (error) {
      console.error("Failed to create goal:", error)
    }
  }

  async function handleContribute() {
    try {
      if (!selectedGoal || !contributionAmount) return

      await addGoalContribution(selectedGoal.id, parseFloat(contributionAmount))
      setIsContributeOpen(false)
      setSelectedGoal(null)
      setContributionAmount("")
      await loadGoals()
    } catch (error) {
      console.error("Failed to add contribution:", error)
    }
  }

  async function handleDelete(goalId: string) {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      await deleteGoal(goalId)
      await loadGoals()
    } catch (error) {
      console.error("Failed to delete goal:", error)
    }
  }

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const completedGoals = goals.filter((g) => g.isCompleted).length

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
            <h1 className="text-lg font-bold text-white">Savings Goals</h1>
            <p className="text-xs text-muted-foreground">
              Track progress towards your dreams
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Goal</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Set a savings target and track your progress.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Goal Name</Label>
                  <Input
                    placeholder="e.g., Bali Vacation"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Target Amount (IDR)</Label>
                  <Input
                    type="number"
                    placeholder="15000000"
                    value={formData.targetAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, targetAmount: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Deadline (Optional)</Label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Icon</Label>
                  <div className="flex gap-2 flex-wrap">
                    {goalIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`text-2xl p-2 rounded-lg ${
                          formData.icon === icon
                            ? "bg-emerald-500/20 border-emerald-500"
                            : "bg-white/5 border-white/5"
                        } border`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {goalColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`h-8 w-8 rounded-full ${
                          formData.color === color ? "ring-2 ring-white" : ""
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any additional notes..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white resize-none"
                    rows={2}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  Create Goal
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
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Target</span>
            </div>
            <p className="text-sm font-bold text-white">
              {formatCurrency(totalTarget)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Saved</span>
            </div>
            <p className="text-sm font-bold text-emerald-500">
              {formatCurrency(totalSaved)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Done</span>
            </div>
            <p className="text-sm font-bold text-yellow-500">
              {completedGoals}/{goals.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Goals Grid */}
      <div className="px-4 grid gap-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No goals yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first savings goal
            </p>
          </div>
        ) : (
          goals.map((goal, index) => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="border-white/5 bg-card/50 overflow-hidden relative"
                  style={{
                    borderColor: `${goal.color}30`,
                  }}
                >
                  {/* Background Gradient */}
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      background: `linear-gradient(135deg, ${goal.color} 0%, transparent 100%)`,
                    }}
                  />

                  <CardContent className="p-4 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.icon}</span>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {goal.name}
                          </h3>
                          {goal.isCompleted && (
                            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 mt-1">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!goal.isCompleted && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedGoal(goal)
                              setIsContributeOpen(true)
                            }}
                            className="border-white/10 hover:bg-white/5"
                          >
                            Add
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(goal.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-emerald-500 font-bold">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      className="h-2 mb-2"
                      style={
                        {
                          "--progress-background": goal.color,
                        } as React.CSSProperties
                      }
                    />

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
                        to go
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: goal.color }}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </div>

                    {goal.deadline && (
                      <div className="mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground">
                        Target: {new Date(goal.deadline).toLocaleDateString("id-ID")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Contribute Dialog */}
      <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              Add to {selectedGoal?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              How much would you like to save?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Amount (IDR)</Label>
              <Input
                type="number"
                placeholder="1000000"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={handleContribute}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Add Contribution
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
