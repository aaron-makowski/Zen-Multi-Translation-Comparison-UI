"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { PenSquare, Trash2 } from "lucide-react"

interface User {
  id: string
  name: string | null
  image: string | null
}

interface Note {
  id: string
  text: string
  createdAt: Date
}

interface NoteSectionProps {
  verseId: string
  notes: Note[]
  currentUser: User | null
}

export function NoteSection({ verseId, notes: initialNotes, currentUser }: NoteSectionProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [noteText, setNoteText] = useState("")
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmitNote(e: React.FormEvent) {
    e.preventDefault()

    if (!noteText.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: noteText,
          verseId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit note")
      }

      const newNote = await response.json()
      setNotes([newNote, ...notes])
      setNoteText("")

      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleUpdateNote(e: React.FormEvent) {
    e.preventDefault()

    if (!editingNoteId || !editingNoteText.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/notes/${editingNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: editingNoteText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update note")
      }

      const updatedNote = await response.json()
      setNotes(notes.map((note) => (note.id === editingNoteId ? updatedNote : note)))
      setEditingNoteId(null)
      setEditingNoteText("")

      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteNote(noteId: string) {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }

      setNotes(notes.filter((note) => note.id !== noteId))

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    }
  }

  function startEditing(note: Note) {
    setEditingNoteId(note.id)
    setEditingNoteText(note.text)
  }

  function cancelEditing() {
    setEditingNoteId(null)
    setEditingNoteText("")
  }

  return (
    <div className="space-y-6">
      {currentUser ? (
        <form onSubmit={handleSubmitNote} className="space-y-4">
          <Textarea
            placeholder="Add a personal note about this verse..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting || !noteText.trim()}>
            {isSubmitting ? "Saving..." : "Save Note"}
          </Button>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-md text-center">
          <p className="text-sm text-muted-foreground mb-2">Sign in to add personal notes</p>
          <Button asChild variant="outline" size="sm">
            <a href="/login">Sign In</a>
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEditing(note)}>
                      <PenSquare className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingNoteId === note.id ? (
                  <form onSubmit={handleUpdateNote} className="space-y-2">
                    <Textarea
                      value={editingNoteText}
                      onChange={(e) => setEditingNoteText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" disabled={isSubmitting || !editingNoteText.trim()}>
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No notes yet. Add your first note above!</p>
          </div>
        )}
      </div>
    </div>
  )
}
