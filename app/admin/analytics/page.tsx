import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react"

export default async function AdminAnalyticsPage() {
  const supabase = createServerClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect("/auth/login")
  }

  // Check admin role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch analytics data
  const { data: analytics } = await supabase.from("analytics_summary").select("*").single()

  // Fetch recent transactions for activity feed
  const { data: recentTransactions } = await supabase
    .from("transactions")
    .select(`
      id,
      type,
      amount,
      created_at,
      profiles!inner(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch user growth data
  const { data: userGrowth } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="px-4 py-6 pb-20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Analytics</h1>
            <p className="text-gray-600 mt-1">Platform insights and metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-500 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.total_users || 0}</div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-blue-200 text-xs mt-1">+{analytics?.new_users_30d || 0} this month</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(analytics?.total_balance || 0).toLocaleString()}</div>
                <p className="text-green-100 text-sm">Total Balance</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-500 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(analytics?.total_deposits || 0).toLocaleString()}</div>
                <p className="text-purple-100 text-sm">Total Deposits</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-500 text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Activity className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.transactions_7d || 0}</div>
                <p className="text-orange-100 text-sm">Transactions (7d)</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <AnalyticsCharts userGrowth={userGrowth || []} />

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions?.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          transaction.type === "deposit"
                            ? "bg-green-500"
                            : transaction.type === "withdraw"
                              ? "bg-red-500"
                              : transaction.type === "transfer"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{transaction.profiles.full_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${transaction.amount}</p>
                      <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
