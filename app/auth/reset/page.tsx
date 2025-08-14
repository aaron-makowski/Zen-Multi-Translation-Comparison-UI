"use client"

import { useState } from "react"
<<<<<<< HEAD
=======
import { Button } from "@/components/ui/button"
>>>>>>> origin/codex/implement-auth-routes-and-features

export default function ResetRequestPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
<<<<<<< HEAD

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch("/api/auth/reset", {
=======
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/auth/reset", {
>>>>>>> origin/codex/implement-auth-routes-and-features
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
<<<<<<< HEAD
    setSent(true)
  }

  if (sent) {
    return <p className="text-center">Check your email for a reset link.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Reset Password</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Send Reset Link
      </button>
    </form>
=======
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
>>>>>>> origin/codex/implement-auth-routes-and-features
  )
}
