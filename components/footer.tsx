import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm">
      <nav className="flex justify-center space-x-4">
        <Link href="/docs/CODE_OF_CONDUCT.md" className="text-gray-600 hover:underline">
          Code of Conduct
        </Link>
        <Link href="/docs/CONTRIBUTING.md" className="text-gray-600 hover:underline">
          Contributing
        </Link>
        <Link href="/docs/FAQ.md" className="text-gray-600 hover:underline">
          FAQ
        </Link>
      </nav>
    </footer>
  )
}
