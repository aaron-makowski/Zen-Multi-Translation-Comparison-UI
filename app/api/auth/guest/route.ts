import { type NextRequest, NextResponse } from "next/server"
import { createGuestSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await createGuestSession()

    // Get the return_to parameter from the URL
    const returnTo = request.nextUrl.searchParams.get("return_to") || "/dashboard"

    // Redirect to the return_to URL or dashboard
    return NextResponse.redirect(new URL(returnTo, request.url))
  } catch (error) {
    console.error("Guest login error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export async function POST() {
  try {
    await createGuestSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Guest login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
