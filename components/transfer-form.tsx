"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

interface TransferFormProps {
  availableBalance: number
}

export function TransferForm({ availableBalance }: TransferFormProps) {
  const [amount, setAmount] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const transferAmount = Number.parseFloat(amount)

    if (transferAmount > availableBalance) {
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
          type: "transfer",
          amount: transferAmount,
          recipient_email: recipientEmail,
          description: description || `Transfer to ${recipientEmail}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process transfer")
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
          <Label htmlFor="recipientEmail">Recipient Email</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="recipient@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>

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

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700"
          disabled={isLoading || !amount || !recipientEmail}
        >
          {isLoading ? "Processing..." : "Transfer Funds"}
        </Button>
      </form>
    </div>
  )
}
