import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BookOpen, Layers, Search } from "lucide-react"
import { TranslationCard } from "@/components/translation-card"
import { translators, verses } from "@/lib/translations"

export default function Home() {
  // Get a random verse and translator for the preview
  const randomVerse = verses[Math.floor(Math.random() * verses.length)]
  const randomTranslator = translators[Math.floor(Math.random() * translators.length)]

  return (
    <main className="flex min-h-screen flex-col items-center p-3 md:p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-3xl w-full text-center space-y-4 py-6">
        <h1 className="text-3xl font-bold tracking-tight">Xinxin Ming Explorer</h1>
        <p className="text-base text-muted-foreground">Compare multiple translations of the classic Zen text</p>

        <Card className="p-4 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-2">信心銘 (Xinxin Ming)</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            A foundational Zen text attributed to the Third Chinese Chán Patriarch Jianzhi Sengcan. Explore and compare
            over 20 different English translations.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild size="sm" className="gap-1">
              <Link href="/translations">
                Explore Translations <ArrowRight size={14} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/about">About the Text</Link>
            </Button>
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
              <h3 className="text-base font-medium">Verse by Verse</h3>
              <p className="text-xs text-muted-foreground">Navigate through the text with easy controls.</p>
            </div>
          </Card>
          <Card className="p-3 bg-card shadow-sm">
            <div className="flex flex-col items-center text-center gap-1">
              <Search className="h-6 w-6 text-primary" />
              <h3 className="text-base font-medium">Full Text View</h3>
              <p className="text-xs text-muted-foreground">Read complete translations by each translator.</p>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
