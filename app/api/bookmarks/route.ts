<<<<<<< HEAD
import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const BOOKMARKS_FILE = path.join(process.cwd(), "data", "bookmarks.json")

async function readData() {
  try {
    const data = await fs.readFile(BOOKMARKS_FILE, "utf8")
    return JSON.parse(data || "[]") as string[]
  } catch {
    return [] as string[]
  }
}

async function writeData(data: string[]) {
  await fs.mkdir(path.dirname(BOOKMARKS_FILE), { recursive: true })
  await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = await readData()
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { verseId } = await req.json()
  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }
  const data = await readData()
  if (!data.includes(verseId)) {
    data.push(verseId)
    await writeData(data)
  }
  return NextResponse.json({ verseId })
}

export async function DELETE(req: Request) {
  const { verseId } = await req.json()
  if (!verseId) {
    return NextResponse.json({ error: "Missing verseId" }, { status: 400 })
  }
  let data = await readData()
  data = data.filter((id) => id !== verseId)
  await writeData(data)
  return NextResponse.json({ verseId })
=======
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { favorites } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuid } from "uuid";

const USER_ID = "demo-user";

export async function POST(req: Request) {
  const { bookId } = await req.json();
  if (!bookId) {
    return NextResponse.json({ error: "bookId required" }, { status: 400 });
  }
  await db
    .insert(favorites)
    .values({ id: uuid(), userId: USER_ID, bookId })
    .onConflictDoNothing();
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const { bookId } = await req.json();
  if (!bookId) {
    return NextResponse.json({ error: "bookId required" }, { status: 400 });
  }
  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, USER_ID), eq(favorites.bookId, bookId)));
  return NextResponse.json({ success: true });
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
}
