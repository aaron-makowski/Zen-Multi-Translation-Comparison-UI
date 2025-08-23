import { NextResponse } from "next/server"
import { translations } from "@/lib/translations"
import { createReadStream } from "fs"
import { promises as fs } from "fs"
import path from "path"
import { Readable } from "stream"

export async function GET(
  req: Request,
  { params }: { params: { bookId: string } }
) {
  const book = (translations as Record<string, any>)[params.bookId]
  if (!book || !book.pdfPath) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 })
  }

  const filePath = path.isAbsolute(book.pdfPath)
    ? book.pdfPath
    : path.join(process.cwd(), book.pdfPath)

  try {
    await fs.access(filePath)
  } catch {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 })
  }

  const stream = createReadStream(filePath)
  return new NextResponse(Readable.toWeb(stream) as any, {
    headers: { "Content-Type": "application/pdf" }
  })
}
