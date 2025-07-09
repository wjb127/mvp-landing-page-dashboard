export interface PreorderClick {
  id: string
  service: string
  clicked_at: string
}

export interface Preorder {
  id: string
  service: string
  email: string
  marketing_opt_in: boolean
  created_at: string
}

export interface ServiceStats {
  service: string
  clicks: number
  preorders: number
  marketingOptIns: number
  conversionRate: number
}

export interface DailyStats {
  date: string
  clicks: number
  preorders: number
} 