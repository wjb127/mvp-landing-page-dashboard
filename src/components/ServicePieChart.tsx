'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getServiceDisplayName, getServiceColor } from '@/lib/services'

interface ServicePieChartProps {
  data: {
    service: string
    clicks: number
    preorders: number
  }[]
}

export function ServicePieChart({ data }: ServicePieChartProps) {
  const pieData = data.map((item, index) => {
    return {
      name: getServiceDisplayName(item.service),
      value: item.clicks,
      preorders: item.preorders,
      color: getServiceColor(item.service, index).replace('bg-', '') || 'gray-400'
    }
  })

  const COLORS = {
    'blue-500': '#3B82F6',
    'green-500': '#10B981',
    'purple-500': '#8B5CF6',
    'orange-500': '#F97316',
    'red-500': '#EF4444',
    'yellow-500': '#EAB308',
    'pink-500': '#EC4899',
    'indigo-500': '#6366F1',
    'gray-400': '#9CA3AF'
  }

  const getColor = (colorClass: string) => {
    return COLORS[colorClass as keyof typeof COLORS] || COLORS['gray-400']
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; preorders: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            클릭: {data.value.toLocaleString()}회
          </p>
          <p className="text-sm text-gray-600">
            사전예약: {data.preorders.toLocaleString()}건
          </p>
          <p className="text-sm text-gray-600">
            비율: {((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string }> }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 점유율</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 점유율</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.color)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 