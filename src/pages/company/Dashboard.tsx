import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router'
import { EnhancedMetricCard } from '@/components/dashboard/shared/EnhancedMetricCard'
import { AlertsFeed, type Alert } from '@/components/dashboard/shared/AlertsFeed'
import { RecentChanges, type Change } from '@/components/dashboard/shared/RecentChanges'
import { SummaryChart } from '@/components/dashboard/shared/SummaryChart'
import { BrandPerformanceGrid } from '@/components/dashboard/company/BrandPerformanceGrid'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'react-hot-toast'
import {
  Building2,
  Store,
  Users,
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Plus,
  BarChart3,
  Calendar,
  FileText
} from 'lucide-react'

export function CompanyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  
  // Simulated data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  // Mock data for demonstration
  const metrics = [
    {
      title: '총 매출',
      value: '₩12.4B',
      change: { value: 15.3, type: 'increase' as const },
      subtitle: '전월 대비',
      icon: DollarSign,
      iconColor: 'text-green-600',
      trend: { data: [8, 9, 10, 11, 10, 12, 12.4], color: '#10B981' }
    },
    {
      title: '활성 브랜드',
      value: 5,
      change: { value: 25, type: 'increase' as const },
      subtitle: '신규 1개 추가',
      icon: Building2,
      iconColor: 'text-blue-600',
      trend: { data: [4, 4, 4, 5, 5, 5, 5] }
    },
    {
      title: '전체 매장',
      value: 48,
      change: { value: 8.3, type: 'increase' as const },
      subtitle: '전월 대비 +4개',
      icon: Store,
      iconColor: 'text-purple-600',
      trend: { data: [42, 43, 44, 44, 46, 47, 48] }
    },
    {
      title: '총 직원 수',
      value: '1,245',
      change: { value: 5.7, type: 'increase' as const },
      subtitle: '신규 채용 67명',
      icon: Users,
      iconColor: 'text-orange-600',
      trend: { data: [1150, 1180, 1200, 1220, 1230, 1240, 1245] }
    }
  ]

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: '재고 부족 경고',
      message: '강남점에서 3개 품목의 재고가 부족합니다',
      timestamp: new Date(Date.now() - 10 * 60000),
      category: '재고관리',
      read: false,
      actionLabel: '재고 확인',
      onAction: () => navigate('/company/inventory/alerts')
    },
    {
      id: '2',
      type: 'warning',
      title: '매출 목표 미달',
      message: '밀랍 브랜드가 이번 주 매출 목표의 85%만 달성했습니다',
      timestamp: new Date(Date.now() - 30 * 60000),
      category: '매출관리',
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: '신규 매장 오픈',
      message: '밀랍 판교점이 성공적으로 오픈했습니다',
      timestamp: new Date(Date.now() - 2 * 3600000),
      category: '매장관리',
      read: true
    },
    {
      id: '4',
      type: 'info',
      title: '시스템 업데이트',
      message: 'POS 시스템이 v2.5.0으로 업데이트되었습니다',
      timestamp: new Date(Date.now() - 24 * 3600000),
      category: '시스템',
      read: true
    }
  ]

  const recentChanges: Change[] = [
    {
      id: '1',
      type: 'create',
      category: 'menu',
      title: '신메뉴 추가',
      description: '밀랍 브랜드에 "시그니처 라떼" 메뉴가 추가되었습니다',
      user: { name: '김철수', role: '메뉴 관리자' },
      timestamp: new Date(Date.now() - 15 * 60000),
      metadata: { location: '밀랍 전 매장' }
    },
    {
      id: '2',
      type: 'update',
      category: 'inventory',
      title: '재고 수량 조정',
      description: '원두 재고 수량이 업데이트되었습니다',
      user: { name: '이영희', role: '재고 관리자' },
      timestamp: new Date(Date.now() - 45 * 60000),
      metadata: { before: '500kg', after: '750kg', location: '중앙 창고' }
    },
    {
      id: '3',
      type: 'config',
      category: 'system',
      title: '할인율 정책 변경',
      description: '멤버십 할인율이 10%에서 15%로 상향 조정되었습니다',
      user: { name: '박민수', role: '시스템 관리자' },
      timestamp: new Date(Date.now() - 2 * 3600000),
      metadata: { before: '10%', after: '15%' }
    }
  ]

  const chartData = [
    { name: '1월', 밀랍: 2400, 브루잉: 1398, 로스터리: 2210, 베이커리: 1890, 델리: 2390 },
    { name: '2월', 밀랍: 3000, 브루잉: 2000, 로스터리: 2290, 베이커리: 2000, 델리: 2490 },
    { name: '3월', 밀랍: 2000, 브루잉: 2780, 로스터리: 2000, 베이커리: 2180, 델리: 2290 },
    { name: '4월', 밀랍: 2780, 브루잉: 3908, 로스터리: 2400, 베이커리: 2380, 델리: 2590 },
    { name: '5월', 밀랍: 1890, 브루잉: 4800, 로스터리: 2181, 베이커리: 2580, 델리: 2890 },
    { name: '6월', 밀랍: 2390, 브루잉: 3800, 로스터리: 2500, 베이커리: 2780, 델리: 3190 },
    { name: '7월', 밀랍: 3490, 브루잉: 4300, 로스터리: 2800, 베이커리: 2980, 델리: 3490 }
  ]

  const brandPerformance = [
    {
      id: '1',
      name: '밀랍',
      color: '#F59E0B',
      stores: 15,
      employees: 380,
      revenue: { current: 2890000000, previous: 2500000000, change: 15.6 },
      orders: { today: 1245, change: 8.3 },
      rating: 4.7,
      health: { score: 92, status: 'excellent' as const },
      topMetric: { label: '베스트셀러', value: '시그니처 라떼' }
    },
    {
      id: '2',
      name: '브루잉',
      color: '#3B82F6',
      stores: 12,
      employees: 295,
      revenue: { current: 2150000000, previous: 2000000000, change: 7.5 },
      orders: { today: 987, change: -2.1 },
      rating: 4.5,
      health: { score: 78, status: 'good' as const }
    },
    {
      id: '3',
      name: '로스터리',
      color: '#10B981',
      stores: 8,
      employees: 210,
      revenue: { current: 1560000000, previous: 1680000000, change: -7.1 },
      orders: { today: 654, change: -5.3 },
      rating: 4.3,
      health: { score: 65, status: 'warning' as const }
    },
    {
      id: '4',
      name: '베이커리',
      color: '#8B5CF6',
      stores: 7,
      employees: 185,
      revenue: { current: 1230000000, previous: 1100000000, change: 11.8 },
      orders: { today: 543, change: 15.2 },
      rating: 4.8,
      health: { score: 88, status: 'good' as const }
    },
    {
      id: '5',
      name: '델리',
      color: '#EF4444',
      stores: 6,
      employees: 175,
      revenue: { current: 980000000, previous: 920000000, change: 6.5 },
      orders: { today: 421, change: 3.7 },
      rating: 4.4,
      health: { score: 72, status: 'good' as const }
    }
  ]

  const quickActions = [
    {
      title: '새 브랜드 등록',
      description: '신규 브랜드 추가',
      icon: Plus,
      onClick: () => navigate('/company/brands/new'),
      color: 'primary' as const
    },
    {
      title: '재고 현황',
      description: '전체 재고 확인',
      icon: Package,
      onClick: () => navigate('/company/inventory'),
      color: 'secondary' as const
    },
    {
      title: '매출 리포트',
      description: '상세 분석 보기',
      icon: BarChart3,
      onClick: () => navigate('/company/analytics/sales'),
      color: 'default' as const
    },
    {
      title: '직원 관리',
      description: '인사 관리',
      icon: Users,
      onClick: () => navigate('/company/staff'),
      color: 'secondary' as const
    },
    {
      title: '일정 관리',
      description: '이벤트 확인',
      icon: Calendar,
      onClick: () => navigate('/company/operations/schedule'),
      color: 'default' as const
    },
    {
      title: '보고서 생성',
      description: '맞춤 리포트',
      icon: FileText,
      onClick: () => navigate('/company/analytics/custom'),
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">전체 현황 대시보드</h1>
          <p className="text-gray-600 mt-1">CulinarySeoul 전체 브랜드 및 매장의 통합 현황입니다</p>
        </div>
        <Button onClick={() => navigate('/company/analytics')}>
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
          {/* Revenue Chart */}
          <SummaryChart
            title="브랜드별 매출 추이"
            data={chartData}
            type="area"
            dataKeys={['밀랍', '브루잉', '로스터리', '베이커리', '델리']}
            colors={['#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EF4444']}
            height={300}
            showLegend={true}
            summary={{
              total: '₩12.4B',
              change: 15.3,
              changeType: 'increase'
            }}
            onPeriodChange={(period) => {
              toast.success(`기간 변경: ${period}`)
            }}
          />

          {/* Brand Performance Grid */}
          <BrandPerformanceGrid
            brands={brandPerformance}
            onBrandClick={(brandId) => navigate(`/brand/${brandId}`)}
            onViewDetails={(brandId) => navigate(`/brand/${brandId}/analytics`)}
          />
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
            onViewAll={() => navigate('/company/alerts')}
          />

          {/* Recent Changes */}
          <RecentChanges
            changes={recentChanges}
            onViewDetails={(change) => {
              toast.success(`상세 보기: ${change.title}`)
            }}
            onViewAll={() => navigate('/company/system/audit-logs')}
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