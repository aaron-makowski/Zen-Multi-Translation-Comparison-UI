"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface Translation {
  id: string
  translator: string
  year: string | null
  text: string
  words: string[]
}

interface LineData {
  lineId: string
  lineNumber: number
  originalText: string
  originalWords: string[]
  translations: Translation[]
}

interface WordComparisonTableProps {
  line: LineData
}

export function WordComparisonTable({ line }: WordComparisonTableProps) {
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>(
    line.translations.slice(0, 3).map((t) => t.id),
  )
  const [open, setOpen] = useState(false)

  const toggleTranslation = (id: string) => {
    const updated = selectedTranslations.includes(id)
      ? selectedTranslations.filter((t) => t !== id)
      : [...selectedTranslations, id]

    setSelectedTranslations(updated)
  }

  // Find the maximum number of words in any translation
  const maxWords = Math.max(
    line.originalWords.length,
    ...line.translations.filter((t) => selectedTranslations.includes(t.id)).map((t) => t.words.length),
  )

  // Create an array of indices for the words
  const wordIndices = Array.from({ length: maxWords }, (_, i) => i)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Word-by-Word Comparison</h3>
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
                {line.translations.map((translation) => (
                  <div key={translation.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`select-${translation.id}`}
                      checked={selectedTranslations.includes(translation.id)}
                      onCheckedChange={() => toggleTranslation(translation.id)}
                    />
                    <Label htmlFor={`select-${translation.id}`} className="text-sm cursor-pointer">
                      {translation.translator} ({translation.year || "Unknown"})
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Word #</TableHead>
              <TableHead>Original</TableHead>
              {line.translations
                .filter((t) => selectedTranslations.includes(t.id))
                .map((translation) => (
                  <TableHead key={translation.id}>
                    {translation.translator} ({translation.year || "Unknown"})
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {wordIndices.map((index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{line.originalWords[index] || ""}</TableCell>
                {line.translations
                  .filter((t) => selectedTranslations.includes(t.id))
                  .map((translation) => (
                    <TableCell key={translation.id}>{translation.words[index] || ""}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedTranslations.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          Please select at least one translator to compare
        </div>
      )}
    </div>
  )
}
