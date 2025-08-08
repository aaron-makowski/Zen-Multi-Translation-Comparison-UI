import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600">
        <Link href="/community/code-of-conduct" className="hover:text-gray-900">
          Code of Conduct
        </Link>
        <Link href="/community/contributing" className="hover:text-gray-900">
          Contributing
        </Link>
        <Link href="/community/faq" className="hover:text-gray-900">
          FAQ
        </Link>
      </nav>
    </footer>
  )
}
