"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { translators, verses } from "@/lib/translations"
import Link from "next-intl/link"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { TranslationCard } from "@/components/translation-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TranslatorSelector } from "@/components/translator-selector"
import { Input } from "@/components/ui/input"
import { filterByKeyword } from "@/lib/verse-utils"

export default function TranslationsPage() {
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [selectedTranslator, setSelectedTranslator] = useState("waley")
  const [visibleTranslators, setVisibleTranslators] = useState<string[]>(translators.map((t) => t.id))
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<
    { baseVerse: number; translator: string; text: string }[]
  >([])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    if (value.trim()) {
      setResults(filterByKeyword(value))
    } else {
      setResults([])
    }
  }

  const verse = verses.find((v) => v.id === selectedVerse) || verses[0]
  const translator = translators.find((t) => t.id === selectedTranslator) || translators[0]
  const baseTranslatorId = visibleTranslators[0]
  const baseLines = verse.lines.map((line) => line.translations[baseTranslatorId] ?? "")

  // Initialize with all translators if localStorage is empty
  useEffect(() => {
    const saved = localStorage.getItem("selectedTranslators")
    if (!saved) {
      localStorage.setItem("selectedTranslators", JSON.stringify(translators.map((t) => t.id)))
    }
  }, [])

  return (
    <main className="container mx-auto p-2 md:p-4 max-w-4xl">
      <div className="mb-3">
        <Link href="/" className="flex items-center text-xs text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft size={14} className="mr-1" /> Back to Home
        </Link>
        <h1 className="text-2xl font-bold mb-1">Xinxin Ming Translations</h1>
        <p className="text-sm text-muted-foreground">Explore different translations of this foundational Zen text.</p>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search translations"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-2"
        />
        {results.length > 0 && (
          <div className="max-h-40 overflow-y-auto text-xs space-y-1">
            {results.map((r, i) => (
              <div key={i}>
                <span className="font-medium">Verse {r.baseVerse} ({r.translator}):</span> {r.text}
              </div>
            ))}
          </div>
        )}
      </div>

      <Tabs defaultValue="verse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verse">Verse by Verse</TabsTrigger>
          <TabsTrigger value="translator">By Translator</TabsTrigger>
        </TabsList>

        <TabsContent value="verse" className="mt-3">
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

          <TranslatorSelector
            bookId="xinxinming"
            translators={translators}
            selectedTranslators={visibleTranslators}
            onChange={setVisibleTranslators}
          />

          <div className="grid grid-cols-1 gap-2">
            {translators
              .filter((t) => visibleTranslators.includes(t.id))
              .map((translator) => (
                <TranslationCard
                  key={translator.id}
                  verse={verse}
                  translator={translator}
                  compact={true}
                  baseLines={baseLines}
                />
              ))}
          </div>

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
        </TabsContent>

        <TabsContent value="translator" className="mt-3">
          <div className="mb-3">
            <Select value={selectedTranslator} onValueChange={setSelectedTranslator}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select a translator" />
              </SelectTrigger>
              <SelectContent>
                {translators.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.publicationYear}) - {t.translatorBio}
                    {t.license && ` - ${t.license}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm mb-3 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-base">
                {translator.name} ({translator.publicationYear})
              </h3>
              <p className="text-xs text-muted-foreground">{translator.translatorBio}</p>
              {translator.license && (
                <p className="text-xs text-muted-foreground">License: {translator.license}</p>
              )}
            </div>
            {translator.link && (
              <Link
                href={translator.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center hover:text-foreground"
              >
                Learn more <ExternalLink size={12} className="ml-1" />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {verses.map((verse) => (
              <div key={verse.id} className="border-b pb-2 last:border-0">
                <div className="text-xs text-muted-foreground mb-1">Verse {verse.id}</div>
                <TranslationCard verse={verse} translator={translator} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
