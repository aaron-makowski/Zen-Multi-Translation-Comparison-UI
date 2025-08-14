"use client"

import { FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const router = useRouter()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        username: form.get("username"),
        password: form.get("password"),
      }),
    })
    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })
    router.push("/")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input name="username" type="text" placeholder="Username" required />
        <Input name="password" type="password" placeholder="Password" required />
        <Button type="submit" className="w-full">Sign Up</Button>
      </form>
    </main>
  )
}
