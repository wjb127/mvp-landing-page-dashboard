'use client'

import { useAnalytics } from '@/hooks/useAnalytics'
import { ServicePieChart } from '@/components/ServicePieChart'
import { StatsCard } from '@/components/StatsCard'
import { Navigation } from '@/components/Navigation'
import { createServiceConfig } from '@/lib/services'

export default function OverviewPage() {
  const { serviceStats, availableServices, loading, error } = useAnalytics('all')

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">오류가 발생했습니다: {error}</div>
          </div>
        </div>
      </div>
    )
  }

  // 서비스별 데이터 집계 (serviceStats를 직접 사용)
  const aggregatedStats = serviceStats.map(stat => ({
    service: stat.service,
    clicks: stat.clicks,
    preorders: stat.preorders
  }))

  const totalClicks = aggregatedStats.reduce((sum, item) => sum + item.clicks, 0)
  const totalPreorders = aggregatedStats.reduce((sum, item) => sum + item.preorders, 0)
  
  // 동적 서비스 설정 생성
  const dynamicServices = createServiceConfig(availableServices)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">서비스 종합 현황</h1>
            <p className="text-gray-600">모든 서비스의 전체적인 성과를 확인하세요</p>
          </div>
        </div>
      </div>
      
      {/* 네비게이션 */}
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">

        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="총 클릭 수"
            value={totalClicks}
            change={0}
            icon="👆"
          />
          <StatsCard
            title="총 사전예약"
            value={totalPreorders}
            change={0}
            icon="📝"
          />
          <StatsCard
            title="전환율"
            value={totalClicks > 0 ? ((totalPreorders / totalClicks) * 100) : 0}
            change={0}
            icon="📊"
            isPercentage
          />
          <StatsCard
            title="서비스 수"
            value={availableServices.length}
            change={0}
            icon="🚀"
          />
        </div>

        {/* 서비스별 점유율 차트 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ServicePieChart data={serviceStats} />
          
          {/* 서비스별 상세 통계 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 상세 통계</h3>
            <div className="space-y-4">
              {serviceStats.map((stat) => {
                const service = dynamicServices.find(s => s.value === stat.service)
                const clickPercent = totalClicks > 0 ? (stat.clicks / totalClicks) * 100 : 0
                const preorderPercent = totalPreorders > 0 ? (stat.preorders / totalPreorders) * 100 : 0
                
                return (
                  <div key={stat.service} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full ${service?.color}`} />
                      <h4 className="font-medium text-gray-900">{service?.label}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">클릭 수</div>
                        <div className="font-medium">{stat.clicks.toLocaleString()}회</div>
                        <div className="text-xs text-gray-500">{clickPercent.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-600">사전예약</div>
                        <div className="font-medium">{stat.preorders.toLocaleString()}건</div>
                        <div className="text-xs text-gray-500">{preorderPercent.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-gray-600">전환율</div>
                      <div className="font-medium">
                        {stat.clicks > 0 ? ((stat.preorders / stat.clicks) * 100).toFixed(2) : 0}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 서비스별 성과 순위 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스 성과 순위</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-3">클릭 수 순위</h4>
              <div className="space-y-2">
                {serviceStats
                  .sort((a, b) => b.clicks - a.clicks)
                  .map((stat, index) => {
                    const service = dynamicServices.find(s => s.value === stat.service)
                    return (
                      <div key={stat.service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <div className={`w-3 h-3 rounded-full ${service?.color}`} />
                          <span className="text-sm font-medium">{service?.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">{stat.clicks.toLocaleString()}회</span>
                      </div>
                    )
                  })}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-3">사전예약 순위</h4>
              <div className="space-y-2">
                {serviceStats
                  .sort((a, b) => b.preorders - a.preorders)
                  .map((stat, index) => {
                    const service = dynamicServices.find(s => s.value === stat.service)
                    return (
                      <div key={stat.service} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                          <div className={`w-3 h-3 rounded-full ${service?.color}`} />
                          <span className="text-sm font-medium">{service?.label}</span>
                        </div>
                        <span className="text-sm text-gray-600">{stat.preorders.toLocaleString()}건</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 