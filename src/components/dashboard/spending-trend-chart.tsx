"use client"

import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpendingTrendChartProps {
  data: {
    date: string
    currentMonth: number
    previousMonth: number
  }[]
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  return (
    <section className="px-4 mb-6">
      <Card className="border-white/5 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-white">
            Tren Pengeluaran
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1a1a1a"
                  vertical={false}
                />
                
                <XAxis
                  dataKey="date"
                  fontSize={10}
                  tick={{ fill: "#a1a1a1" }}
                  tickLine={false}
                  axisLine={false}
                />
                
                <YAxis
                  fontSize={10}
                  tick={{ fill: "#a1a1a1" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${(value / 1000).toFixed(0)}k`}
                />
                
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-white/10 bg-black/90 p-2 shadow-lg backdrop-blur">
                          <p className="text-xs text-muted-foreground mb-1">
                            {payload[0]?.payload?.date}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500" />
                              <span className="text-xs text-emerald-500">
                                Bulan Ini: Rp
                                {(payload[0]?.value as number)?.toLocaleString("id-ID")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gray-500" />
                              <span className="text-xs text-gray-500">
                                Bulan Lalu: Rp
                                {(payload[1]?.value as number)?.toLocaleString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                
                <Line
                  type="monotone"
                  dataKey="currentMonth"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981" }}
                  name="Bulan Ini"
                />
                
                <Line
                  type="monotone"
                  dataKey="previousMonth"
                  stroke="#6b7280"
                  strokeWidth={2}
                  dot={false}
                  name="Bulan Lalu"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
