"use client"

import { motion } from "framer-motion"
import { Wallet as WalletIcon, Building2, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { Wallet } from "@/lib/db/schema"

interface WalletsSectionProps {
  wallets: (Wallet & { userName: string })[]
}

const walletIcons: Record<string, any> = {
  cash: WalletIcon,
  bank: Building2,
  credit_card: CreditCard,
}

const walletColors: Record<string, string> = {
  husband: "#3b82f6",
  wife: "#ec4899",
}

export function WalletsSection({ wallets }: WalletsSectionProps) {
  return (
    <section className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-white">Dompet Saya</h2>
        <button className="text-xs text-emerald-500 font-medium">
          Lihat Semua
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {wallets.map((wallet, index) => {
          const Icon = walletIcons[wallet.type] || WalletIcon
          const color = wallet.userName.toLowerCase().includes("husband")
            ? walletColors.husband
            : walletColors.wife

          return (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className="relative overflow-hidden border border-white/5 bg-card/50 backdrop-blur"
                style={{
                  borderColor: `${color}30`,
                  backgroundColor: `${color}08`,
                }}
              >
                {/* Gradient Background */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
                  }}
                />

                <CardContent className="p-3 relative">
                  {/* Icon */}
                  <div
                    className="h-8 w-8 rounded-lg mb-2 flex items-center justify-center"
                    style={{
                      backgroundColor: `${color}20`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>

                  {/* Wallet Name */}
                  <p className="text-xs text-muted-foreground mb-1">
                    {wallet.userName}
                  </p>

                  {/* Balance */}
                  <p
                    className="text-lg font-bold"
                    style={{ color }}
                  >
                    {formatCurrency(wallet.balance)}
                  </p>

                  {/* Wallet Type */}
                  <p className="text-[10px] text-muted-foreground mt-1 capitalize">
                    {wallet.type.replace("_", " ")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
