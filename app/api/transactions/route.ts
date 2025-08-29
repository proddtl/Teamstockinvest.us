import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { type, amount, description, recipient_email } = body

    // Validate input
    if (!type || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid transaction data" }, { status: 400 })
    }

    if (!["deposit", "withdraw", "transfer", "invest"].includes(type)) {
      return NextResponse.json({ error: "Invalid transaction type" }, { status: 400 })
    }

    // Get current account balance for validation
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("account_balance")
      .eq("user_id", user.id)
      .single()

    if (accountError) {
      return NextResponse.json({ error: "Failed to get account information" }, { status: 500 })
    }

    // Validate sufficient funds for withdraw, transfer, and invest
    if (["withdraw", "transfer", "invest"].includes(type) && account.account_balance < amount) {
      return NextResponse.json({ error: "Insufficient funds" }, { status: 400 })
    }

    // Validate recipient email for transfers
    if (type === "transfer" && !recipient_email) {
      return NextResponse.json({ error: "Recipient email is required for transfers" }, { status: 400 })
    }

    // Create the transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type,
        amount,
        description: description || `${type.charAt(0).toUpperCase() + type.slice(1)} transaction`,
        recipient_email: recipient_email || null,
        status: "completed",
      })
      .select()
      .single()

    if (transactionError) {
      console.error("Transaction error:", transactionError)
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
    }

    return NextResponse.json({ success: true, transaction }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get user's transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (transactionsError) {
      return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }

    return NextResponse.json({ transactions }, { status: 200 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
