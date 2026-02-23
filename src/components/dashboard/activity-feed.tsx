"use client"

import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  User,
  PlusCircle,
  Pencil,
  Trash2,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ActivityLog } from "@/lib/db/schema"

interface ActivityFeedProps {
  activities: (ActivityLog & { userName?: string })[]
}

const actionIcons: Record<string, any> = {
  created: PlusCircle,
  updated: Pencil,
  deleted: Trash2,
  debt_payment: CreditCard,
}

const entityColors: Record<string, string> = {
  transaction: "bg-blue-500",
  debt: "bg-red-500",
  category: "bg-green-500",
  budget: "bg-purple-500",
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActionText = (activity: ActivityLog) => {
    const icon = actionIcons[activity.action] || PlusCircle

    let actionText = ""
    let typeText = ""

    switch (activity.action) {
      case "created":
        actionText = "added"
        typeText = "a"
        break
      case "updated":
        actionText = "updated"
        typeText = ""
        break
      case "deleted":
        actionText = "deleted"
        typeText = ""
        break
      case "debt_payment":
        actionText = "made a payment on"
        typeText = ""
        break
      default:
        actionText = activity.action
        typeText = "a"
    }

    const entityType = activity.entityType
      .replace("_", " ")
      .toLowerCase()

    return { icon: icon, actionText, typeText, entityType }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent activity
            </p>
          ) : (
            activities.map((activity, index) => {
              const { icon: Icon, actionText, typeText, entityType } =
                getActionText(activity)
              const color =
                entityColors[activity.entityType] || "bg-gray-500"

              let metadata
              try {
                metadata = activity.metadata ? JSON.parse(activity.metadata) : null
              } catch {
                metadata = null
              }

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.userName || "User"}
                      </span>{" "}
                      {actionText} {typeText}{" "}
                      <span className="font-medium capitalize">
                        {entityType}
                      </span>
                      {metadata?.amount && (
                        <span className="text-muted-foreground ml-1">
                          ({new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(metadata.amount)})
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {activity.action === "debt_payment" && metadata && (
                        <Badge variant="secondary" className="text-xs">
                          {metadata.previousBalance > metadata.newBalance
                            ? "↓ Balance Reduced"
                            : "Balance Updated"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
