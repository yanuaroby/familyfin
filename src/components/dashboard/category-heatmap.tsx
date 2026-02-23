"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { CategorySpending } from "@/lib/types"

interface CategoryHeatmapProps {
  data: CategorySpending[]
  title?: string
}

export function CategoryHeatmap({ data, title = "Spending by Category" }: CategoryHeatmapProps) {
  const COLORS = data.map((d) => d.color || "#8884d8")

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="font-medium">{data.categoryName}</span>
            <span className="text-sm text-muted-foreground">
              {formatCurrency(data.amount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {data.percentage.toFixed(1)}% of total
            </span>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart aspect={1.5}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="amount"
                nameKey="categoryName"
                label={(props: any) => {
                  const { categoryName, percentage } = props
                  return percentage > 5 ? `${categoryName}` : ""
                }}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={CustomTooltip} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
          {data.map((item, index) => (
            <div
              key={item.categoryId}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="flex-1 truncate">{item.categoryName}</span>
              <span className="font-medium text-muted-foreground">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
