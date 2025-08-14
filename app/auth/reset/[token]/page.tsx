"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
<<<<<<< HEAD

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch(`/api/auth/reset/${params.token}`, {
=======
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/auth/reset/${params.token}`, {
>>>>>>> origin/codex/implement-auth-routes-and-features
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
<<<<<<< HEAD
=======
    if (!res.ok) {
      const data = await res.json()
      setError(data.error)
      return
    }
>>>>>>> origin/codex/implement-auth-routes-and-features
    router.push("/auth/login")
  }

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-sm mx-auto">
      <h1 className="text-xl font-bold">Set New Password</h1>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Update Password
      </button>
    </form>
=======
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Set New Password</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </main>
>>>>>>> origin/codex/implement-auth-routes-and-features
  )
}
