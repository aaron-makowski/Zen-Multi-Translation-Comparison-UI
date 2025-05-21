"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface Translation {
  id: string
  translator: string
  title: string
  year: string | null
  lines: Record<number, string>
}

interface AllTranslation {
  id: string
  translator: string
  title: string
  year: string | null
}

interface Verse {
  id: string
  number: number
  originalText: string
  lines: {
    id: string
    lineNumber: number
    originalText: string
    romanization: string | null
  }[]
}

interface TranslationCompareProps {
  verse: Verse
  translations: Translation[]
  allTranslations: AllTranslation[]
}

export function TranslationCompare({ verse, translations, allTranslations }: TranslationCompareProps) {
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  // Initialize with all translations if localStorage is empty
  useEffect(() => {
    const saved = localStorage.getItem(`selectedTranslations-${verse.id}`)
    if (saved) {
      setSelectedTranslations(JSON.parse(saved))
    } else {
      // Default to first 3 translations or all if less than 3
      const defaultSelected = translations.slice(0, 3).map((t) => t.id)
      setSelectedTranslations(defaultSelected)
      localStorage.setItem(`selectedTranslations-${verse.id}`, JSON.stringify(defaultSelected))
    }
  }, [verse.id, translations])

  const toggleTranslation = (id: string) => {
    const updated = selectedTranslations.includes(id)
      ? selectedTranslations.filter((t) => t !== id)
      : [...selectedTranslations, id]

    setSelectedTranslations(updated)
    localStorage.setItem(
      `selecte  id]
    
    setSelectedTranslations(updated)
    localStorage.setItem(\`selectedTranslations-${verse.id}`,
      JSON.stringify(updated),
    )
  }

  const saveSelection = () => {
    localStorage.setItem(`selectedTranslations-${verse.id}`, JSON.stringify(selectedTranslations))
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Translations</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Manage Translations
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Translations</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {allTranslations.map((translation) => (
                  <div key={translation.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`select-${translation.id}`}
                      checked={selectedTranslations.includes(translation.id)}
                      onCheckedChange={() => toggleTranslation(translation.id)}
                    />
                    <Label htmlFor={`select-${translation.id}`} className="text-sm cursor-pointer">
                      {translation.title} - {translation.translator} ({translation.year || "Unknown"})
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex justify-end">
              <Button onClick={saveSelection}>Save Selection</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedTranslations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No translations selected. Click "Manage Translations" to select.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translations
            .filter((t) => selectedTranslations.includes(t.id))
            .map((translation) => (
              <Card key={translation.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {translation.title} - {translation.translator} {translation.year && `(${translation.year})`}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {verse.lines.map((line) => (
                      <p key={line.id} className="text-sm">
                        {translation.lines[line.lineNumber] || "Translation not available"}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
