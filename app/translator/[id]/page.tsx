import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { translators, verses } from "@/lib/translations"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function TranslatorPage({ params }: { params: { id: string } }) {
  const translator = translators.find((t) => t.id === params.id)

  if (!translator) {
    notFound()
  }

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
          {translator.name} ({translator.year})
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">{translator.description}</p>
      </div>

      <div className="space-y-6">
        {verses.map((verse, index) => (
          <Card key={verse.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Verse {verse.id}</span>
                <div className="text-sm text-zinc-500">
                  {index + 1} of {verses.length}
                </div>
              </CardTitle>
              <div className="text-lg font-medium text-center p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                {verse.chinese}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700 dark:text-zinc-300">{verse.translations[translator.id]}</p>
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
