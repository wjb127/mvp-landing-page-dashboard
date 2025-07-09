'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DailyStats } from '@/types/database'

interface DailyTrendChartProps {
  data: DailyStats[]
}

export const DailyTrendChart = ({ data }: DailyTrendChartProps) => {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
    클릭수: item.clicks,
    사전예약수: item.preorders
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 추이 (최근 30일)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="클릭수" stroke="#3B82F6" strokeWidth={2} />
            <Line type="monotone" dataKey="사전예약수" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 