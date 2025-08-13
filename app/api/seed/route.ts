import { seedDatabase } from "@/lib/seed"
import { NextResponse } from "next/server"
import { logError } from "@/lib/logger"

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    logError(error, "Failed to seed database")
    return NextResponse.json({ message: "Failed to seed database", error: (error as Error).message }, { status: 500 })
  }
}
