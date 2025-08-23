"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next-intl/link"

interface Translator {
  id: string
  name: string
  year: string
  description?: string
  link?: string
}

interface Verse {
  id: number
  lines: { translations: Record<string, string> }[]
}

interface TranslationCardProps {
  verse: Verse
  translator: Translator
  compact?: boolean
}

export function TranslationCard({ verse, translator, compact = false }: TranslationCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-sm ${compact ? "border-0 shadow-none" : ""}`}>
      <CardContent className={compact ? "p-2" : "p-3"}>
        <div className="space-y-1">
          {verse.lines.map((line, index) => {
            const text = line.translations[translator.id] ?? "Translation not available."
            return (
              <p key={index} className={`leading-tight ${compact ? "text-sm" : "text-base"}`}>{text}</p>
            )
          })}
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <span className="font-medium">{translator.name}</span>
            <span>({translator.year})</span>
            {translator.link && (
              <Link
                href={translator.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center hover:text-foreground"
              >
                <ExternalLink size={10} className="ml-1" />
                <span className="sr-only">Learn more about {translator.name}</span>
              </Link>
            )}
          </div>

          {!compact && (
            <div className="flex items-center gap-2">
              <span className="text-xs bg-muted px-1 py-0.5 rounded">#{verse.id}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
