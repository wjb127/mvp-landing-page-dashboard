'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ServiceStats } from '@/types/database'

interface ServiceBarChartProps {
  data: ServiceStats[]
}

const getServiceDisplayName = (service: string) => {
  const serviceNames: { [key: string]: string } = {
    'posture': '자세 교정',
    'reading': '독해 훈련',
    'worktracker': '업무 트래커'
  }
  return serviceNames[service] || service
}

export const ServiceBarChart = ({ data }: ServiceBarChartProps) => {
  const chartData = data.map(item => ({
    service: getServiceDisplayName(item.service),
    클릭수: item.clicks,
    사전예약수: item.preorders,
    마케팅동의수: item.marketingOptIns
  }))

  const chartTitle = data.length === 1 
    ? `${getServiceDisplayName(data[0].service)} 통계`
    : '서비스별 통계'

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{chartTitle}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="service" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="클릭수" fill="#3B82F6" />
            <Bar dataKey="사전예약수" fill="#10B981" />
            <Bar dataKey="마케팅동의수" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 