"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn, formatCurrency } from "@/lib/utils"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Array<{ id: string; name: string; type: "income" | "expense"; color?: string | null; parentId?: string | null }>
  wallets: Array<{ id: string; name: string; userId: string; balance?: number }>
  debts: Array<{ id: string; name: string; remainingBalance: number }>
  onSubmit: (data: any) => void
}

export function AddTransactionModal({
  isOpen,
  onClose,
  categories,
  wallets,
  debts,
  onSubmit,
}: AddTransactionModalProps) {
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  const [payer, setPayer] = useState<"husband" | "wife">("husband")
  const [amount, setAmount] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [walletId, setWalletId] = useState("")
  const [debtId, setDebtId] = useState("")
  const [note, setNote] = useState("")

  // Format amount for display (remove leading zeros, add Rp with thousand separators)
  const formatAmountDisplay = (value: string) => {
    // Remove non-numeric characters
    const numeric = value.replace(/\D/g, "")
    // Remove leading zeros
    const withoutLeadingZeros = numeric.replace(/^0+/, "") || ""
    
    if (!withoutLeadingZeros) return ""
    
    // Add thousand separators
    const withSeparators = withoutLeadingZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    
    return withSeparators
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Remove thousand separators for storage
    const rawValue = value.replace(/\./g, "")
    // Format for display
    const formatted = formatAmountDisplay(rawValue)
    setAmount(rawValue)
  }

  const displayAmount = amount ? `Rp ${formatAmountDisplay(amount)}` : ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      amount: parseFloat(amount),
      type: transactionType,
      categoryId,
      walletId,
      debtId: transactionType === "expense" && debtId ? debtId : undefined,
      payer,
      note,
      date: new Date().toISOString().split("T")[0],
    })
    onClose()
    // Reset form
    setAmount("")
    setCategoryId("")
    setWalletId("")
    setDebtId("")
    setNote("")
  }

  const filteredCategories = categories.filter(
    (c) => c.type === transactionType && !c.parentId
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[60] bg-[#0a0a0a] rounded-t-3xl border-t border-white/10 h-full max-h-full"
          >
            {/* Handle Bar */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h2 className="text-lg font-bold">Tambah Transaksi</h2>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-200px)] overflow-y-auto p-4 pb-24 md:pb-20">
              <div className="space-y-4">
              {/* Payer Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPayer("husband")}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2",
                    payer === "husband"
                      ? "bg-blue-500/20 border-blue-500 text-blue-500"
                      : "bg-white/5 border-white/5 text-muted-foreground"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Suami</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPayer("wife")}
                  className={cn(
                    "flex-1 py-3 rounded-xl border transition-all flex items-center justify-center gap-2",
                    payer === "wife"
                      ? "bg-pink-500/20 border-pink-500 text-pink-500"
                      : "bg-white/5 border-white/5 text-muted-foreground"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="font-medium">Istri</span>
                </button>
              </div>

              {/* Type Toggle */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTransactionType("expense")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    transactionType === "expense"
                      ? "bg-red-500 text-white"
                      : "text-muted-foreground"
                  )}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("income")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                    transactionType === "income"
                      ? "bg-emerald-500 text-white"
                      : "text-muted-foreground"
                  )}
                >
                  Pemasukan
                </button>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Jumlah</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-emerald-500">
                    Rp
                  </span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="pl-14 text-2xl font-bold bg-white/5 border-white/10 text-center text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Kategori</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Wallet */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Dompet</Label>
                <Select value={walletId} onValueChange={setWalletId} required>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Pilih dompet" />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets.length > 0 ? (
                      wallets
                        .filter((w) => {
                          const ownerName = w.userId === "1" ? "husband" : "wife"
                          return ownerName.includes(payer)
                        })
                        .map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.name}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="default">Cash</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Debt Selector (for expense) */}
              {transactionType === "expense" && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Link ke Hutang (Opsional)
                  </Label>
                  <Select value={debtId || "none"} onValueChange={(value) => setDebtId(value === "none" ? "" : value)}>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Tidak ada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tidak ada</SelectItem>
                      {debts.map((debt) => (
                        <SelectItem key={debt.id} value={debt.id}>
                          {debt.name} - {formatCurrency(debt.remainingBalance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Note */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Catatan</Label>
                <Textarea
                  placeholder="Tambahkan catatan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-white/5 border-white/10 resize-none"
                  rows={2}
                />
              </div>
              </div>
            </div>

            {/* Fixed Footer with Submit Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0a0a0a]">
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold glow-green"
              >
                Simpan Transaksi
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
