"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Pencil, Trash2, User, Calendar, Wallet, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction, Category, Wallet, User, Debt } from "@/lib/db/schema"

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: Transaction & {
    category?: Category
    wallet?: Wallet
    user?: User
    debt?: Debt
  } | null
  categories: Category[]
  wallets: Wallet[]
  users: User[]
  debts: Debt[]
  onEdit: (data: any) => void
  onDelete: () => void
}

export function TransactionDetailModal({
  isOpen,
  onClose,
  transaction,
  categories,
  wallets,
  users,
  debts,
  onEdit,
  onDelete,
}: TransactionDetailModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!transaction) return null

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Unknown"
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return "#888888"
    return categories.find((c) => c.id === categoryId)?.color || "#888888"
  }

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.name || "User"
  }

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || "Wallet"
  }

  const getDebtName = (debtId?: string) => {
    if (!debtId) return null
    return debts.find((d) => d.id === debtId)?.name || null
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      income: "Pemasukan",
      expense: "Pengeluaran",
      transfer: "Transfer",
      debt_repayment: "Pembayaran Hutang",
    }
    return labels[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      income: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      expense: "text-red-500 bg-red-500/10 border-red-500/20",
      transfer: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      debt_repayment: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    }
    return colors[type] || "text-gray-500 bg-gray-500/10 border-gray-500/20"
  }

  const handleDelete = () => {
    onDelete()
    setIsDeleteDialogOpen(false)
    onClose()
  }

  return (
    <>
      {/* Detail Modal */}
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white">Detail Transaksi</DialogTitle>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Amount */}
            <div className="text-center py-4">
              <span
                className={`text-3xl font-bold ${
                  transaction.type === "income"
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              <Badge className={`mt-2 ${getTypeColor(transaction.type)}`}>
                {getTypeLabel(transaction.type)}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getCategoryColor(transaction.categoryId)}20` }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Kategori</p>
                  <p className="text-sm font-medium text-white">
                    {getCategoryName(transaction.categoryId)}
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Tanggal</p>
                  <p className="text-sm font-medium text-white">
                    {formatDate(new Date(transaction.date))}
                  </p>
                </div>
              </div>

              {/* Wallet */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <Wallet className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Dompet</p>
                  <p className="text-sm font-medium text-white">
                    {getWalletName(transaction.walletId)}
                  </p>
                </div>
              </div>

              {/* User */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <User className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Dibuat oleh</p>
                  <p className="text-sm font-medium text-white">
                    {getUserName(transaction.userId)}
                  </p>
                </div>
              </div>

              {/* Debt (if applicable) */}
              {transaction.debtId && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Hutang</p>
                    <p className="text-sm font-medium text-white">
                      {getDebtName(transaction.debtId)}
                    </p>
                  </div>
                </div>
              )}

              {/* Note (if exists) */}
              {transaction.note && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Catatan</p>
                    <p className="text-sm text-white mt-1">
                      {transaction.note}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/5">
              <Button
                variant="outline"
                className="flex-1 border-white/10"
                onClick={() => {
                  setIsEditModalOpen(true)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Hapus Transaksi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tindakan ini tidak dapat dibatalkan. Transaksi akan dihapus secara permanen dan saldo dompet akan dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal (placeholder - will be implemented) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Edit Transaksi</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-muted-foreground text-center py-8">
              Edit functionality coming soon...
            </p>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </>
  )
}
