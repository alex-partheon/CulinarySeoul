import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { EnhancedMetricCard } from '@/components/dashboard/shared/EnhancedMetricCard'
import { AlertsFeed, type Alert } from '@/components/dashboard/shared/AlertsFeed'
import { RecentChanges, type Change } from '@/components/dashboard/shared/RecentChanges'
import { SummaryChart } from '@/components/dashboard/shared/SummaryChart'
import { SalesChart } from '../../components/dashboard/SalesChart'
import { PopularItems } from '../../components/dashboard/PopularItems'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import { Alert as AlertComponent, AlertDescription, AlertTitle } from '../../components/ui/alert'
import { toast } from 'react-hot-toast'
import { 
  AlertCircle, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Store,
  Plus,
  BarChart3,
  Menu,
  Tag,
  Calendar,
  Star
} from 'lucide-react'
import { useTheme } from '../../components/theme/BrandThemeProvider'

export function BrandDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { brandId } = useParams<{ brandId: string }>()
  const { brandTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulated data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Mock brand data - replace with actual data from API
  const brandName = '밀랍' // This should come from API based on brandId

  const metrics = [
    {
      title: '브랜드 매출',
      value: '₩2.89B',
      change: { value: 15.6, type: 'increase' as const },
      subtitle: '전월 대비',
      icon: DollarSign,
      iconColor: 'text-green-600',
      trend: { data: [2.1, 2.3, 2.4, 2.5, 2.6, 2.8, 2.89], color: '#10B981' }
    },
    {
      title: '매장 수',
      value: 15,
      change: { value: 7.1, type: 'increase' as const },
      subtitle: '전월 대비 +1개',
      icon: Store,
      iconColor: 'text-blue-600',
      trend: { data: [14, 14, 14, 15, 15, 15, 15] }
    },
    {
      title: '주문 수',
      value: '12,456',
      change: { value: 8.3, type: 'increase' as const },
      subtitle: '이번 달 누적',
      icon: ShoppingBag,
      iconColor: 'text-purple-600',
      trend: { data: [10200, 10800, 11200, 11600, 11900, 12200, 12456] }
    },
    {
      title: '고객 수',
      value: '45,231',
      change: { value: 12.4, type: 'increase' as const },
      subtitle: '활성 고객',
      icon: Users,
      iconColor: 'text-orange-600',
      trend: { data: [38000, 39500, 41000, 42500, 43800, 44500, 45231] }
    }
  ]

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: '재고 부족 경고',
      message: '성수점 시그니처 라떼 원두 재고가 3일분 남았습니다',
      timestamp: new Date(Date.now() - 15 * 60000),
      category: '재고관리',
      read: false,
      actionLabel: '발주하기',
      onAction: () => navigate(`/brand/${brandId}/inventory/orders`)
    },
    {
      id: '2',
      type: 'success',
      title: '일일 매출 목표 달성',
      message: '강남점이 일일 매출 목표를 120% 달성했습니다',
      timestamp: new Date(Date.now() - 2 * 3600000),
      category: '매출관리',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: '신메뉴 출시 알림',
      message: '다음 주 월요일부터 여름 시즌 메뉴가 출시됩니다',
      timestamp: new Date(Date.now() - 5 * 3600000),
      category: '메뉴관리',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'POS 연결 오류',
      message: '판교점 POS 시스템 연결이 불안정합니다',
      timestamp: new Date(Date.now() - 30 * 60000),
      category: '시스템',
      read: false,
      actionLabel: '지원 요청',
      onAction: () => navigate(`/brand/${brandId}/system/support`)
    }
  ]

  const recentChanges: Change[] = [
    {
      id: '1',
      type: 'update',
      category: 'menu',
      title: '메뉴 가격 조정',
      description: '아메리카노 가격이 4,500원에서 4,800원으로 조정되었습니다',
      user: { name: '김점장', role: '강남점 점장' },
      timestamp: new Date(Date.now() - 20 * 60000),
      metadata: { before: '₩4,500', after: '₩4,800', location: '전 매장' }
    },
    {
      id: '2',
      type: 'create',
      category: 'staff',
      title: '신규 직원 등록',
      description: '성수점에 새로운 바리스타가 합류했습니다',
      user: { name: '이인사', role: 'HR 매니저' },
      timestamp: new Date(Date.now() - 3 * 3600000),
      metadata: { location: '성수점' }
    },
    {
      id: '3',
      type: 'update',
      category: 'marketing',
      title: '프로모션 시작',
      description: '여름 시즌 2+1 프로모션이 시작되었습니다',
      user: { name: '박마케터', role: '마케팅 팀장' },
      timestamp: new Date(Date.now() - 6 * 3600000),
      metadata: { count: 5 }
    }
  ]

  const storeChartData = [
    { name: '강남점', 매출: 450, 주문: 156, 고객: 823 },
    { name: '성수점', 매출: 380, 주문: 134, 고객: 756 },
    { name: '판교점', 매출: 320, 주문: 112, 고객: 634 },
    { name: '홍대점', 매출: 290, 주문: 98, 고객: 567 },
    { name: '여의도점', 매출: 260, 주문: 87, 고객: 489 },
    { name: '신촌점', 매출: 240, 주문: 76, 고객: 423 },
    { name: '잠실점', 매출: 220, 주문: 68, 고객: 387 }
  ]

  const quickActions = [
    {
      title: '새 메뉴 추가',
      description: '메뉴 등록',
      icon: Menu,
      onClick: () => navigate(`/brand/${brandId}/menu/new`),
      color: 'primary' as const
    },
    {
      title: '프로모션 생성',
      description: '할인 이벤트',
      icon: Tag,
      onClick: () => navigate(`/brand/${brandId}/promotions/new`),
      color: 'secondary' as const
    },
    {
      title: '재고 발주',
      description: '물품 주문',
      icon: Plus,
      onClick: () => navigate(`/brand/${brandId}/inventory/orders`),
      color: 'default' as const
    },
    {
      title: '매출 분석',
      description: '상세 리포트',
      icon: BarChart3,
      onClick: () => navigate(`/brand/${brandId}/analytics/sales`),
      color: 'secondary' as const
    },
    {
      title: '직원 관리',
      description: '근무 스케줄',
      icon: Users,
      onClick: () => navigate(`/brand/${brandId}/staff`),
      color: 'default' as const
    },
    {
      title: '고객 리뷰',
      description: '피드백 확인',
      icon: Star,
      onClick: () => navigate(`/brand/${brandId}/marketing/reviews`),
      color: 'primary' as const
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <AlertComponent variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </AlertComponent>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{brandName} 브랜드 대시보드</h1>
          <p className="text-gray-600 mt-1">브랜드 전체 매장의 통합 현황을 확인하세요</p>
        </div>
        <Button onClick={() => navigate(`/brand/${brandId}/analytics`)}>
          <BarChart3 className="h-4 w-4 mr-2" />
          상세 분석
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <EnhancedMetricCard
            key={index}
            {...metric}
            onClick={() => {
              toast.success(`${metric.title} 상세 보기`)
            }}
          />
        ))}
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Store Performance Chart */}
          <SummaryChart
            title="매장별 성과"
            data={storeChartData}
            type="bar"
            dataKeys={['매출']}
            colors={['#F59E0B']}
            height={300}
            showLegend={false}
            summary={{
              total: '₩2.89B',
              change: 15.6,
              changeType: 'increase'
            }}
            onPeriodChange={(period) => {
              toast.success(`기간 변경: ${period}`)
            }}
          />

          {/* Sales Chart */}
          <SalesChart />

          {/* Popular Items */}
          <PopularItems />
        </div>

        <div className="space-y-6">
          {/* Alerts Feed */}
          <AlertsFeed
            alerts={alerts}
            onMarkAsRead={(id) => {
              toast.success('읽음으로 표시됨')
            }}
            onDismiss={(id) => {
              toast.success('알림 삭제됨')
            }}
            onViewAll={() => navigate(`/brand/${brandId}/alerts`)}
          />

          {/* Recent Changes */}
          <RecentChanges
            changes={recentChanges}
            onViewDetails={(change) => {
              toast.success(`상세 보기: ${change.title}`)
            }}
            onViewAll={() => navigate(`/brand/${brandId}/system/audit-logs`)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">빠른 작업</h2>
        <QuickActions
          actions={quickActions}
          columns={6}
          variant="card"
        />
      </div>
    </div>
  )
}