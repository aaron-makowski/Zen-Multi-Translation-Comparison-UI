"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const [dbStatus, setDbStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        const response = await fetch("/api/db-check")
        const data = await response.json()

        if (response.ok && data.status === "ok") {
          setDbStatus("connected")
        } else {
          setDbStatus("error")
          setErrorMessage(data.message || "Unknown database error")
        }
      } catch (error) {
        setDbStatus("error")
        setErrorMessage("Failed to check database connection")
        console.error(error)
      }
    }

    checkDatabase()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Zen Texts Translation Comparison</h1>

        <div className="mb-6 p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Database Status</h2>
          {dbStatus === "loading" && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
              <p>Checking database connection...</p>
            </div>
          )}

          {dbStatus === "connected" && (
            <div className="text-green-600">
              <p>✓ Database connected successfully</p>
            </div>
          )}

          {dbStatus === "error" && (
            <div className="text-red-600">
              <p>✗ Database connection error</p>
              {errorMessage && <p className="text-sm mt-1">{errorMessage}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Explore Translations</h2>
            <p className="text-gray-600 mb-4">Browse through different translations of classic Zen texts.</p>
            <Button className="w-full" asChild>
              <Link href="/books">View Books</Link>
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Compare Translations</h2>
            <p className="text-gray-600 mb-4">Compare different translations side by side.</p>
            <Button className="w-full" asChild>
              <Link href="/compare">Compare Translations</Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About This Project</h2>
          <p className="text-gray-600 mb-4">
            This application allows you to explore and compare different translations of classic Zen texts. You can
            browse through books, read verses, and compare how different translators have interpreted the same text.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
