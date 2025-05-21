import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, Layers, Search, UserPlus } from "lucide-react"
import { TranslationCard } from "@/components/translation-card"
import { translators, verses } from "@/lib/translations"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser()

  // Get a random verse and translator for the preview
  const randomVerse = verses[Math.floor(Math.random() * verses.length)]
  const randomTranslator = translators[Math.floor(Math.random() * translators.length)]

  return (
    <main className="flex min-h-screen flex-col items-center p-3 md:p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-3xl w-full text-center space-y-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight">Zen Texts Community</h1>
        <p className="text-base text-muted-foreground">
          Explore, compare, and discuss translations of classic Zen texts
        </p>

        <Card className="p-4 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Welcome to Zen Texts</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            A community platform for exploring and comparing translations of classic Zen texts. Start with the Xinxin
            Ming or explore other texts in our growing library.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm" className="gap-1">
              <Link href="/books">
                Explore Texts <ArrowRight size={14} />
              </Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link href="/api/auth/guest">
                  <UserPlus size={14} className="mr-1" /> Continue as Guest
                </Link>
              </Button>
            )}
          </div>
        </Card>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Sample Translation</h3>
          <TranslationCard verse={randomVerse} translator={randomTranslator} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <Card className="p-3 bg-card shadow-sm">
            <div className="flex flex-col items-center text-center gap-1">
              <Layers className="h-6 w-6 text-primary" />
              <h3 className="text-base font-medium">Compare Translations</h3>
              <p className="text-xs text-muted-foreground">View multiple translations side by side.</p>
            </div>
          </Card>
          <Card className="p-3 bg-card shadow-sm">
            <div className="flex flex-col items-center text-center gap-1">
              <BookOpen className="h-6 w-6 text-primary" />
              <h3 className="text-base font-medium">Multiple Texts</h3>
              <p className="text-xs text-muted-foreground">Explore a growing library of Zen texts.</p>
            </div>
          </Card>
          <Card className="p-3 bg-card shadow-sm">
            <div className="flex flex-col items-center text-center gap-1">
              <Search className="h-6 w-6 text-primary" />
              <h3 className="text-base font-medium">Community Features</h3>
              <p className="text-xs text-muted-foreground">Add notes, comments, and favorites.</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
