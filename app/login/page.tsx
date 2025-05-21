import { LoginForm } from "@/components/auth/login-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to sign in to your account</p>
        </div>
        <LoginForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild variant="outline">
            <Link href="/api/auth/guest">Continue as Guest</Link>
          </Button>
          <div className="text-xs text-center text-muted-foreground">No account needed. Limited functionality.</div>
        </div>
      </div>
    </div>
  )
}
