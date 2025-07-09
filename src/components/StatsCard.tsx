import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon | string
  color?: string
  change?: number
  isPercentage?: boolean
}

export const StatsCard = ({ title, value, icon, color = 'bg-blue-500', isPercentage }: StatsCardProps) => {
  const displayValue = isPercentage ? `${typeof value === 'number' ? value.toFixed(2) : value}%` : value
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {typeof icon === 'string' ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            React.createElement(icon, { className: "w-6 h-6 text-white" })
          )}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{displayValue}</p>
        </div>
      </div>
    </div>
  )
} 