import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "pdfs.json")
const PDF_DIR = path.join(process.cwd(), "data", "pdfs")

interface PdfEntry {
  id: string
  filename: string
  status: string
}

async function readData(): Promise<PdfEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeData(data: PdfEntry[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const entries = await readData()
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const id = body?.id
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  const entries = await readData()
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  entry.status = "processing"
  await writeData(entries)
  // In a real application, trigger ingestion here
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }
  let entries = await readData()
  const entry = entries.find((e) => e.id === id)
  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  entries = entries.filter((e) => e.id !== id)
  await writeData(entries)
  try {
    await fs.unlink(path.join(PDF_DIR, entry.filename))
  } catch {}
  return NextResponse.json({ success: true })
}
