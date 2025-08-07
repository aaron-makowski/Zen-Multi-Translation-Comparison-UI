"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ResetRequestPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      return
    }
    setSent(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {sent ? (
          <p className="text-green-600 text-sm text-center">Check your email for a reset link.</p>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </>
        )}
      </form>
    </main>
  )
}
