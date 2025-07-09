'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, PieChart } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: '서비스별 대시보드',
      icon: BarChart3
    },
    {
      href: '/overview',
      label: '종합 현황',
      icon: PieChart
    }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 