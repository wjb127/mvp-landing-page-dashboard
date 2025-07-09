import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PreorderClick, Preorder, ServiceStats, DailyStats } from '@/types/database'

export const useAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serviceStats, setServiceStats] = useState<ServiceStats[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [recentPreorders, setRecentPreorders] = useState<Preorder[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // 서비스별 통계 가져오기
      const { data: clicks, error: clicksError } = await supabase
        .from('preorder_clicks')
        .select('service')

      const { data: preorders, error: preordersError } = await supabase
        .from('preorders')
        .select('service, marketing_opt_in')

      if (clicksError) throw clicksError
      if (preordersError) throw preordersError

      // 서비스별 통계 계산
      const services = ['posture', 'reading', 'worktracker']
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

      const { data: dailyClicks, error: dailyClicksError } = await supabase
        .from('preorder_clicks')
        .select('clicked_at')
        .gte('clicked_at', thirtyDaysAgo.toISOString())

      const { data: dailyPreorders, error: dailyPreordersError } = await supabase
        .from('preorders')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString())

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
      const { data: recent, error: recentError } = await supabase
        .from('preorders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (recentError) throw recentError
      setRecentPreorders(recent || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    serviceStats,
    dailyStats,
    recentPreorders,
    refetch: fetchAnalytics
  }
} 