"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface WithdrawFormProps {
  availableBalance: number
}

export function WithdrawForm({ availableBalance }: WithdrawFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const withdrawAmount = Number.parseFloat(amount)

    if (withdrawAmount > availableBalance) {
      setError("Insufficient funds")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "withdraw",
          amount: withdrawAmount,
          description: description || "Withdrawal",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process withdrawal")
      }

      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Available Balance:{" "}
          <span className="font-bold">
            {availableBalance.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={availableBalance}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading || !amount}>
          {isLoading ? "Processing..." : "Withdraw Funds"}
        </Button>
      </form>
    </div>
  )
}
