import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import {
  useDashboardStats,
  useMonthlySales,
  useDailySales,
} from '@/hooks/dashboard/useDashboard'
import {
  IndianRupee,
  ShoppingCart,
  Users,
} from 'lucide-react'

export default function DashboardPage() {
  const { data: stats, isLoading: loadingStats } = useDashboardStats()
  const { data: monthlySales, isLoading: loadingMonthly } = useMonthlySales()
  const { data: dailySales, isLoading: loadingDaily } = useDailySales(30)


  const loading = loadingStats || loadingMonthly || loadingDaily

  if (loading) {
    return (
      <div className="p-6 text-muted-foreground animate-pulse">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Revenue"
          value={`₹${stats?.totalRevenue}`}
          icon={<IndianRupee className="w-5 h-5 text-muted-foreground" />}
        />
        <StatCard
          label="Orders"
          value={stats?.totalOrders}
          icon={<ShoppingCart className="w-5 h-5 text-muted-foreground" />}
        />
        <StatCard
          label="Customers"
          value={stats?.totalCustomers}
          icon={<Users className="w-5 h-5 text-muted-foreground" />}
        />
      </div>

      <Separator className="my-4" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Monthly Sales Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-0 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Daily Sales (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-0 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}
