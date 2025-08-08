"use client"

import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * ThemeSwitcher toggles the `dark` class on the document element
 * enabling TailwindCSS dark mode styles. Preference is stored in
 * localStorage so the choice persists across sessions.
 */
export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false)

  // On mount read the current preference
  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    if (stored === "dark" || (!stored && root.classList.contains("dark"))) {
      root.classList.add("dark")
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    if (root.classList.contains("dark")) {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
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

export default ThemeSwitcher
