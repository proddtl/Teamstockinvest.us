import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { AccountBalance } from "@/components/account-balance"
import { MetricCards } from "@/components/metric-cards"
import { MoreOptions } from "@/components/more-options"
import { BottomNavigation } from "@/components/bottom-navigation"
import { TransactionHistory } from "@/components/transaction-history"

export default async function DashboardPage() {
  const supabase = await createClient()

    const {
        data: { user },
            error: userError,
              } = await supabase.auth.getUser()

                if (userError || !user) {
                    redirect("/auth/login")
                      }

                        // Get user profile and account data
                          const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single().catch(() => ({ data: null, error: true }))

                            const { data: account, error: accountError } = await supabase.from("accounts").select("*").eq("user_id", user.id).single().catch(() => ({ data: null, error: true }))

                              return (
                                  <div className="min-h-screen bg-gray-100 flex flex-col">
                                        {/* Success notification */}
                                              <div className="bg-green-100 border-l-4 border-green-500 p-4 flex items-center justify-between">
                                                      <div className="flex items-center">
                                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                          <path
                                                                                                          fillRule="evenodd"
                                                                                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                                                          clipRule="evenodd"
                                                                                                                                                        />
                                                                                                                                                                    </svg>
                                                                                                                                                                              </div>
                                                                                                                                                                                        <span className="text-green-800 font-medium">Successfully Logged In</span>
                                                                                                                                                                                                </div>
                                                                                                                                                                                                        <button className="text-green-600 hover:text-green-800">
                                                                                                                                                                                                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                                                                                                                                                                              <path
                                                                                                                                                                                                                                            fillRule="evenodd"
                                                                                                                                                                                                                                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                                                                                                                                                                                                        clipRule="evenodd"
                                                                                                                                                                                                                                                                                    />
                                                                                                                                                                                                                                                                                              </svg>
                                                                                                                                                                                                                                                                                                      </button>
                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                  <DashboardHeader userName={profile?.full_name || "User"} />

                                                                                                                                                                                                                                                                                                                        <div className="flex-1 p-4 pb-24 space-y-6">
                                                                                                                                                                                                                                                                                                                                <AccountBalance balance={account?.account_balance || 0} />
                                                                                                                                                                                                                                                                                                                                        <MetricCards
                                                                                                                                                                                                                                                                                                                                                  totalWithdraw={account?.total_withdraw || 0}
                                                                                                                                                                                                                                                                                                                                                            totalDeposit={account?.total_deposit || 0}
                                                                                                                                                                                                                                                                                                                                                                      totalInvest={account?.total_invest || 0}
                                                                                                                                                                                                                                                                                                                                                                                currentInvest={account?.current_invest || 0}
                                                                                                                                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                                                                                                                                                <MoreOptions />
                                                                                                                                                                                                                                                                                                                                                                                                        <TransactionHistory />
                                                                                                                                                                                                                                                                                                                                                                                                              </div>

                                                                                                                                                                                                                                                                                                                                                                                                                    <BottomNavigation />
                                                                                                                                                                                                                                                                                                                                                                                                                        </div>
                                                                                                                                                                                                                                                                                                                                                                                                                          )
                                                                                                                                                                                                                                                                                                                                                                                                                          }
