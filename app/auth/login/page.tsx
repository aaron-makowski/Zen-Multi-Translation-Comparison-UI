"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const res = await signIn("credentials", {
      redirect: false,
      email: form.get("email"),
      password: form.get("password"),
    })
    if (res?.error) setError(res.error)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="password" type="password" placeholder="Password" required />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full">Sign In</Button>
      </form>
      <div className="mt-4 text-sm">
        <Link href="/auth/reset-password" className="underline">
          Forgot password?
        </Link>
      </div>
    </main>
  )
}
