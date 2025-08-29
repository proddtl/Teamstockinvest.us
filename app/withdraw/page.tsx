import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WithdrawForm } from "@/components/withdraw-form"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageHeader } from "@/components/page-header"

export default async function WithdrawPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const { data: account } = await supabase.from("accounts").select("*").eq("user_id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader userName={profile?.full_name || "User"} />
      <PageHeader title="Withdraw Funds" showBackButton />

      <div className="flex-1 p-4 pb-24">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <WithdrawForm availableBalance={account?.account_balance || 0} />
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
