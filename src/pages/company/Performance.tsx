import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { PerformanceMetric } from '@/components/dashboard/shared/PerformanceMetric';
import { KPIDashboard, type KPI } from '@/components/dashboard/shared/KPIDashboard';
import { TrendAnalysis } from '@/components/dashboard/shared/TrendAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  Download,
  Filter,
  ChevronRight,
  DollarSign,
  ShoppingBag,
  Users,
  Store
} from 'lucide-react';

export default function PerformancePage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'revenue' | 'operations' | 'brand'>('overview');

  // Mock performance data
  const performanceMetrics = [
    {
      title: '총 매출',
      value: '₩12.4B',
      target: '₩13.5B',
      unit: '',
      change: { value: 15.3, period: '전월 대비' },
      progress: 92,
      trend: 'up' as const,
      data: Array.from({ length: 7 }, (_, i) => ({
        date: `${i + 1}일`,
        value: 10 + Math.random() * 5
      })),
      category: '재무',
      description: '목표 대비 92% 달성'
    },
    {
      title: '평균 객단가',
      value: '₩45,250',
      target: '₩50,000',
      change: { value: 8.5, period: '전월 대비' },
      progress: 90.5,
      trend: 'up' as const,
      category: '재무',
      data: Array.from({ length: 7 }, (_, i) => ({
        date: `${i + 1}일`,
        value: 40000 + Math.random() * 10000
      }))
    },
    {
      title: '고객 만족도',
      value: 4.7,
      target: 4.8,
      unit: '/5.0',
      change: { value: 2.1, period: '전월 대비' },
      progress: 98,
      trend: 'up' as const,
      category: '고객',
      description: '전체 리뷰 12,456건 기준'
    },
    {
      title: '매장 효율성',
      value: 89,
      target: 95,
      unit: '%',
      change: { value: -2.3, period: '전월 대비' },
      progress: 93.7,
      trend: 'down' as const,
      category: '운영',
      description: '전체 48개 매장 평균'
    }
  ];

  const kpis: KPI[] = [
    {
      id: '1',
      name: '매출 성장률',
      value: 15.3,
      target: 12,
      unit: '%',
      progress: 127.5,
      trend: 'up',
      status: 'excellent',
      period: '월간',
      category: '재무',
      description: '전년 동월 대비 매출 성장'
    },
    {
      id: '2',
      name: '신규 고객 획득',
      value: '8,456',
      target: '10,000',
      progress: 84.6,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '고객'
    },
    {
      id: '3',
      name: '재구매율',
      value: 68.5,
      target: 75,
      unit: '%',
      progress: 91.3,
      trend: 'stable',
      status: 'good',
      period: '월간',
      category: '고객'
    },
    {
      id: '4',
      name: '재고 회전율',
      value: 12.5,
      target: 15,
      unit: '회',
      progress: 83.3,
      trend: 'down',
      status: 'warning',
      period: '월간',
      category: '운영'
    },
    {
      id: '5',
      name: '직원 생산성',
      value: '₩2.8M',
      target: '₩3M',
      progress: 93.3,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '인사',
      description: '직원 1인당 매출'
    },
    {
      id: '6',
      name: '에너지 효율',
      value: 78,
      target: 85,
      unit: '%',
      progress: 91.8,
      trend: 'up',
      status: 'good',
      period: '월간',
      category: '운영'
    },
    {
      id: '7',
      name: '배달 정시율',
      value: 89.5,
      target: 95,
      unit: '%',
      progress: 94.2,
      trend: 'down',
      status: 'warning',
      period: '월간',
      category: '운영'
    },
    {
      id: '8',
      name: '브랜드 인지도',
      value: 72,
      target: 80,
      unit: '%',
      progress: 90,
      trend: 'up',
      status: 'good',
      period: '분기',
      category: '마케팅'
    }
  ];

  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    period: `${i + 1}월`,
    총매출: Math.floor(8000 + Math.random() * 4000),
    온라인: Math.floor(2000 + Math.random() * 1000),
    오프라인: Math.floor(6000 + Math.random() * 3000),
    목표: 10000
  }));

  const brandPerformanceData = Array.from({ length: 12 }, (_, i) => ({
    period: `${i + 1}월`,
    밀랍: Math.floor(2000 + Math.random() * 1000),
    브루잉: Math.floor(1800 + Math.random() * 800),
    로스터리: Math.floor(1500 + Math.random() * 700),
    베이커리: Math.floor(1200 + Math.random() * 600),
    델리: Math.floor(1000 + Math.random() * 500)
  }));

  const operationalData = Array.from({ length: 12 }, (_, i) => ({
    period: `${i + 1}월`,
    객단가: Math.floor(40000 + Math.random() * 10000),
    주문수: Math.floor(5000 + Math.random() * 2000),
    고객만족도: 4.3 + Math.random() * 0.5
  }));

  const insights = [
    { type: 'positive' as const, text: '매출이 전월 대비 15.3% 증가하여 연간 최고 실적을 달성했습니다.' },
    { type: 'negative' as const, text: '배달 정시율이 목표치 대비 5.5% 부족하여 개선이 필요합니다.' },
    { type: 'neutral' as const, text: '밀랍 브랜드가 전체 매출의 35%를 차지하며 주력 브랜드로 자리잡았습니다.' }
  ];

  const handleExport = () => {
    toast.success('성과 보고서가 다운로드되었습니다');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">성과 분석</h1>
          <p className="text-gray-600 mt-1">전체 브랜드의 통합 성과 지표를 분석합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
            <TabsList>
              <TabsTrigger value="month">월간</TabsTrigger>
              <TabsTrigger value="quarter">분기</TabsTrigger>
              <TabsTrigger value="year">연간</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            보고서 다운로드
          </Button>
          <Button onClick={() => navigate('/company/analytics')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">전체 개요</TabsTrigger>
          <TabsTrigger value="revenue">매출 분석</TabsTrigger>
          <TabsTrigger value="operations">운영 지표</TabsTrigger>
          <TabsTrigger value="brand">브랜드별</TabsTrigger>
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
            title="전체 성과 추이"
            data={revenueData}
            metrics={[
              { key: '총매출', name: '총매출', color: '#3B82F6', type: 'area' },
              { key: '목표', name: '목표', color: '#EF4444', type: 'line' }
            ]}
            period="monthly"
            onPeriodChange={(period) => toast.success(`기간 변경: ${period}`)}
            showBrush={true}
            referenceLines={[
              { y: 10000, label: '월 목표', color: '#EF4444' }
            ]}
            insights={insights}
            onExport={handleExport}
          />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          {/* Revenue Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendAnalysis
              title="매출 채널별 분석"
              data={revenueData}
              metrics={[
                { key: '온라인', name: '온라인', color: '#3B82F6', type: 'area' },
                { key: '오프라인', name: '오프라인', color: '#10B981', type: 'area' }
              ]}
              period="monthly"
              height={300}
            />

            <TrendAnalysis
              title="매출 vs 목표"
              data={revenueData}
              metrics={[
                { key: '총매출', name: '실제 매출', color: '#8B5CF6', type: 'bar' },
                { key: '목표', name: '목표', color: '#EF4444', type: 'line' }
              ]}
              period="monthly"
              height={300}
            />
          </div>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">매출 구성 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">채널별 매출</h4>
                  {[
                    { name: '오프라인', value: '₩8.2B', ratio: 66, color: 'bg-blue-500' },
                    { name: '온라인', value: '₩3.4B', ratio: 28, color: 'bg-green-500' },
                    { name: '배달', value: '₩0.8B', ratio: 6, color: 'bg-purple-500' }
                  ].map((channel) => (
                    <div key={channel.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{channel.name}</span>
                        <span className="font-medium">{channel.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${channel.color}`}
                            style={{ width: `${channel.ratio}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{channel.ratio}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">상품별 매출</h4>
                  {[
                    { name: '음료', value: '₩6.8B', ratio: 55 },
                    { name: '베이커리', value: '₩3.1B', ratio: 25 },
                    { name: '델리', value: '₩2.5B', ratio: 20 }
                  ].map((product) => (
                    <div key={product.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{product.name}</span>
                        <span className="font-medium">{product.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gray-500"
                            style={{ width: `${product.ratio}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{product.ratio}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">시간대별 매출</h4>
                  {[
                    { name: '아침 (7-11시)', value: '₩3.2B', ratio: 26 },
                    { name: '점심 (11-14시)', value: '₩4.5B', ratio: 36 },
                    { name: '저녁 (17-21시)', value: '₩4.7B', ratio: 38 }
                  ].map((time) => (
                    <div key={time.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{time.name}</span>
                        <span className="font-medium">{time.value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-orange-500"
                            style={{ width: `${time.ratio}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{time.ratio}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6 mt-6">
          {/* Operational Metrics */}
          <TrendAnalysis
            title="운영 지표 추이"
            data={operationalData}
            metrics={[
              { key: '객단가', name: '평균 객단가', color: '#F59E0B', type: 'line', yAxisId: 'left' },
              { key: '주문수', name: '일일 주문수', color: '#3B82F6', type: 'bar', yAxisId: 'right' },
              { key: '고객만족도', name: '고객 만족도', color: '#10B981', type: 'line', yAxisId: 'right' }
            ]}
            period="monthly"
            showBrush={false}
            height={350}
          />

          {/* Operational KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.filter(kpi => kpi.category === '운영').map((kpi) => (
              <Card key={kpi.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium">{kpi.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{kpi.description}</p>
                  </div>
                  <Badge 
                    variant={kpi.status === 'warning' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {kpi.status === 'warning' ? '개선 필요' : '정상'}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  {kpi.unit && <span className="text-sm text-gray-600">{kpi.unit}</span>}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>목표: {kpi.target}{kpi.unit}</span>
                  <span>{kpi.progress}% 달성</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6 mt-6">
          {/* Brand Performance */}
          <TrendAnalysis
            title="브랜드별 매출 추이"
            data={brandPerformanceData}
            metrics={[
              { key: '밀랍', name: '밀랍', color: '#F59E0B', type: 'area' },
              { key: '브루잉', name: '브루잉', color: '#3B82F6', type: 'area' },
              { key: '로스터리', name: '로스터리', color: '#10B981', type: 'area' },
              { key: '베이커리', name: '베이커리', color: '#8B5CF6', type: 'area' },
              { key: '델리', name: '델리', color: '#EF4444', type: 'area' }
            ]}
            period="monthly"
            showBrush={true}
            height={400}
          />

          {/* Brand Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['밀랍', '브루잉', '로스터리', '베이커리', '델리'].map((brand) => (
              <Card 
                key={brand}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/brand/${brand.toLowerCase()}/performance`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{brand}</CardTitle>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">매출</p>
                      <p className="font-semibold">₩{(2.5 + Math.random() * 1).toFixed(1)}B</p>
                    </div>
                    <div>
                      <p className="text-gray-600">성장률</p>
                      <p className="font-semibold text-green-600">+{(10 + Math.random() * 10).toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">매장 수</p>
                      <p className="font-semibold">{Math.floor(8 + Math.random() * 7)}개</p>
                    </div>
                    <div>
                      <p className="text-gray-600">효율성</p>
                      <p className="font-semibold">{(85 + Math.random() * 10).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">KPI 달성률</span>
                      <span className="font-medium">{(80 + Math.random() * 15).toFixed(0)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}