import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Zen Texts Translation Comparison</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Explore Translations</h2>
            <p className="text-gray-600 mb-4">Browse through different translations of classic Zen texts.</p>
            <Button className="w-full" asChild>
              <Link href="/books">View Books</Link>
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Compare Translations</h2>
            <p className="text-gray-600 mb-4">Compare different translations side by side.</p>
            <Button className="w-full" asChild>
              <Link href="/compare">Compare Translations</Link>
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">About This Project</h2>
          <p className="text-gray-600 mb-4">
            This application allows you to explore and compare different translations of classic Zen texts. You can
            browse through books, read verses, and compare how different translators have interpreted the same text.
          </p>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
