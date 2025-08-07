import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const FILE = path.join(process.cwd(), "data", "featured.json")

export async function GET() {
  try {
    const data = await fs.readFile(FILE, "utf8")
    return NextResponse.json(JSON.parse(data || "{}"))
  } catch {
    return NextResponse.json({})
  }
}
