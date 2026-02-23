"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Repeat, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Calendar, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  getRecurringTransactions,
  createRecurringTransaction,
  updateRecurringTransaction,
  deleteRecurringTransaction,
  toggleRecurringTransaction,
} from "@/server/actions/recurring"
import { getCategories } from "@/server/actions/categories"
import { mockAccounts } from "@/lib/store/mock-data"

const frequencyLabels: Record<string, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
  yearly: "Tahunan",
}

const typeLabels: Record<string, string> = {
  income: "Pemasukan",
  expense: "Pengeluaran",
  debt_repayment: "Bayar Hutang",
}

export default function RecurringPage() {
  const [recurring, setRecurring] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deletingItem, setDeletingItem] = useState<any>(null)

  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    walletId: "",
    debtId: "",
    type: "expense" as "income" | "expense" | "debt_repayment",
    note: "",
    frequency: "monthly" as "daily" | "weekly" | "monthly" | "yearly",
    startDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const userId = "1" // From auth
      const [recurringData, categoriesData] = await Promise.all([
        getRecurringTransactions(userId),
        getCategories(),
      ])
      setRecurring(recurringData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const userId = "1" // From auth

      if (editingItem) {
        await updateRecurringTransaction(editingItem.id, {
          amount: parseFloat(formData.amount),
          categoryId: formData.categoryId,
          note: formData.note,
          frequency: formData.frequency,
        })
      } else {
        await createRecurringTransaction({
          userId,
          amount: parseFloat(formData.amount),
          categoryId: formData.categoryId,
          walletId: formData.walletId,
          debtId: formData.debtId || undefined,
          type: formData.type,
          note: formData.note,
          frequency: formData.frequency,
          startDate: formData.startDate,
        })
      }

      setIsAddOpen(false)
      setEditingItem(null)
      setFormData({
        amount: "",
        categoryId: "",
        walletId: "",
        debtId: "",
        type: "expense",
        note: "",
        frequency: "monthly",
        startDate: new Date().toISOString().split("T")[0],
      })
      await loadData()
    } catch (error) {
      console.error("Failed to save recurring transaction:", error)
    }
  }

  async function handleDelete() {
    if (!deletingItem) return

    try {
      await deleteRecurringTransaction(deletingItem.id)
      setDeletingItem(null)
      await loadData()
    } catch (error) {
      console.error("Failed to delete recurring transaction:", error)
    }
  }

  async function handleToggle(id: string, isEnabled: boolean) {
    try {
      await toggleRecurringTransaction(id, !isEnabled)
      await loadData()
    } catch (error) {
      console.error("Failed to toggle recurring transaction:", error)
    }
  }

  const openEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      amount: item.amount.toString(),
      categoryId: item.categoryId,
      walletId: item.walletId,
      debtId: item.debtId || "",
      type: item.type,
      note: item.note || "",
      frequency: item.frequency,
      startDate: item.startDate,
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

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Recurring</h1>
            <p className="text-xs text-muted-foreground">
              Automated transactions
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) {
              setEditingItem(null)
              setFormData({
                amount: "",
                categoryId: "",
                walletId: "",
                debtId: "",
                type: "expense",
                note: "",
                frequency: "monthly",
                startDate: new Date().toISOString().split("T")[0],
              })
            }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0a0a0a] border-white/10 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingItem ? "Edit Recurring" : "Add Recurring Transaction"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {editingItem
                    ? "Update recurring transaction"
                    : "Set up automated recurring transactions"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "income" | "expense" | "debt_repayment") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="income">Pemasukan</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                      <SelectItem value="debt_repayment">Bayar Hutang</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Amount</Label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={setFormData}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      {categories
                        .filter(c => c.type === formData.type && !c.parentId)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Wallet</Label>
                  <Select
                    value={formData.walletId}
                    onValueChange={(value) => setFormData({ ...formData, walletId: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select wallet" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      {mockAccounts.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: "daily" | "weekly" | "monthly" | "yearly") =>
                      setFormData({ ...formData, frequency: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Start Date</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Note (Optional)</Label>
                  <Textarea
                    placeholder="e.g., Monthly salary"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="bg-white/5 border-white/10 resize-none"
                    rows={2}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {editingItem ? "Update" : "Create"} Recurring
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Recurring List */}
      <div className="p-4 space-y-4">
        {recurring.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Repeat className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No recurring transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first recurring transaction
            </p>
          </div>
        ) : (
          recurring.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-white/5 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <Repeat className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {typeLabels[item.type]}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {frequencyLabels[item.frequency]} • Next: {formatDate(new Date(item.nextRun))}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={item.isEnabled}
                      onCheckedChange={() => handleToggle(item.id, item.isEnabled)}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-emerald-500">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Started: {formatDate(new Date(item.startDate))}
                      </span>
                    </div>
                  </div>

                  {item.note && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {item.note}
                    </p>
                  )}

                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(item)}
                      className="text-muted-foreground hover:text-white"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingItem(item)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Recurring?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will stop the recurring transaction. Existing transactions will not be affected.
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
