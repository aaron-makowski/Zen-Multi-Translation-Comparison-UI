"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
        <p className="mb-2 sm:mb-0">© 2024 Zen Texts</p>
        <nav className="flex space-x-4">
          <Link href="/docs/code-of-conduct" className="hover:underline">
            Code of Conduct
          </Link>
          <Link href="/docs/contributing" className="hover:underline">
            Contributing
          </Link>
          <Link href="/docs/faq" className="hover:underline">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  )
}
