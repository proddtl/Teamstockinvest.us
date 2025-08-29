"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
}

export function PageHeader({ title, showBackButton = false, backUrl = "/dashboard" }: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    router.push(backUrl)
  }

  return (
    <div className="bg-white px-4 py-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
    </div>
  )
}
