"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRightLeft, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import type { Wallet as WalletType } from "@/lib/db/schema"

interface WalletTransferModalProps {
  isOpen: boolean
  onClose: () => void
  wallets: WalletType[]
  onSubmit: (data: any) => void
}

export function WalletTransferModal({
  isOpen,
  onClose,
  wallets,
  onSubmit,
}: WalletTransferModalProps) {
  const [fromWalletId, setFromWalletId] = useState("")
  const [toWalletId, setToWalletId] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const formatAmountDisplay = (value: string) => {
    const numeric = value.replace(/\D/g, "")
    const withoutLeadingZeros = numeric.replace(/^0+/, "") || ""
    if (!withoutLeadingZeros) return ""
    const withSeparators = withoutLeadingZeros.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    return withSeparators
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const rawValue = value.replace(/\./g, "")
    const formatted = formatAmountDisplay(rawValue)
    setAmount(rawValue)
  }

  const displayAmount = amount ? `Rp ${formatAmountDisplay(amount)}` : ""

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fromWalletId || !toWalletId || !amount) return
    
    onSubmit({
      fromWalletId,
      toWalletId,
      amount: parseFloat(amount),
      note,
      date: new Date().toISOString().split("T")[0],
    })
    
    // Reset form
    setFromWalletId("")
    setToWalletId("")
    setAmount("")
    setNote("")
    onClose()
  }

  // Filter out selected wallet from "to" options
  const availableToWallets = wallets.filter(w => w.id !== fromWalletId)
  const availableFromWallets = wallets.filter(w => w.id !== toWalletId)

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
            className="fixed inset-x-0 bottom-0 z-50 bg-[#0a0a0a] rounded-t-3xl border-t border-white/10 h-full max-h-full"
          >
            {/* Handle Bar */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="h-1 w-12 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold">Transfer Antar Dompet</h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form */}
            <div className="h-[calc(100vh-140px)] overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="space-y-4 pb-20">
                {/* From Wallet */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Dari Dompet</Label>
                  <Select value={fromWalletId} onValueChange={setFromWalletId} required>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Pilih dompet asal" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      {availableFromWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} - {formatCurrency(wallet.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Arrow Icon */}
                <div className="flex justify-center">
                  <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* To Wallet */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Ke Dompet</Label>
                  <Select value={toWalletId} onValueChange={setToWalletId} required>
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Pilih dompet tujuan" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10">
                      {availableToWallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          {wallet.name} - {formatCurrency(wallet.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                {/* Note */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Catatan (Opsional)</Label>
                  <Textarea
                    placeholder="Transfer untuk..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-white/5 border-white/10 resize-none"
                    rows={2}
                  />
                </div>

                {/* Info Card */}
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div className="text-sm text-emerald-500">
                      <p className="font-medium mb-1">Info Transfer</p>
                      <ul className="text-xs text-emerald-500/80 space-y-1">
                        <li>• Saldo dompet asal akan berkurang</li>
                        <li>• Saldo dompet tujuan akan bertambah</li>
                        <li>• Tidak ada kategori yang diperlukan</li>
                        <li>• Transfer tercatat di riwayat</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Footer with Submit Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0a0a0a]">
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold glow-green"
              >
                Transfer Sekarang
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
