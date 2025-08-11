"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"
import type { Translator, Verse } from "@/lib/translations";
import { diffVerses } from "@/lib/diff"
import { ExternalLink } from "lucide-react";
import Link from "next-intl/link";

interface TranslationCardProps {
  verse: Verse
  translator: Translator
  compact?: boolean
  baseLines?: string[]
}

export function TranslationCard({ verse, translator, compact = false, baseLines }: TranslationCardProps) {
  const [showDiff, setShowDiff] = useState(false)

  return (
    <Card className={`transition-all duration-200 hover:shadow-sm ${compact ? "border-0 shadow-none" : ""}`}>
      <CardContent className={compact ? "p-2" : "p-3"}>
        <div className="space-y-1">
          {verse.lines.map((line, index) => {
            const text = line.translations[translator.id] ?? "Translation not available.";
            if (showDiff && baseLines && baseLines[index]) {
              const diff = diffVerses(baseLines[index], text)
              return (
                <p key={index} className={`leading-tight ${compact ? "text-sm" : "text-base"}`}>
                  {diff.map((part, i) => (
                    <span
                      key={i}
                      className={
                        part.type === "insert"
                          ? "bg-green-200"
                          : part.type === "delete"
                            ? "bg-red-200 line-through"
                            : undefined
                      }
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
              )
            }
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

          <div className="flex items-center gap-2">
            <span className="text-xs">Diff</span>
            <Switch
              id={`diff-${verse.id}-${translator.id}`}
              checked={showDiff}
              onCheckedChange={setShowDiff}
            />
            {!compact && <span className="text-xs bg-muted px-1 py-0.5 rounded">#{verse.id}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
