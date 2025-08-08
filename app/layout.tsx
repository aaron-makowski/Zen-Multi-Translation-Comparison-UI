import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zen Texts Translation Comparison",
  description: "Compare different translations of classic Zen texts",
  generator: "v0.dev",
  openGraph: {
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Zen Texts Translation Comparison",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
