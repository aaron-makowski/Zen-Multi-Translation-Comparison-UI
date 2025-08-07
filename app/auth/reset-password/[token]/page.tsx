"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter()
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await fetch(`/api/auth/reset-password/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    })
    if (res.ok) {
      router.push("/auth/login")
    } else {
      const data = await res.json()
      setError(data.error || "Error resetting password")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input name="password" type="password" placeholder="New password" required />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    </main>
  )
}
