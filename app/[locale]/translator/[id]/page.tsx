import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { translators } from "@/lib/translations"
import { loadCachedTranslations } from "@/lib/verse-cache"
import { ArrowLeft } from "lucide-react"
import Link from "next-intl/link"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return translators.slice(0, 3).map((t) => ({ id: t.id }))
}

export default async function TranslatorPage({ params }: { params: { id: string } }) {
  const translator = translators.find((t) => t.id === params.id)

  if (!translator) {
    notFound()
  }

  const data = await loadCachedTranslations()
  const verses = data.xinxinming.verses

  return (
    <main className="container mx-auto p-4 md:p-8 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/translations"
          className="flex items-center text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Translations
        </Link>
        <h1 className="text-3xl font-bold mb-2">
          {translator.name} ({translator.publicationYear})
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{translator.translatorBio}</p>
        {translator.license && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">License: {translator.license}</p>
        )}
      </div>

      <div className="space-y-6">
        {verses.map((verse: any, index: number) => (
          <Card key={verse.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Verse {verse.id}</span>
                <div className="text-sm text-zinc-500">
                  {index + 1} of {verses.length}
                </div>
              </CardTitle>
              <div className="text-lg font-medium text-center p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                {verse.lines.map((l: any) => l.chinese).join(" ")}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300">
                {verse.lines
                  .map((l: any) => l.translations[translator.id])
                  .join(" ")}
              </p>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/compare?verse=${verse.id}&translators=${translator.id}`}>
                    Compare with other translations
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
