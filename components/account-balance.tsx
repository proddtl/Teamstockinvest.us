interface AccountBalanceProps {}

export function AccountBalance({}: AccountBalanceProps) {
  const balance = 596.67;

    return (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
              {/* Background decoration */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                          <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full"></div>

                                <div className="relative">
                                        <div className="flex items-center justify-between mb-4">
                                                  <h2 className="text-lg font-medium opacity-90">Account balance</h2>
                                                            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                                                                    </div>

                                                                            <div className="text-4xl font-bold">
                                                                                      {balance.toLocaleString("en-US", {
                                                                                                  style: "currency",
                                                                                                              currency: "USD",
                                                                                                                          minimumFractionDigits: 2,
                                                                                                                                    })}
                                                                                                                                            </div>
                                                                                                                                                  </div>
                                                                                                                                                     </div>
                                                                                                                                                        )
                                                                                                                                                        }
