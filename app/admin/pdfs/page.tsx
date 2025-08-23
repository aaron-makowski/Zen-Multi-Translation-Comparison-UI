"use client"
import { useEffect, useState } from "react"

interface PdfEntry {
  id: string
  filename: string
  status: string
}

export default function AdminPdfsPage() {
  const [pdfs, setPdfs] = useState<PdfEntry[]>([])
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch("/api/admin/pdfs")
    if (res.ok) {
      setPdfs(await res.json())
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function reingest(id: string) {
    setLoading(true)
    await fetch("/api/admin/pdfs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    await load()
    setLoading(false)
  }

  async function remove(id: string) {
    setLoading(true)
    await fetch(`/api/admin/pdfs?id=${id}`, { method: "DELETE" })
    await load()
    setLoading(false)
  }

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Cached PDFs</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">File</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pdfs.map((pdf) => (
            <tr key={pdf.id} className="border-t">
              <td className="p-2">{pdf.filename}</td>
              <td className="p-2">{pdf.status}</td>
              <td className="p-2 space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  onClick={() => reingest(pdf.id)}
                  disabled={loading}
                >
                  Re-ingest
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                  onClick={() => remove(pdf.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {pdfs.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center">
                No PDFs cached.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  )
}
