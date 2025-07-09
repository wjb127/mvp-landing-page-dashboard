'use client'

import { useState } from 'react'
import { MousePointer, Users, Mail, TrendingUp, RefreshCw } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { StatsCard } from '@/components/StatsCard'
import { ServiceBarChart } from '@/components/ServiceBarChart'
import { DailyTrendChart } from '@/components/DailyTrendChart'
import { RecentPreordersTable } from '@/components/RecentPreordersTable'
import { ServiceFilter } from '@/components/ServiceFilter'

export default function Dashboard() {
  const [selectedService, setSelectedService] = useState('all')
  const { loading, error, serviceStats, dailyStats, recentPreorders, refetch } = useAnalytics(selectedService)

  const getServiceDisplayName = (service: string) => {
    const serviceNames: { [key: string]: string } = {
      'all': '전체 서비스',
      'posture': '자세 교정',
      'reading': '독해 훈련',
      'worktracker': '업무 트래커'
    }
    return serviceNames[service] || service
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  // 전체 통계 계산
  const totalStats = serviceStats.reduce(
    (acc, service) => ({
      clicks: acc.clicks + service.clicks,
      preorders: acc.preorders + service.preorders,
      marketingOptIns: acc.marketingOptIns + service.marketingOptIns,
      conversionRate: 0 // 아래에서 계산
    }),
    { clicks: 0, preorders: 0, marketingOptIns: 0, conversionRate: 0 }
  )

  totalStats.conversionRate = totalStats.clicks > 0 
    ? (totalStats.preorders / totalStats.clicks) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">
                현재 보기: <span className="font-semibold text-blue-600">{getServiceDisplayName(selectedService)}</span>
              </p>
            </div>
            <button
              onClick={refetch}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 서비스 필터 */}
        <ServiceFilter 
          selectedService={selectedService}
          onServiceChange={setSelectedService}
        />

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="총 클릭 수"
            value={totalStats.clicks.toLocaleString()}
            icon={MousePointer}
            color="bg-blue-500"
          />
          <StatsCard
            title="총 사전예약 수"
            value={totalStats.preorders.toLocaleString()}
            icon={Users}
            color="bg-green-500"
          />
          <StatsCard
            title="마케팅 수신 동의"
            value={totalStats.marketingOptIns.toLocaleString()}
            icon={Mail}
            color="bg-yellow-500"
          />
          <StatsCard
            title="전환율"
            value={`${totalStats.conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>

        {/* 차트 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ServiceBarChart data={serviceStats} />
          <DailyTrendChart data={dailyStats} />
        </div>

        {/* 최근 사전예약자 테이블 */}
        <RecentPreordersTable data={recentPreorders} selectedService={selectedService} />
      </div>
    </div>
  )
}
