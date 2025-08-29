"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface InvestFormProps {
  availableBalance: number
}

export function InvestForm({ availableBalance }: InvestFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const investmentOptions = [
    { name: "Conservative Portfolio", risk: "Low", expectedReturn: "3-5%" },
    { name: "Balanced Portfolio", risk: "Medium", expectedReturn: "5-8%" },
    { name: "Growth Portfolio", risk: "High", expectedReturn: "8-12%" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const investAmount = Number.parseFloat(amount)

    if (investAmount > availableBalance) {
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
          type: "invest",
          amount: investAmount,
          description: description || "Investment",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process investment")
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Investment Options</h3>
        <div className="grid gap-4">
          {investmentOptions.map((option, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-800">{option.name}</h4>
                  <p className="text-sm text-gray-600">Risk: {option.risk}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">{option.expectedReturn}</p>
                  <p className="text-xs text-gray-500">Expected Return</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Investment Amount</Label>
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
          <Label htmlFor="description">Investment Description (Optional)</Label>
          <Input
            id="description"
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading || !amount}>
          {isLoading ? "Processing..." : "Invest Funds"}
        </Button>
      </form>
    </div>
  )
}
