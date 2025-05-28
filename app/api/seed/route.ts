import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-db"

export async function GET() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database seeded successfully" })
    } else {
      return NextResponse.json({ message: "Error seeding database", error: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ message: "Error seeding database", error }, { status: 500 })
  }
}
