'use client'

import { Filter } from 'lucide-react'

interface ServiceFilterProps {
  selectedService: string
  onServiceChange: (service: string) => void
}

const services = [
  { value: 'all', label: '전체 서비스', color: 'bg-gray-500' },
  { value: 'posture', label: '자세 교정', color: 'bg-blue-500' },
  { value: 'reading', label: '독해 훈련', color: 'bg-green-500' },
  { value: 'worktracker', label: '업무 트래커', color: 'bg-purple-500' }
]

export const ServiceFilter = ({ selectedService, onServiceChange }: ServiceFilterProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">서비스 필터</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {services.map((service) => (
          <button
            key={service.value}
            onClick={() => onServiceChange(service.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedService === service.value
                ? `${service.color} text-white`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {service.label}
          </button>
        ))}
      </div>
    </div>
  )
} 