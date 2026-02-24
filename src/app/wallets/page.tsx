"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Plus, Pencil, Trash2, Building2, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { formatCurrency } from "@/lib/utils"
import { getWallets, createWallet, updateWallet, deleteWallet } from "@/server/actions/wallets"

const walletIcons: Record<string, any> = {
  cash: Wallet,
  bank: Building2,
  credit_card: CreditCard,
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingWallet, setEditingWallet] = useState<any>(null)
  const [deletingWallet, setDeletingWallet] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    type: "cash" as "cash" | "bank" | "credit_card",
    balance: "",
    institution: "",
    color: "#22c55e",
  })

  useEffect(() => {
    loadWallets()
  }, [])

  async function loadWallets() {
    try {
      const userId = "default_user"
      const result = await getWallets(userId)
      setWallets(result)
    } catch (error) {
      console.error("Failed to load wallets:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      const userId = "default_user"
      
      if (editingWallet) {
        await updateWallet(editingWallet.id, {
          name: formData.name,
          balance: parseFloat(formData.balance) || 0,
          color: formData.color,
        })
      } else {
        await createWallet({
          userId,
          name: formData.name,
          type: formData.type,
          balance: parseFloat(formData.balance) || 0,
          color: formData.color,
          institution: formData.institution || undefined,
        })
      }

      setIsAddOpen(false)
      setEditingWallet(null)
      setFormData({
        name: "",
        type: "cash",
        balance: "",
        institution: "",
        color: "#22c55e",
      })
      await loadWallets()
    } catch (error) {
      console.error("Failed to save wallet:", error)
    }
  }

  async function handleDelete() {
    if (!deletingWallet) return

    try {
      await deleteWallet(deletingWallet.id)
      setDeletingWallet(null)
      await loadWallets()
    } catch (error) {
      console.error("Failed to delete wallet:", error)
    }
  }

  const openEdit = (wallet: any) => {
    setEditingWallet(wallet)
    setFormData({
      name: wallet.name,
      type: wallet.type,
      balance: String(wallet.balance || 0),
      institution: wallet.institution || "",
      color: wallet.color || "#22c55e",
    })
    setIsAddOpen(true)
  }

  const totalBalance = wallets.reduce((sum, w) => sum + (w.balance || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
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
            <h1 className="text-lg font-bold text-white">Dompet Saya</h1>
            <p className="text-xs text-muted-foreground">
              Manage your wallets
            </p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) {
              setEditingWallet(null)
              setFormData({
                name: "",
                type: "cash",
                balance: "",
                institution: "",
                color: "#22c55e",
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
                  {editingWallet ? "Edit Wallet" : "Add Wallet"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {editingWallet
                    ? "Update wallet information"
                    : "Create a new wallet to track your money"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Wallet Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g., BCA, Cash, Mandiri"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "cash" | "bank" | "credit_card") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Initial Balance (IDR)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                {formData.type === "bank" && (
                  <div className="space-y-2">
                    <Label className="text-white">Bank Name (Optional)</Label>
                    <Input
                      type="text"
                      placeholder="e.g., Bank Central Asia"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`h-8 w-8 rounded-full border-2 ${
                          formData.color === color ? "border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {editingWallet ? "Update" : "Create"} Wallet
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="p-4">
        <Card className="border-white/5 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <p className="text-3xl font-bold text-emerald-500">
              {formatCurrency(totalBalance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallets List */}
      <div className="px-4 space-y-3">
        {wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No wallets yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first wallet to get started
            </p>
          </div>
        ) : (
          wallets.map((wallet, index) => {
            const Icon = walletIcons[wallet.type] || Wallet
            return (
              <motion.div
                key={wallet.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-white/5 bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${wallet.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: wallet.color }} />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {wallet.name}
                          </h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {wallet.type.replace("_", " ")}
                            {wallet.institution && ` • ${wallet.institution}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-lg font-bold"
                          style={{ color: wallet.color }}
                        >
                          {formatCurrency(wallet.balance || 0)}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => openEdit(wallet)}
                            className="text-xs text-emerald-500 hover:text-emerald-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingWallet(wallet)}
                            className="text-xs text-red-500 hover:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingWallet} onOpenChange={() => setDeletingWallet(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Wallet?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete &quot;{deletingWallet?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
