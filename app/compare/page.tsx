"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translators, verses } from "@/lib/translations"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ComparePage() {
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [selectedTranslators, setSelectedTranslators] = useState<string[]>(["waley", "suzuki", "clarke"])

  const verse = verses.find((v) => v.id === selectedVerse) || verses[0]

  const toggleTranslator = (translatorId: string) => {
    if (selectedTranslators.includes(translatorId)) {
      setSelectedTranslators(selectedTranslators.filter((id) => id !== translatorId))
    } else {
      setSelectedTranslators([...selectedTranslators, translatorId])
    }
  }

  return (
    <main className="container mx-auto p-2 md:p-4 max-w-4xl">
      <div className="mb-3">
        <Link href="/" className="flex items-center text-xs text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft size={14} className="mr-1" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold mb-1">Compare Translations</h1>
        <p className="text-sm text-muted-foreground">Select translations to compare side by side.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-2">
              <div className="text-sm font-medium mb-1">Translators</div>
              <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                {translators.map((translator) => (
                  <div key={translator.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={translator.id}
                      checked={selectedTranslators.includes(translator.id)}
                      onCheckedChange={() => toggleTranslator(translator.id)}
                    />
                    <Label htmlFor={translator.id} className="text-xs cursor-pointer">
                      {translator.name} ({translator.year})
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Verse</span>
              <Select
                value={selectedVerse.toString()}
                onValueChange={(value) => setSelectedVerse(Number.parseInt(value))}
              >
                <SelectTrigger className="h-7 text-xs w-16">
                  <SelectValue placeholder="Verse" />
                </SelectTrigger>
                <SelectContent>
                  {verses.map((v) => (
                    <SelectItem key={v.id} value={v.id.toString()}>
                      {v.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={selectedVerse <= 1}
                onClick={() => setSelectedVerse((prev) => Math.max(1, prev - 1))}
              >
                <ArrowLeft size={14} className="mr-1" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                disabled={selectedVerse >= verses.length}
                onClick={() => setSelectedVerse((prev) => Math.min(verses.length, prev + 1))}
              >
                Next <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>

          <div className="text-xs p-2 bg-muted rounded-md mb-3">
            <div className="text-[10px] text-muted-foreground mb-0.5">Original Chinese</div>
            {verse.lines.map((line, index) => (
              <div key={index} className="mb-0.5 last:mb-0">
                {line.chinese}
                {line.pinyin && <span className="text-[10px] text-muted-foreground ml-1">({line.pinyin})</span>}
              </div>
            ))}
          </div>

          {selectedTranslators.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Please select at least one translator to compare
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTranslators.map((translatorId) => {
                const translator = translators.find((t) => t.id === translatorId)
                if (!translator) return null

                return (
                  <Card key={translatorId} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-2">
                        <div className="space-y-1">
                          {verse.lines.map((line, index) => (
                            <p key={index} className="text-sm leading-tight">
                              {line.translations[translatorId]}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="bg-muted/30 px-2 py-1 text-xs flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{translator.name}</span> ({translator.year})
                          {translator.link && (
                            <Link
                              href={translator.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center hover:text-foreground"
                            >
                              <ArrowRight size={10} className="ml-1" />
                              <span className="sr-only">Learn more about {translator.name}</span>
                            </Link>
                          )}
                        </div>
                        <span className="text-muted-foreground text-[10px]">{translator.description}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {verse.commonWords && verse.commonWords.length > 0 && (
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <div className="text-xs font-medium mb-1">Common Words</div>
              <div className="flex flex-wrap gap-1">
                {verse.commonWords.map((word, index) => (
                  <span key={index} className="text-xs px-1.5 py-0.5 bg-muted rounded-full">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
