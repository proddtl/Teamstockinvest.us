import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DepositForm } from "@/components/deposit-form"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PageHeader } from "@/components/page-header"

export default async function DepositPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <DashboardHeader userName={profile?.full_name || "User"} />
      <PageHeader title="Deposit Funds" showBackButton />

      <div className="flex-1 p-4 pb-24">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <DepositForm />
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}
