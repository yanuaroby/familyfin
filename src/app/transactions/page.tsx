"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionDetailModal } from "@/components/transactions/transaction-detail-modal"
import { AddTransactionModal } from "@/components/transactions/add-transaction-modal"
import { WalletTransferModal } from "@/components/transactions/wallet-transfer-modal"
import { useModal } from "@/contexts/modal-provider"
import { getCategories } from "@/server/actions/categories"
import { getWallets } from "@/server/actions/wallets"
import type { TransactionFormData } from "@/lib/types"

export default function TransactionsPage() {
  const { isTransactionModalOpen, closeTransactionModal, openTransactionModal } = useModal()
  const [transactions, setTransactions] = useState<any[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [wallets, setWallets] = useState<any[]>([])

  useEffect(() => {
    loadCategoriesAndWallets()
  }, [])

  async function loadCategoriesAndWallets() {
    try {
      const userId = "default_user"
      const [cats, wals] = await Promise.all([
        getCategories(),
        getWallets(userId),
      ])
      setCategories(cats)
      setWallets(wals)
    } catch (error) {
      console.error("Failed to load categories and wallets:", error)
    }
  }

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction = {
      id: String(Date.now()),
      ...data,
      userId: data.payer === "husband" ? "1" : "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions([newTransaction, ...transactions])
    closeTransactionModal()
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction)
    setIsDetailOpen(true)
  }

  const handleDeleteTransaction = () => {
    // Remove the transaction from list
    setTransactions(transactions.filter(t => t.id !== selectedTransaction?.id))
    setSelectedTransaction(null)
  }

  const handleEditTransaction = (data: any) => {
    // Update the transaction in list
    setTransactions(transactions.map(t => 
      t.id === selectedTransaction?.id ? { ...t, ...data } : t
    ))
    setSelectedTransaction(null)
  }

  const handleTransfer = (data: any) => {
    // Create transfer transaction
    const transferTransaction = {
      id: String(Date.now()),
      type: "transfer" as const,
      amount: data.amount,
      date: data.date,
      categoryId: "", // No category for transfers
      accountId: "", // No account for transfers
      walletId: data.fromWalletId,
      userId: "1",
      note: data.note || `Transfer to ${data.toWalletId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTransactions([transferTransaction, ...transactions])
    setIsTransferOpen(false)
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Transaksi</h1>
            <p className="text-xs text-muted-foreground">
              All your transactions
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10"
            onClick={() => setIsTransferOpen(true)}
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Transfer
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-4">
        <TransactionList
          transactions={transactions}
          categories={categories}
          wallets={wallets}
          users={[]}
          onTransactionClick={handleTransactionClick}
        />
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openTransactionModal}
        className="fixed bottom-24 right-4 h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg glow-green z-50 md:hidden"
      >
        <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
      </motion.button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={closeTransactionModal}
        categories={categories}
        wallets={wallets}
        debts={[]}
        onSubmit={handleAddTransaction}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedTransaction(null)
        }}
        transaction={selectedTransaction}
        categories={categories}
        wallets={wallets}
        users={[]}
        debts={[]}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Wallet Transfer Modal */}
      <WalletTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        wallets={wallets}
        onSubmit={handleTransfer}
      />
    </div>
  )
}
