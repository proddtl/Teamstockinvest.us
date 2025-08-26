import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's account information
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (accountError) {
      return NextResponse.json({ error: "Failed to fetch account information" }, { status: 500 })
    }

    return NextResponse.json({ account }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
