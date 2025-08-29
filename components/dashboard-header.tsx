import { LogoutButton } from "@/components/logout-button"

interface DashboardHeaderProps {
  userName: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="bg-white px-4 py-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* topstock logo */}
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center relative">
          <div className="w-4 h-4 bg-yellow-300 rounded-sm transform rotate-45 absolute top-1 left-1"></div>
          <div className="w-4 h-4 bg-yellow-200 rounded-sm transform rotate-45 absolute top-2 left-3"></div>
          <div className="w-4 h-4 bg-yellow-100 rounded-sm transform rotate-45 absolute top-3 left-5"></div>
        </div>
        <span className="text-2xl font-bold text-gray-800">topstock</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">{userName}</span>
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
