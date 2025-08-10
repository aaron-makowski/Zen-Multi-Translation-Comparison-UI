"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
interface Translator {
  id: string
  name: string
  year: string
  description?: string
  link?: string
}

interface TranslatorSelectorProps {
  bookId: string
  translators: Translator[]
  selectedTranslators: string[]
  onChange: (translators: string[]) => void
}

export function TranslatorSelector({
  bookId,
  translators,
  selectedTranslators,
  onChange,
}: TranslatorSelectorProps) {
  const [open, setOpen] = useState(false)
  const [localSelected, setLocalSelected] = useState<string[]>(selectedTranslators)

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(`selectedTranslators:${bookId}`)
    if (saved) {
      const parsed = JSON.parse(saved)
      setLocalSelected(parsed)
      onChange(parsed)
    }
  }, [bookId, onChange])

  const toggleTranslator = (id: string) => {
    const updated = localSelected.includes(id) ? localSelected.filter((t) => t !== id) : [...localSelected, id]

    setLocalSelected(updated)
  }

  const removeTranslator = (id: string) => {
    const updated = selectedTranslators.filter((t) => t !== id)
    onChange(updated)
    // Save to localStorage
    localStorage.setItem(`selectedTranslators:${bookId}`, JSON.stringify(updated))
  }

  const saveSelection = () => {
    onChange(localSelected)
    // Save to localStorage
    localStorage.setItem(`selectedTranslators:${bookId}`, JSON.stringify(localSelected))
    setOpen(false)
  }

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Selected Translators</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Plus size={14} className="mr-1" /> Add/Remove
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Translators</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-2">
                {translators.map((translator) => (
                  <div key={translator.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`select-${translator.id}`}
                      checked={localSelected.includes(translator.id)}
                      onCheckedChange={() => toggleTranslator(translator.id)}
                    />
                    <Label htmlFor={`select-${translator.id}`} className="text-sm cursor-pointer">
                      {translator.name} ({translator.year}) - {translator.description}
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

      <div className="flex flex-wrap gap-1 mb-2">
        {selectedTranslators.length === 0 ? (
          <div className="text-xs text-muted-foreground">No translators selected. Click Add/Remove to select.</div>
        ) : (
          selectedTranslators.map((id) => {
            const translator = translators.find((t) => t.id === id)
            if (!translator) return null

            return (
              <Badge key={id} variant="outline" className="flex items-center gap-1 pl-2 pr-1 py-0">
                <span className="text-xs">{translator.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeTranslator(id)}
                >
                  <X size={10} />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            )
          })
        )}
      </div>
    </div>
  )
}
