"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UserGrowthData {
  created_at: string
}

interface AnalyticsChartsProps {
  userGrowth: UserGrowthData[]
}

export function AnalyticsCharts({ userGrowth }: AnalyticsChartsProps) {
  // Process user growth data for chart
  const chartData = userGrowth.reduce((acc: any[], user) => {
    const date = new Date(user.created_at).toLocaleDateString()
    const existing = acc.find((item) => item.date === date)

    if (existing) {
      existing.users += 1
    } else {
      acc.push({ date, users: 1 })
    }

    return acc
  }, [])

  // Calculate cumulative users
  let cumulative = 0
  const cumulativeData = chartData.map((item) => {
    cumulative += item.users
    return { ...item, cumulative }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New user registrations over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} tick={{ fontSize: 10 }} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="cumulative" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
