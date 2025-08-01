import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { PerformanceMetric } from '@/components/dashboard/shared/PerformanceMetric'
import { KPIDashboard, type KPI } from '@/components/dashboard/shared/KPIDashboard'
import { TrendAnalysis } from '@/components/dashboard/shared/TrendAnalysis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { toast } from 'react-hot-toast'
import { 
  TrendingUp, 
  BarChart3, 
  Target, 
  Clock,
  Users,
  ShoppingBag,
  DollarSign,
  Download,
  ChevronRight,
  Utensils,
  UserCheck,
  Truck,
  Star,
  Activity
} from 'lucide-react'

export default function StorePerformance() {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week')
  const [selectedView, setSelectedView] = useState<'overview' | 'sales' | 'operations' | 'department'>('overview')

  // Mock performance data
  const performanceMetrics = [
    {
      title: '매장 매출',
      value: '₩193M',
      target: '₩200M',
      change: { value: 8.5, period: '전주 대비' },
      progress: 96.5,
      trend: 'up' as const,
      data: Array.from({ length: 7 }, (_, i) => ({
        date: `${i + 1}일`,
        value: 180 + Math.random() * 40
      })),
      category: '재무',
      description: '주간 목표 대비 96.5% 달성'
    },
    {
      title: '일평균 주문',
      value: '312',
      target: '350',
      unit: '건',
      change: { value: 12.3, period: '전주 대비' },
      progress: 89.1,
      trend: 'up' as const,
      category: '운영'
    },
    {
      title: '고객 만족도',
      value: 4.7,
      target: 4.8,
      unit: '/5.0',
      change: { value: 1.5, period: '전주 대비' },
      progress: 97.9,
      trend: 'up' as const,
      category: '고객',
      description: '리뷰 156건 기준'
    },
    {
      title: '직원 효율성',
      value: 94,
      target: 95,
      unit: '%',
      change: { value: -1.2, period: '전주 대비' },
      progress: 98.9,
      trend: 'down' as const,
      category: '인사'
    }
  ]

  const kpis: KPI[] = [
    {
      id: '1',
      name: '주문 처리 시간',
      value: '4:32',
      target: '5:00',
      unit: '분',
      progress: 109.6,
      trend: 'up',
      status: 'excellent',
      period: '일간',
      category: '운영',
      description: '평균 주문 처리 시간'
    },
    {
      id: '2',
      name: '피크 시간 효율',
      value: 85,
      target: 90,
      unit: '%',
      progress: 94.4,
      trend: 'stable',
      status: 'good',
      period: '일간',
      category: '운영'
    },
    {
      id: '3',
      name: '재고 정확도',
      value: 96.5,
      target: 98,
      unit: '%',
      progress: 98.5,
      trend: 'up',
      status: 'good',
      period: '주간',
      category: '재고'
    },
    {
      id: '4',
      name: '직원 출근율',
      value: 97.2,
      target: 95,
      unit: '%',
      progress: 102.3,
      trend: 'up',
      status: 'excellent',
      period: '주간',
      category: '인사'
    },
    {
      id: '5',
      name: '음식물 폐기율',
      value: 3.2,
      target: 5,
      unit: '%',
      progress: 136,
      trend: 'down',
      status: 'excellent',
      period: '주간',
      category: '운영',
      description: '목표보다 낮은 폐기율 달성'
    },
    {
      id: '6',
      name: '배달 정시율',
      value: 88,
      target: 95,
      unit: '%',
      progress: 92.6,
      trend: 'down',
      status: 'warning',
      period: '일간',
      category: '배달'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매장 성과 분석</h1>
          <p className="text-gray-600 mt-1">{storeId} 매장의 종합 성과 지표를 분석합니다</p>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="day">일간</TabsTrigger>
              <TabsTrigger value="week">주간</TabsTrigger>
              <TabsTrigger value="month">월간</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            보고서 다운로드
          </Button>
          <Button onClick={() => navigate(`/store/${storeId}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">전체 개요</TabsTrigger>
          <TabsTrigger value="sales">매출 분석</TabsTrigger>
          <TabsTrigger value="operations">운영 지표</TabsTrigger>
          <TabsTrigger value="department">부서별</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceMetrics.map((metric, index) => (
              <PerformanceMetric
                key={index}
                {...metric}
                onClick={() => toast.success(`${metric.title} 상세 보기`)}
              />
            ))}
          </div>

          {/* KPI Dashboard */}
          <KPIDashboard
            kpis={kpis}
            onKPIClick={(kpi) => toast.success(`KPI 상세: ${kpi.name}`)}
            onExport={handleExport}
          />

          {/* Overall Trend */}
          <TrendAnalysis
            title="매장 성과 추이"
            data={weeklyData}
            metrics={[
              { key: '매출', name: '매출', color: '#3B82F6', type: 'area' },
              { key: '목표', name: '목표', color: '#EF4444', type: 'line' }
            ]}
            period="weekly"
            onPeriodChange={(period) => toast.success(`기간 변경: ${period}`)}
            showBrush={true}
            referenceLines={[
              { y: 200, label: '주간 목표', color: '#EF4444' }
            ]}
            insights={insights}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="sales" className="space-y-6 mt-6">
          {/* Hourly Sales Pattern */}
          <TrendAnalysis
            title="시간대별 매출 패턴"
            data={hourlyData}
            metrics={[
              { key: '매출', name: '매출 (백만원)', color: '#F59E0B', type: 'bar' },
              { key: '주문수', name: '주문수', color: '#3B82F6', type: 'line', yAxisId: 'right' }
            ]}
            showBrush={false}
            height={300}
          />

          {/* Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">상품별 매출 TOP 10</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.sales}개 판매</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₩{product.revenue}M</p>
                        <p className="text-xs text-gray-600">{product.ratio}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">시간대별 매출 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: '아침 (7-11시)', sales: '₩52M', ratio: 23, peak: false },
                    { time: '점심 (11-14시)', sales: '₩78M', ratio: 35, peak: true },
                    { time: '오후 (14-17시)', sales: '₩43M', ratio: 19, peak: false },
                    { time: '저녁 (17-21시)', sales: '₩51M', ratio: 23, peak: true }
                  ].map((time) => (
                    <div key={time.time} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{time.time}</span>
                          {time.peak && <Badge variant="default" className="text-xs">피크</Badge>}
                        </div>
                        <span className="text-sm font-medium">{time.sales}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={time.ratio} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600 w-10 text-right">{time.ratio}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-6">
          {/* Operational Metrics */}
          <TrendAnalysis
            title="운영 효율성 지표"
            data={operationalData}
            metrics={[
              { key: '처리시간', name: '평균 처리시간 (분)', color: '#10B981', type: 'line' },
              { key: '대기시간', name: '평균 대기시간 (분)', color: '#EF4444', type: 'line' },
              { key: '주문수', name: '시간당 주문수', color: '#3B82F6', type: 'bar', yAxisId: 'right' }
            ]}
            period="daily"
            showBrush={false}
            height={350}
          />

          {/* Operational Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: '테이블 회전율', value: '3.8회', target: '4.0회', trend: -5.0, status: 'warning' },
              { title: '인당 생산성', value: '₩8.2M', target: '₩8.0M', trend: 2.5, status: 'good' },
              { title: '재료 원가율', value: '31.2%', target: '30.0%', trend: -4.0, status: 'warning' },
              { title: '에너지 효율', value: '82%', target: '85%', trend: 3.5, status: 'good' },
              { title: '청결도 점수', value: '95점', target: '90점', trend: 2.0, status: 'excellent' },
              { title: '안전사고', value: '0건', target: '0건', trend: 0, status: 'excellent' }
            ].map((metric) => (
              <Card key={metric.title}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{metric.title}</CardTitle>
                    <Badge 
                      variant={metric.status === 'excellent' ? 'default' : metric.status === 'warning' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.status === 'excellent' ? '우수' : metric.status === 'warning' ? '주의' : '양호'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-gray-600">목표: {metric.target}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-3 w-3 ${metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600 rotate-180' : 'text-gray-600'}`} />
                      <span className={`text-sm font-medium ${metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.trend > 0 ? '+' : ''}{metric.trend}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="department" className="space-y-6 mt-6">
          {/* Department Performance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kitchen Department */}
            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-orange-600" />
                    <CardTitle className="text-base">주방</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">효율성</p>
                    <p className="text-lg font-semibold">92%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">평균 조리시간</p>
                    <p className="text-lg font-semibold">8.5분</p>
                  </div>
                </div>
                <Progress value={92} className="h-2" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">음식 품질 점수</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">직원 수</span>
                    <span className="font-medium">8명</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">일일 생산량</span>
                    <span className="font-medium">450개</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hall Department */}
            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">홀</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">서비스 평점</p>
                    <p className="text-lg font-semibold">4.9</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">테이블 회전</p>
                    <p className="text-lg font-semibold">3.8회</p>
                  </div>
                </div>
                <Progress value={98} className="h-2" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">고객 만족도</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">4.9</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">직원 수</span>
                    <span className="font-medium">6명</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">일일 응대</span>
                    <span className="font-medium">280명</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Department */}
            <Card className="cursor-pointer hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-base">배달</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">정시율</p>
                    <p className="text-lg font-semibold">88%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">평균 배달시간</p>
                    <p className="text-lg font-semibold">28분</p>
                  </div>
                </div>
                <Progress value={88} className="h-2" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">배달 만족도</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">배달원 수</span>
                    <span className="font-medium">4명</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">일일 배달</span>
                    <span className="font-medium">85건</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">부서별 성과 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendAnalysis
                title=""
                data={[
                  { period: 'KPI 달성률', 주방: 92, 홀: 98, 배달: 88 },
                  { period: '효율성', 주방: 92, 홀: 95, 배달: 85 },
                  { period: '고객 만족도', 주방: 96, 홀: 98, 배달: 90 },
                  { period: '직원 만족도', 주방: 88, 홀: 92, 배달: 85 }
                ]}
                metrics={[
                  { key: '주방', name: '주방', color: '#F59E0B', type: 'bar' },
                  { key: '홀', name: '홀', color: '#3B82F6', type: 'bar' },
                  { key: '배달', name: '배달', color: '#10B981', type: 'bar' }
                ]}
                showBrush={false}
                showGrid={true}
                height={250}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions and data
const handleExport = () => {
  toast.success('성과 보고서가 다운로드되었습니다')
}

const weeklyData = Array.from({ length: 7 }, (_, i) => ({
  period: `${i + 1}주차`,
  매출: Math.floor(180 + Math.random() * 40),
  목표: 200,
  주문수: Math.floor(2000 + Math.random() * 500)
}))

const hourlyData = Array.from({ length: 15 }, (_, i) => ({
  period: `${i + 7}시`,
  매출: Math.floor(5 + Math.random() * 20),
  주문수: Math.floor(10 + Math.random() * 30)
}))

const operationalData = Array.from({ length: 7 }, (_, i) => ({
  period: `${i + 1}일`,
  처리시간: 4 + Math.random() * 2,
  대기시간: 2 + Math.random() * 1.5,
  주문수: Math.floor(20 + Math.random() * 10)
}))

const topProducts = [
  { name: '아메리카노', sales: 234, revenue: 12.5, ratio: 15.2 },
  { name: '카페라떼', sales: 189, revenue: 10.8, ratio: 13.1 },
  { name: '크로아상', sales: 156, revenue: 8.2, ratio: 9.9 },
  { name: '샌드위치', sales: 145, revenue: 7.8, ratio: 9.5 },
  { name: '콜드브루', sales: 134, revenue: 7.5, ratio: 9.1 },
  { name: '티라미수', sales: 98, revenue: 6.2, ratio: 7.5 },
  { name: '베이글', sales: 87, revenue: 5.8, ratio: 7.0 },
  { name: '스무디', sales: 76, revenue: 5.2, ratio: 6.3 },
  { name: '머핀', sales: 65, revenue: 4.5, ratio: 5.5 },
  { name: '에스프레소', sales: 58, revenue: 3.8, ratio: 4.6 }
]

const insights = [
  { type: 'positive' as const, text: '매출이 전주 대비 8.5% 증가하여 월간 최고 실적에 근접했습니다.' },
  { type: 'negative' as const, text: '배달 정시율이 목표치 대비 7% 부족하여 개선이 필요합니다.' },
  { type: 'neutral' as const, text: '점심 시간대가 전체 매출의 35%를 차지하며 핵심 시간대로 확인됩니다.' }
]