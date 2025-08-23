"use client"

import { FormEvent, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPasswordRequestPage() {
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    })
    setSent(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      {sent ? (
        <p>Check your email for a reset link.</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <Input name="email" type="email" placeholder="Email" required />
          <Button type="submit" className="w-full">Send reset link</Button>
        </form>
      )}
    </main>
  )
}
