import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Preorder, ServiceStats, DailyStats } from '@/types/database'

export const useAnalytics = (selectedService: string = 'all') => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [recentPreorders, setRecentPreorders] = useState<Preorder[]>([])

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 서비스별 통계 가져오기
      let clicksQuery = supabase.from('preorder_clicks').select('service')
      let preordersQuery = supabase.from('preorders').select('service, marketing_opt_in')
      
      // 선택된 서비스가 'all'이 아닌 경우 필터 적용
      if (selectedService !== 'all') {
        clicksQuery = clicksQuery.eq('service', selectedService)
        preordersQuery = preordersQuery.eq('service', selectedService)
      }

      const { data: clicks, error: clicksError } = await clicksQuery
      const { data: preorders, error: preordersError } = await preordersQuery

      if (clicksError) throw clicksError
      if (preordersError) throw preordersError

      // 서비스별 통계 계산
      const services = selectedService === 'all' 
        ? ['posture', 'reading', 'worktracker']
        : [selectedService]
        
      const stats = services.map(service => {
        const serviceClicks = clicks?.filter(c => c.service === service).length || 0
        const servicePreorders = preorders?.filter(p => p.service === service).length || 0
        const marketingOptIns = preorders?.filter(p => p.service === service && p.marketing_opt_in).length || 0
        const conversionRate = serviceClicks > 0 ? (servicePreorders / serviceClicks) * 100 : 0

        return {
          service,
          clicks: serviceClicks,
          preorders: servicePreorders,
          marketingOptIns,
          conversionRate
        }
      })

      setServiceStats(stats)

      // 일별 통계 가져오기 (최근 30일)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      let dailyClicksQuery = supabase
        .from('preorder_clicks')
        .select('clicked_at, service')
        .gte('clicked_at', thirtyDaysAgo.toISOString())

      let dailyPreordersQuery = supabase
        .from('preorders')
        .select('created_at, service')
        .gte('created_at', thirtyDaysAgo.toISOString())

      // 선택된 서비스가 'all'이 아닌 경우 필터 적용
      if (selectedService !== 'all') {
        dailyClicksQuery = dailyClicksQuery.eq('service', selectedService)
        dailyPreordersQuery = dailyPreordersQuery.eq('service', selectedService)
      }

      const { data: dailyClicks, error: dailyClicksError } = await dailyClicksQuery
      const { data: dailyPreorders, error: dailyPreordersError } = await dailyPreordersQuery

      if (dailyClicksError) throw dailyClicksError
      if (dailyPreordersError) throw dailyPreordersError

      // 일별 데이터 그룹화
      const dailyData: { [key: string]: { clicks: number; preorders: number } } = {}
      
      // 지난 30일간 날짜 초기화
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        dailyData[dateStr] = { clicks: 0, preorders: 0 }
      }

      // 클릭 데이터 집계
      dailyClicks?.forEach(click => {
        const date = new Date(click.clicked_at).toISOString().split('T')[0]
        if (dailyData[date]) {
          dailyData[date].clicks++
        }
      })

      // 사전예약 데이터 집계
      dailyPreorders?.forEach(preorder => {
        const date = new Date(preorder.created_at).toISOString().split('T')[0]
        if (dailyData[date]) {
          dailyData[date].preorders++
        }
      })

      const dailyStatsArray = Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          clicks: data.clicks,
          preorders: data.preorders
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setDailyStats(dailyStatsArray)

      // 최근 사전예약자 가져오기
      let recentQuery = supabase
        .from('preorders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      // 선택된 서비스가 'all'이 아닌 경우 필터 적용
      if (selectedService !== 'all') {
        recentQuery = recentQuery.eq('service', selectedService)
      }

      const { data: recent, error: recentError } = await recentQuery

      if (recentError) throw recentError
      setRecentPreorders(recent || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [selectedService])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    loading,
    error,
    serviceStats,
    dailyStats,
    recentPreorders,
    refetch: fetchAnalytics
  }
} 