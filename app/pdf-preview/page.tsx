"use client"
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
