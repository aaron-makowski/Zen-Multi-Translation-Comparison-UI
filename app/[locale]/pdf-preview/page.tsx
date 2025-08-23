"use client"
<<<<<<< HEAD
import React, { useEffect, useState } from "react"

interface Book {
  id: string
  title: string
  translators: string[]
}

export default function PdfPreviewPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [bookId, setBookId] = useState("")
  const [translator, setTranslator] = useState("")

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    fetch(`${baseUrl}/api/books`).then((res) => res.json()).then(setBooks)
  }, [])

  const selectedBook = books.find((b) => b.id === bookId)

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Preview</h1>
      <div className="flex flex-wrap gap-2 mb-4">
        <select
          value={bookId}
          onChange={(e) => {
            setBookId(e.target.value)
            setTranslator("")
          }}
          className="border p-2"
        >
          <option value="">Select Book</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
        {selectedBook && (
          <select
            value={translator}
            onChange={(e) => setTranslator(e.target.value)}
            className="border p-2"
          >
            <option value="">Translator</option>
            {selectedBook.translators.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        )}
      </div>
      {bookId && translator && (
        <object
          data={`/api/books/${bookId}/pdf?translator=${translator}`}
=======
import { useState } from "react"

export default function PdfPreviewPage() {
  const [file, setFile] = useState<File | null>(null)
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Preview</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      {file && (
        <object
          data={URL.createObjectURL(file)}
>>>>>>> origin/codex/set-up-next-intl-with-translations
          type="application/pdf"
          width="100%"
          height="600"
          className="border"
        >
          <p>Preview unavailable</p>
        </object>
      )}
    </main>
  )
}
