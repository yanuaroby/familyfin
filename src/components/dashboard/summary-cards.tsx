"use client"

import { TrendingUp, TrendingDown, Wallet, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, calculatePercentageChange } from "@/lib/utils"
import type { FinancialSummary } from "@/lib/types"

interface FinancialSummaryCardsProps {
  summary: FinancialSummary
  previousMonthSummary?: FinancialSummary
}

export function FinancialSummaryCards({
  summary,
  previousMonthSummary,
}: FinancialSummaryCardsProps) {
  const cards = [
    {
      title: "Net Worth",
      value: summary.netWorth,
      icon: Wallet,
      description: "Total Assets - Total Debts",
      positive: summary.netWorth >= 0,
    },
    {
      title: "Monthly Cashflow",
      value: summary.cashflow,
      icon: TrendingUp,
      description: "Income - Expenses",
      positive: summary.cashflow >= 0,
    },
    {
      title: "Daily Burn Rate",
      value: summary.burnRate,
      icon: TrendingDown,
      description: "Average daily spending",
      positive: false,
    },
    {
      title: "Total Debts",
      value: summary.totalDebts,
      icon: CreditCard,
      description: "Outstanding balance",
      positive: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        const percentageChange = previousMonthSummary
          ? calculatePercentageChange(
              card.value,
              card.title === "Net Worth"
                ? previousMonthSummary.netWorth
                : card.title === "Monthly Cashflow"
                ? previousMonthSummary.cashflow
                : card.title === "Daily Burn Rate"
                ? previousMonthSummary.burnRate
                : previousMonthSummary.totalDebts
            )
          : 0

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon
                className={`h-4 w-4 ${
                  card.positive
                    ? "text-green-500"
                    : card.title === "Total Debts"
                    ? "text-red-500"
                    : "text-muted-foreground"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(card.value)}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{card.description}</span>
                {previousMonthSummary && (
                  <span
                    className={`flex items-center ${
                      percentageChange >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {percentageChange >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(percentageChange).toFixed(1)}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
