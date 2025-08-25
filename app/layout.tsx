import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zen Texts Translation Comparison",
  description: "Compare different translations of classic Zen texts",
  generator: "v0.dev",
  openGraph: {
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    url: "https://v0-compare-translation-apps.vercel.app",
    siteName: "Zen Texts Translation Comparison",
    images: [
      {
        url: "/xinxin-ming-cover.png",
        width: 1200,
        height: 630,
        alt: "Zen Texts Translation Comparison",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    images: ["/xinxin-ming-cover.png"],
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
          <PWALoader />
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
