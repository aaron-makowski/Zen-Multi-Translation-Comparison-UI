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
}
