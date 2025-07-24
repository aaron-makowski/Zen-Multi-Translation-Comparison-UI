import { seedDatabase } from "@/lib/seed"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await seedDatabase()
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Failed to seed database:", error)
    return NextResponse.json({ message: "Failed to seed database", error: (error as Error).message }, { status: 500 })
  }
}
