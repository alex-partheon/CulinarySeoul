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
  Award,
  Store,
  Users,
  ShoppingBag,
  DollarSign,
  Download,
  ChevronRight,
  Package,
  Star
} from 'lucide-react'

export default function BrandPerformance() {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')
  const [selectedView, setSelectedView] = useState<'overview' | 'stores' | 'products' | 'customers'>('overview')

  // Mock performance data
  const performanceMetrics = [
    {
      title: '브랜드 매출',
      value: '₩2.89B',
      target: '₩3.2B',
      change: { value: 15.6, period: '전월 대비' },
      progress: 90.3,
      trend: 'up' as const,
      data: Array.from({ length: 7 }, (_, i) => ({
        date: `${i + 1}일`,
        value: 2.5 + Math.random() * 0.5
      })),
      category: '재무',
      description: '목표 대비 90.3% 달성'
    },
    {
      title: '매장별 평균',
      value: '₩193M',
      target: '₩200M',
      change: { value: 8.2, period: '전월 대비' },
      progress: 96.5,
      trend: 'up' as const,
      category: '운영'
    },
    {
      title: '고객 만족도',
      value: 4.8,
      target: 5.0,
      unit: '/5.0',
      change: { value: 2.1, period: '전월 대비' },
      progress: 96,
      trend: 'up' as const,
      category: '고객',
      description: '전체 리뷰 3,456건 기준'
    },
    {
      title: '재고 회전율',
      value: 14.5,
      target: 16,
      unit: '회',
      change: { value: -3.5, period: '전월 대비' },
      progress: 90.6,
      trend: 'down' as const,
      category: '운영'
    }
  ]

  const kpis: KPI[] = [
    {
      id: '1',
      name: '매장 효율성',
      value: 92,
      target: 95,
      unit: '%',
      progress: 96.8,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '운영',
      description: '전체 15개 매장 평균'
    },
    {
      id: '2',
      name: '신규 고객 유치',
      value: '2,345',
      target: '2,500',
      progress: 93.8,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '고객'
    },
    {
      id: '3',
      name: '직원 만족도',
      value: 82,
      target: 85,
      unit: '%',
      progress: 96.5,
      trend: 'stable',
      status: 'good',
      period: '분기',
      category: '인사'
    },
    {
      id: '4',
      name: '브랜드 충성도',
      value: 72,
      target: 75,
      unit: '%',
      progress: 96,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '고객'
    },
    {
      id: '5',
      name: '원가율',
      value: 28.5,
      target: 30,
      unit: '%',
      progress: 105,
      trend: 'down',
      status: 'excellent',
      period: '월간',
      category: '재무',
      description: '목표보다 낮은 원가율 달성'
    },
    {
      id: '6',
      name: '온라인 매출 비중',
      value: 18.5,
      target: 25,
      unit: '%',
      progress: 74,
      trend: 'up',
      status: 'warning',
      period: '월간',
      category: '매출'
    }
  ]

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    period: `${i + 1}월`,
    매출: Math.floor(2000 + Math.random() * 1000),
    주문수: Math.floor(10000 + Math.random() * 5000),
    운영비용: Math.floor(500 + Math.random() * 200),
    순이익: Math.floor(1500 + Math.random() * 800)
  }))

  const storePerformanceData = [
    { name: '강남점', 매출: 450, 효율: 95, 만족도: 4.8, 직원: 25 },
    { name: '성수점', 매출: 380, 효율: 92, 만족도: 4.7, 직원: 22 },
    { name: '판교점', 매출: 320, 효율: 88, 만족도: 4.6, 직원: 20 },
    { name: '홍대점', 매출: 290, 효율: 85, 만족도: 4.5, 직원: 18 },
    { name: '여의도점', 매출: 260, 효율: 90, 만족도: 4.7, 직원: 16 }
  ]

  const productData = Array.from({ length: 6 }, (_, i) => ({
    period: `${i + 1}월`,
    '아메리카노': Math.floor(300 + Math.random() * 100),
    '라떼': Math.floor(250 + Math.random() * 100),
    '콜드브루': Math.floor(200 + Math.random() * 100),
    '샌드위치': Math.floor(150 + Math.random() * 100),
    '케이크': Math.floor(100 + Math.random() * 100)
  }))

  const insights = [
    { type: 'positive' as const, text: '매출이 전월 대비 15.6% 증가하여 브랜드 최고 실적을 달성했습니다.' },
    { type: 'negative' as const, text: '온라인 매출 비중이 목표치 대비 26% 부족하여 개선이 필요합니다.' },
    { type: 'neutral' as const, text: '강남점이 전체 매출의 25%를 차지하며 핵심 매장으로 자리잡았습니다.' }
  ]

  const handleExport = () => {
    toast.success('성과 보고서가 다운로드되었습니다')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">브랜드 성과 분석</h1>
          <p className="text-gray-600 mt-1">{brandId} 브랜드의 종합 성과 지표를 분석합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="week">주간</TabsTrigger>
              <TabsTrigger value="month">월간</TabsTrigger>
              <TabsTrigger value="quarter">분기</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            보고서 다운로드
          </Button>
          <Button onClick={() => navigate(`/brand/${brandId}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">전체 개요</TabsTrigger>
          <TabsTrigger value="stores">매장별 성과</TabsTrigger>
          <TabsTrigger value="products">상품별 분석</TabsTrigger>
          <TabsTrigger value="customers">고객 분석</TabsTrigger>
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
            title="브랜드 성과 추이"
            data={monthlyData}
            metrics={[
              { key: '매출', name: '매출', color: '#F59E0B', type: 'area' },
              { key: '순이익', name: '순이익', color: '#10B981', type: 'line' }
            ]}
            period="monthly"
            onPeriodChange={(period) => toast.success(`기간 변경: ${period}`)}
            showBrush={true}
            insights={insights}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="stores" className="space-y-6 mt-6">
          {/* Store Performance Chart */}
          <TrendAnalysis
            title="매장별 매출 비교"
            data={storePerformanceData}
            metrics={[
              { key: '매출', name: '매출 (억원)', color: '#3B82F6', type: 'bar' }
            ]}
            showBrush={false}
            height={300}
          />

          {/* Store Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storePerformanceData.map((store) => (
              <Card 
                key={store.name}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/store/${store.name}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{store.name}</CardTitle>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">매출</p>
                      <p className="text-lg font-semibold">₩{store.매출}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">효율성</p>
                      <p className="text-lg font-semibold">{store.효율}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">고객 만족도</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{store.만족도}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">직원 수</span>
                      <span className="font-medium">{store.직원}명</span>
                    </div>
                  </div>
                  <Progress value={store.효율} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Store Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">매장별 주요 인사이트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="default" className="mt-0.5">최우수</Badge>
                <div>
                  <p className="text-sm font-medium">강남점 최고 성과</p>
                  <p className="text-xs text-gray-600">매출 ₩450M, 효율성 95%, 고객 만족도 4.8/5.0</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="destructive" className="mt-0.5">개선필요</Badge>
                <div>
                  <p className="text-sm font-medium">홍대점 효율성 개선 필요</p>
                  <p className="text-xs text-gray-600">효율성 85%로 목표치 90% 미달, 직원 교육 강화 필요</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6 mt-6">
          {/* Product Performance */}
          <TrendAnalysis
            title="상품별 매출 추이"
            data={productData}
            metrics={[
              { key: '아메리카노', name: '아메리카노', color: '#8B5CF6', type: 'area' },
              { key: '라떼', name: '라떼', color: '#3B82F6', type: 'area' },
              { key: '콜드브루', name: '콜드브루', color: '#10B981', type: 'area' },
              { key: '샌드위치', name: '샌드위치', color: '#F59E0B', type: 'area' },
              { key: '케이크', name: '케이크', color: '#EF4444', type: 'area' }
            ]}
            period="monthly"
            showBrush={false}
            height={350}
          />

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: '아메리카노', sales: 3245, growth: 12.5, rank: 1 },
              { name: '라떼', sales: 2890, growth: 8.3, rank: 2 },
              { name: '콜드브루', sales: 2156, growth: 15.2, rank: 3 },
              { name: '샌드위치', sales: 1823, growth: -2.1, rank: 4 }
            ].map((product) => (
              <Card key={product.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{product.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">#{product.rank}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold">{product.sales.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">판매량</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-3 w-3 ${product.growth > 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
                      <span className={`text-sm font-medium ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                      <span className="text-xs text-gray-600">전월 대비</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6 mt-6">
          {/* Customer Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  총 고객수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">45,231</p>
                <p className="text-xs text-gray-600 mt-1">활성 고객</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  평균 구매 빈도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">3.8회</p>
                <p className="text-xs text-gray-600 mt-1">월 평균</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  평균 객단가
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₩48,500</p>
                <p className="text-xs text-gray-600 mt-1">↑ 5.2%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  NPS 점수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">72</p>
                <p className="text-xs text-gray-600 mt-1">우수 수준</p>
              </CardContent>
            </Card>
          </div>

          {/* Customer Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">고객 세그먼트별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { segment: 'VIP 고객', count: 2345, ratio: 5.2, value: '₩156M' },
                    { segment: '일반 회원', count: 28456, ratio: 62.9, value: '₩1,823M' },
                    { segment: '신규 회원', count: 8234, ratio: 18.2, value: '₩523M' },
                    { segment: '휴면 회원', count: 6196, ratio: 13.7, value: '₩0' }
                  ].map((segment) => (
                    <div key={segment.segment} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <span className="text-sm text-gray-600">{segment.count.toLocaleString()}명</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={segment.ratio} className="flex-1 h-2" />
                        <span className="text-xs text-gray-600 w-12 text-right">{segment.ratio}%</span>
                      </div>
                      <p className="text-xs text-gray-600">매출 기여: {segment.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">고객 만족도 상세</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: '상품 품질', score: 4.8, count: 2345 },
                    { category: '서비스', score: 4.7, count: 2156 },
                    { category: '가격', score: 4.2, count: 1823 },
                    { category: '매장 분위기', score: 4.6, count: 2456 },
                    { category: '접근성', score: 4.5, count: 1987 }
                  ].map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(item.score) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{item.score}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{item.count.toLocaleString()}건의 평가</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

    </div>
  )
}