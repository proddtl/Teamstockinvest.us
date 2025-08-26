"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export function AdminNavButton() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const supabase = createBrowserClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      setIsAdmin(profile?.role === "admin")
      setLoading(false)
    }

    checkAdminStatus()
  }, [])

  if (loading || !isAdmin) return null

  return (
    <Link href="/admin/analytics">
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <BarChart3 className="h-4 w-4" />
        Analytics
      </Button>
    </Link>
  )
}
