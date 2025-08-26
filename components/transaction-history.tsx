"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Transaction {
  id: string
  type: string
  amount: number
  description: string
  recipient_email?: string
  status: string
  created_at: string
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?limit=10")
        if (!response.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data = await response.json()
        setTransactions(data.transactions)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "withdraw":
        return "text-blue-600"
      case "transfer":
        return "text-orange-600"
      case "invest":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTransactionSign = (type: string) => {
    return type === "deposit" ? "+" : "-"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading transactions...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {transaction.recipient_email && (
                    <p className="text-sm text-gray-500">To: {transaction.recipient_email}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                    {getTransactionSign(transaction.type)}
                    {transaction.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
