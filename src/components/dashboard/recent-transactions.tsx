"use client"

import { formatCurrency, formatDate } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Transaction, Category } from "@/lib/types"
import { ArrowUpRight, ArrowDownRight, Repeat, CreditCard } from "lucide-react"

interface RecentTransactionsProps {
  transactions: Transaction[]
  categories: Category[]
  limit?: number
  showViewAll?: boolean
}

export function RecentTransactions({
  transactions,
  categories,
  limit = 5,
  showViewAll = true,
}: RecentTransactionsProps) {
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#888888"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "expense":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case "transfer":
        return <Repeat className="h-4 w-4 text-blue-500" />
      case "debt_repayment":
        return <CreditCard className="h-4 w-4 text-orange-500" />
      default:
        return null
    }
  }

  const getTypeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "income":
        return "default"
      case "expense":
        return "destructive"
      case "transfer":
        return "outline"
      case "debt_repayment":
        return "secondary"
      default:
        return "default"
    }
  }

  const displayedTransactions = transactions.slice(0, limit)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        {showViewAll && (
          <Button variant="ghost" size="sm">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: getCategoryColor(transaction.categoryId),
                        }}
                      />
                      {getCategoryName(transaction.categoryId)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeVariant(transaction.type)} className="capitalize">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(transaction.type)}
                        {transaction.type.replace("_", " ")}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
