import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/contexts/session-provider"
import { ModalProvider } from "@/contexts/modal-provider"
import { BottomNav } from "@/components/shared/bottom-nav"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "UsFin - Shared Family Cashflow",
  description: "A premium shared family finance tracker with gamification",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UsFin",
  },
  themeColor: "#000000",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
      >
        <SessionProvider>
          <ModalProvider>
            <div className="relative min-h-screen pb-20 md:pb-0">
              {children}
              <BottomNav />
            </div>
          </ModalProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
