"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Wallet, PlusCircle, Repeat, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModal } from "@/contexts/modal-provider"

const navItems = [
  { name: "Ringkasan", href: "/dashboard", icon: Home },
  { name: "Transaksi", href: "/transactions", icon: Wallet },
  { name: "Add", href: "#", icon: PlusCircle, isAction: true },
  { name: "Recurring", href: "/recurring", icon: Repeat },
  { name: "Akun", href: "/profile", icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { openTransactionModal } = useModal()
  const [isPressed, setIsPressed] = useState<number | null>(null)

  const handleAddClick = () => {
    openTransactionModal()
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-white/5" />
      
      {/* Navigation Items */}
      <div className="relative flex items-center justify-around h-16 pb-safe">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          const Icon = item.icon

          if (item.isAction) {
            // Center Action Button (Add)
            return (
              <button
                key={item.name}
                onClick={handleAddClick}
                className="relative -top-4"
                onTouchStart={() => setIsPressed(index)}
                onTouchEnd={() => setIsPressed(null)}
                onMouseDown={() => setIsPressed(index)}
                onMouseUp={() => setIsPressed(null)}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: isPressed === index ? 0.9 : 1 }}
                  className="relative"
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-lg opacity-50" />
                  
                  {/* Button */}
                  <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg border-2 border-white/10">
                    <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </button>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full"
              onTouchStart={() => setIsPressed(index)}
              onTouchEnd={() => setIsPressed(null)}
              onMouseDown={() => setIsPressed(index)}
              onMouseUp={() => setIsPressed(null)}
            >
              <motion.div
                className="relative flex flex-col items-center"
                animate={{ scale: isPressed === index ? 0.9 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 h-1 w-8 rounded-full bg-emerald-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
                
                {/* Icon */}
                <Icon
                  className={cn(
                    "h-6 w-6 mb-1 transition-colors",
                    isActive
                      ? "text-emerald-500"
                      : "text-gray-500"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive
                      ? "text-emerald-500"
                      : "text-gray-500"
                  )}
                >
                  {item.name}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
