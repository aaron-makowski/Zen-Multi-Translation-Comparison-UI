import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ComparePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl font-bold mb-6">Compare Translations</h1>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select a Text to Compare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button asChild className="h-auto py-4">
              <Link href="/books/xinxin-ming">
                <div className="text-left">
                  <div className="font-medium">Xinxin Ming (Faith in Mind)</div>
                  <div className="text-sm opacity-80">Compare translations of this classic Zen poem</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4">
              <Link href="/books/platform-sutra">
                <div className="text-left">
                  <div className="font-medium">Platform Sutra</div>
                  <div className="text-sm opacity-80">Compare translations of Huineng's teachings</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4">
              <Link href="/books/heart-sutra">
                <div className="text-left">
                  <div className="font-medium">Heart Sutra</div>
                  <div className="text-sm opacity-80">Explore the Heart of Perfect Wisdom</div>
                </div>
              </Link>
            </Button>
            <Button asChild className="h-auto py-4">
              <Link href="/books/diamond-sutra">
                <div className="text-left">
                  <div className="font-medium">Diamond Sutra</div>
                  <div className="text-sm opacity-80">View this classic Buddhist text</div>
                </div>
              </Link>
            </Button>
          </div>
        </Card>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
