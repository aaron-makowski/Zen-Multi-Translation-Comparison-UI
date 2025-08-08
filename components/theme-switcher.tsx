"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    const stored = window.localStorage.getItem("theme")
    const initial = stored ? stored === "dark" : root.classList.contains("dark")
    root.classList.toggle("dark", initial)
    setIsDark(initial)
  }, [])

  function toggleTheme() {
    const next = !isDark
    const root = window.document.documentElement
    root.classList.toggle("dark", next)
    window.localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
