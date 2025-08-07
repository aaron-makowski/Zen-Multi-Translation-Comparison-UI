"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl">
                Zen Texts
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink href="/" current={pathname === "/"}>
                Home
              </NavLink>
              <NavLink href="/books" current={pathname.startsWith("/books")}>
                Books
              </NavLink>
              <NavLink href="/compare" current={pathname === "/compare"}>
                Compare
              </NavLink>
              <NavLink href="/pdf-preview" current={pathname === "/pdf-preview"}>
                PDF Preview
              </NavLink>
              <NavLink href="/about" current={pathname === "/about"}>
                About
              </NavLink>
              <NavLink href="/reddit" current={pathname === "/reddit"}>
                Reddit
              </NavLink>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link href="/login" passHref>
              <Button variant="outline" size="sm" className="mr-2">
                Login
              </Button>
            </Link>
            <Link href="/register" passHref>
              <Button size="sm">Register</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <MobileNavLink href="/" current={pathname === "/"}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/books" current={pathname.startsWith("/books")}>
            Books
          </MobileNavLink>
          <MobileNavLink href="/compare" current={pathname === "/compare"}>
            Compare
          </MobileNavLink>
          <MobileNavLink href="/pdf-preview" current={pathname === "/pdf-preview"}>
            PDF Preview
          </MobileNavLink>
          <MobileNavLink href="/about" current={pathname === "/about"}>
            About
          </MobileNavLink>
          <MobileNavLink href="/reddit" current={pathname === "/reddit"}>
            Reddit
          </MobileNavLink>
          <div className="flex space-x-2 px-3 py-2">
            <Link href="/login" passHref className="w-1/2">
              <Button variant="outline" size="sm" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="/register" passHref className="w-1/2">
              <Button size="sm" className="w-full">
                Register
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
        current
          ? "border-indigo-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
      }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
        current
          ? "bg-indigo-50 border-indigo-500 text-indigo-700"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
      }`}
    >
      {children}
    </Link>
  )
}
