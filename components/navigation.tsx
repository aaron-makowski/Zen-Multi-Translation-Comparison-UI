"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun, User, BookOpen, Heart, PenSquare, LogOut, Search, Users, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  } | null
  isAdmin?: boolean
}

export function Navigation({ user, isAdmin = false }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const routes = [
    { href: "/", label: "Home" },
    { href: "/books", label: "Books" },
    { href: "/search", label: "Search" },
    { href: "/community", label: "Community" },
    { href: "/about", label: "About" },
  ]

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    window.location.href = "/"
  }

  async function handleGuestLogin() {
    await fetch("/api/auth/guest", {
      method: "POST",
    })
    router.refresh()
  }

  function getInitials(name: string | null) {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Zen Texts</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={
                  pathname === route.href
                    ? "text-foreground font-semibold"
                    : "text-foreground/60 transition-colors hover:text-foreground"
                }
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold text-xl">Zen Texts</span>
            </Link>
            <nav className="flex flex-col gap-4 mt-8">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={
                    pathname === route.href
                      ? "text-foreground font-semibold"
                      : "text-foreground/60 transition-colors hover:text-foreground"
                  }
                >
                  {route.label}
                </Link>
              ))}

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/favorites"
                    onClick={() => setOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/notes"
                    onClick={() => setOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Notes
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="text-foreground/60 transition-colors hover:text-foreground"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false)
                      handleLogout()
                    }}
                    className="text-foreground/60 transition-colors hover:text-foreground text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-foreground/60 transition-colors hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false)
                      handleGuestLogin()
                    }}
                    className="text-foreground/60 transition-colors hover:text-foreground text-left"
                  >
                    Continue as Guest
                  </button>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Link href="/" className="md:hidden font-bold">
            Zen Texts
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button asChild variant="ghost" size="icon" className="hidden md:flex">
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.name || "User"}
                    <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/books" className="cursor-pointer">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>Books</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/notes" className="cursor-pointer">
                      <PenSquare className="mr-2 h-4 w-4" />
                      <span>Notes</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button onClick={handleGuestLogin} variant="ghost" size="sm">
                  Guest
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
