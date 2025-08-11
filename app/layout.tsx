import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zen Texts Translation Comparison",
  description: "Compare different translations of classic Zen texts",
  generator: "v0.dev",
  openGraph: {
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    url: "https://example.com",
    siteName: "Zen Texts Translation Comparison",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
