import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Zen Texts Translation Comparison",
  description: "Compare different translations of classic Zen texts",
  openGraph: {
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    url: baseUrl,
    siteName: "Zen Texts Translation Comparison",
    images: [
      {
        url: `${baseUrl}/placeholder.jpg`,
        width: 1200,
        height: 630,
        alt: "Zen Texts Translation Comparison",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Texts Translation Comparison",
    description: "Compare different translations of classic Zen texts",
    images: [`${baseUrl}/placeholder.jpg`],
  },
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>{children}</body>
    </html>
  );
}
