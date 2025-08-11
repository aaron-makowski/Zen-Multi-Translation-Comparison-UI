"use client"
import { Card, CardContent } from "@/components/ui/card";
import type { Translator, Verse } from "@/lib/translations";
import { ExternalLink } from "lucide-react";
import Link from "next-intl/link";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

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
            const text = line.translations[translator.id] ?? "Translation not available.";
            return (
              <p key={index} className={`leading-tight ${compact ? "text-sm" : "text-base"}`}>{text}</p>
            )
          })}
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium cursor-help">{translator.name}</span>
                </TooltipTrigger>
                <TooltipContent>
                  {translator.translatorBio && <p className="max-w-xs">{translator.translatorBio}</p>}
                  {translator.license && (
                    <p className="mt-1 text-xs">License: {translator.license}</p>
                  )}
                </TooltipContent>
              </Tooltip>
              <span>({translator.publicationYear})</span>
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
          </TooltipProvider>

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
