"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, Download, Wallet, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { formatCurrency } from "@/lib/utils"

// Mock data for reports
const categoryData = [
  { name: "Household", value: 4500000, color: "#f97316" },
  { name: "Transport", value: 1500000, color: "#3b82f6" },
  { name: "Food & Dining", value: 2000000, color: "#8b5cf6" },
  { name: "Baby Supplies", value: 1800000, color: "#ec4899" },
  { name: "Shopping", value: 1200000, color: "#f43f5e" },
  { name: "Other", value: 800000, color: "#6b7280" },
]

const monthlyData = [
  { month: "Aug", income: 14500000, expense: 12000000, savings: 2500000 },
  { month: "Sep", income: 15000000, expense: 13500000, savings: 1500000 },
  { month: "Oct", income: 14500000, expense: 11000000, savings: 3500000 },
  { month: "Nov", income: 18000000, expense: 16000000, savings: 2000000 },
  { month: "Dec", income: 14500000, expense: 12500000, savings: 2000000 },
  { month: "Jan", income: 14500000, expense: 13685000, savings: 815000 },
]

const netWorthData = [
  { month: "Aug", value: 12000000 },
  { month: "Sep", value: 12500000 },
  { month: "Oct", value: 13200000 },
  { month: "Nov", value: 13500000 },
  { month: "Dec", value: 13800000 },
  { month: "Jan", value: 14000000 },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0)
  const totalExpense = monthlyData.reduce((sum, m) => sum + m.expense, 0)
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0)
  const savingsRate = (totalSavings / totalIncome) * 100

  const handleExport = () => {
    // Create CSV content
    const csvContent = "Month,Income,Expense,Savings\n" +
      monthlyData.map(m => `${m.month},${m.income},${m.expense},${m.savings}`).join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "financial-report.csv"
    a.click()
  }

  return (
    <div className="bg-black min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-white">Reports</h1>
            <p className="text-xs text-muted-foreground">
              Financial analytics & insights
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-white/10"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-2 gap-3 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-[10px] text-muted-foreground">Income</span>
            </div>
            <p className="text-sm font-bold text-emerald-500">
              {formatCurrency(totalIncome)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Last 6 months
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[10px] text-muted-foreground">Expense</span>
            </div>
            <p className="text-sm font-bold text-red-500">
              {formatCurrency(totalExpense)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Last 6 months
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <Wallet className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-[10px] text-muted-foreground">Savings</span>
            </div>
            <p className="text-sm font-bold text-blue-500">
              {formatCurrency(totalSavings)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {savingsRate.toFixed(1)}% rate
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-1 mb-1">
              <CreditCard className="h-3.5 w-3.5 text-orange-500" />
              <span className="text-[10px] text-muted-foreground">Net Worth</span>
            </div>
            <p className="text-sm font-bold text-orange-500">
              {formatCurrency(14000000)}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Current
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend Chart */}
      <div className="px-4 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Income vs Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="month" fontSize={10} tick={{ fill: "#a1a1a1" }} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tick={{ fill: "#a1a1a1" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${(v/1000000).toFixed(0)}M`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-white/10 bg-black/90 p-2 shadow-lg backdrop-blur">
                            <p className="text-xs text-muted-foreground mb-1">{payload[0]?.payload?.month}</p>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-xs text-emerald-500">Income: {formatCurrency(payload[0]?.value as number)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                <span className="text-xs text-red-500">Expense: {formatCurrency(payload[1]?.value as number)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="px-4 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-orange-500" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border border-white/10 bg-black/90 p-2 shadow-lg backdrop-blur">
                            <p className="text-sm font-medium text-white">{data.name}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(data.value)}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground flex-1">{item.name}</span>
                  <span className="text-white font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Net Worth Trend */}
      <div className="px-4 mb-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Net Worth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                <BarChart data={netWorthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                  <XAxis dataKey="month" fontSize={10} tick={{ fill: "#a1a1a1" }} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tick={{ fill: "#a1a1a1" }} tickLine={false} axisLine={false} tickFormatter={(v) => `Rp${(v/1000000).toFixed(1)}M`} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-white/10 bg-black/90 p-2 shadow-lg backdrop-blur">
                            <p className="text-xs text-muted-foreground mb-1">{payload[0]?.payload?.month}</p>
                            <span className="text-sm font-bold text-blue-500">
                              {formatCurrency(payload[0]?.value as number)}
                            </span>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Net Worth" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
