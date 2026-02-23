"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Search, Filter, X, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"
import type { Transaction, Category, Wallet, User } from "@/lib/db/schema"

interface TransactionWithDetails {
  id: string
  amount: number
  date: string
  type: "income" | "expense" | "transfer" | "debt_repayment"
  categoryId?: string
  accountId?: string
  walletId?: string
  debtId?: string
  userId?: string
  note?: string | null
  createdAt?: string
  updatedAt?: string
  category?: Category
  wallet?: Wallet
  user?: User
  isRecurring?: boolean
  recurringTemplateId?: string
  receiptImage?: string | null
}

interface TransactionListProps {
  transactions: TransactionWithDetails[]
  categories: Array<{ id: string; name: string; type: "income" | "expense"; color?: string | null; parentId?: string | null }>
  wallets: Array<{ id: string; name: string; userId: string; balance?: number }>
  users: Array<{ id: string; name: string; email?: string }>
  onTransactionClick?: (transaction: TransactionWithDetails) => void
}

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
type FilterType = "all" | "income" | "expense" | "transfer" | "debt_repayment"

export function TransactionList({
  transactions,
  categories,
  wallets,
  users,
  onTransactionClick,
}: TransactionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [filterWallet, setFilterWallet] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    // Filter transactions
    let filtered = transactions.filter((tx) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const note = tx.note?.toLowerCase() || ""
        const amount = tx.amount.toString()
        if (!note.includes(query) && !amount.includes(query)) {
          return false
        }
      }

      // Type filter
      if (filterType !== "all" && tx.type !== filterType) {
        return false
      }

      // Wallet filter
      if (filterWallet !== "all" && tx.walletId !== filterWallet) {
        return false
      }

      // Category filter
      if (filterCategory !== "all" && tx.categoryId !== filterCategory) {
        return false
      }

      // User filter
      if (filterUser !== "all" && tx.userId !== filterUser) {
        return false
      }

      return true
    })

    // Sort transactions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
      }
    })

    // Group by date
    const groups: Record<string, TransactionWithDetails[]> = {}

    filtered.forEach((tx) => {
      const dateKey = tx.date
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(tx)
    })

    return groups
  }, [transactions, searchQuery, filterType, filterWallet, filterCategory, filterUser, sortBy])

  // Get date label
  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (dateString === today.toISOString().split("T")[0]) {
      return "Hari Ini"
    } else if (dateString === yesterday.toISOString().split("T")[0]) {
      return "Kemarin"
    } else {
      return format(date, "EEEE, d MMMM yyyy", { locale: id })
    }
  }

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return "#888888"
    return categories.find((c) => c.id === categoryId)?.color || "#888888"
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Unknown"
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  const getUserName = (userId?: string) => {
    return users.find((u) => u.id === userId)?.name || "User"
  }

  const getWalletName = (walletId?: string) => {
    return wallets.find((w) => w.id === walletId)?.name || "Wallet"
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      income: "text-emerald-500 bg-emerald-500/10",
      expense: "text-red-500 bg-red-500/10",
      transfer: "text-blue-500 bg-blue-500/10",
      debt_repayment: "text-orange-500 bg-orange-500/10",
    }
    return colors[type] || "text-gray-500 bg-gray-500/10"
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      income: "Pemasukan",
      expense: "Pengeluaran",
      transfer: "Transfer",
      debt_repayment: "Bayar Hutang",
    }
    return labels[type] || type
  }

  const activeFiltersCount = [filterType, filterWallet, filterCategory, filterUser].filter(
    (f) => f !== "all"
  ).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative border-white/10">
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/10 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">Filter Transaksi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Tipe</label>
                <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Semua tipe" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                    <SelectItem value="debt_repayment">Bayar Hutang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Wallet Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Dompet</label>
                <Select value={filterWallet} onValueChange={setFilterWallet}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Semua dompet" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="all">Semua Dompet</SelectItem>
                    {wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Kategori</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Semua kategori" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.filter(c => !c.parentId).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* User Filter */}
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">User</label>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Semua user" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10">
                    <SelectItem value="all">Semua User</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full border-white/10"
                onClick={() => {
                  setFilterType("all")
                  setFilterWallet("all")
                  setFilterCategory("all")
                  setFilterUser("all")
                }}
              >
                Reset Filter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[150px] bg-white/5 border-white/10 text-white">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0a0a] border-white/10">
            <SelectItem value="date-desc">Terbaru</SelectItem>
            <SelectItem value="date-asc">Terlama</SelectItem>
            <SelectItem value="amount-desc">Nilai Tertinggi</SelectItem>
            <SelectItem value="amount-asc">Nilai Terendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction List */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-12">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Tidak ada transaksi ditemukan</p>
            <p className="text-sm text-muted-foreground mt-1">
              Coba ubah filter atau pencarian
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, txs]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm py-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {getDateLabel(date)}
                </h3>
              </div>

              {/* Transactions */}
              {txs.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onTransactionClick?.(tx)}
                  className="cursor-pointer"
                >
                  <Card className="border-white/5 bg-card/50 hover:bg-white/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Category Icon */}
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${getCategoryColor(tx.categoryId)}20` }}
                        >
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: getCategoryColor(tx.categoryId) }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {getCategoryName(tx.categoryId)}
                            </span>
                            <Badge className={`text-[10px] ${getTypeColor(tx.type)}`}>
                              {getTypeLabel(tx.type)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {getWalletName(tx.walletId)}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {getUserName(tx.userId)}
                            </span>
                          </div>
                          {tx.note && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {tx.note}
                            </p>
                          )}
                        </div>

                        {/* Amount */}
                        <div className="text-right flex-shrink-0">
                          <span
                            className={`text-sm font-bold ${
                              tx.type === "income"
                                ? "text-emerald-500"
                                : "text-red-500"
                            }`}
                          >
                            {tx.type === "income" ? "+" : "-"}
                            {formatCurrency(tx.amount)}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(tx.date), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
