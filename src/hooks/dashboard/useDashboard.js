import { useQuery } from '@tanstack/react-query'
import axios from '@/lib/axios'

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await axios.get('/analytic/admin/dashboard-stats')
      return res.data.data
    },
  })
}

export const useMonthlySales = () => {
  return useQuery({
    queryKey: ['monthlySales'],
    queryFn: async () => {
      const res = await axios.get('/analytic/admin/analytics/sales/monthly')
      return res.data.data
    },
  })
}

export function useDailySales(days = 30) {
  return useQuery({
    queryKey: ['daily-sales', days],
    queryFn: async () => {
      const { data } = await axios.get(`analytic/admin/analytics/sales/daily?days=${days}`)
      return data.data
    },
  })
}