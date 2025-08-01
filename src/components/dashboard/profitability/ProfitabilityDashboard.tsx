import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  Calendar,
  Filter
} from 'lucide-react'
import { ProfitabilityMetricCard } from './ProfitabilityMetricCard'
import { ProfitabilityChart } from './ProfitabilityChart'
import { ItemProfitabilityTable } from './ItemProfitabilityTable'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

type PeriodType = 'week' | 'month' | 'quarter' | 'year'
type ViewType = 'company' | 'brand' | 'store'

interface ProfitabilityDashboardProps {
  viewType?: ViewType
  brandId?: string
  storeId?: string
  className?: string
}

export function ProfitabilityDashboard({
  viewType = 'company',
  brandId,
  storeId,
  className
}: ProfitabilityDashboardProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<PeriodType>('month')
  const [filterOpen, setFilterOpen] = useState(false)

  // 데모 데이터
  const [profitabilityData, setProfitabilityData] = useState({
    totalRevenue: 450000000,
    totalCosts: 337500000,
    totalProfit: 112500000,
    marginRate: 25,
    revenueChange: 12.5,
    profitChange: 15.3,
    marginChange: 2.1,
    costRatio: 75
  })

  // 차트 데이터
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const revenue = Math.floor(Math.random() * 50000000) + 100000000
    const costs = Math.floor(revenue * (0.6 + Math.random() * 0.2))
    const profit = revenue - costs
    const marginRate = (profit / revenue) * 100
    
    return {
      period: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: 'short'
      }),
      revenue,
      costs,
      profit,
      marginRate: Math.round(marginRate * 10) / 10,
      targetMarginRate: 25
    }
  })

  // 품목별 수익성 데이터
  const itemData = [
    {
      id: '1',
      name: '스테이크',
      category: '메인 요리',
      revenue: 25000000,
      cost: 15000000,
      margin: 40,
      marginVariance: 3.5,
      volume: 1250,
      trend: 'up' as const
    },
    {
      id: '2',
      name: '파스타',
      category: '메인 요리',
      revenue: 18000000,
      cost: 9000000,
      margin: 50,
      marginVariance: -2.1,
      volume: 2100,
      trend: 'down' as const
    },
    {
      id: '3',
      name: '샐러드',
      category: '애피타이저',
      revenue: 12000000,
      cost: 4800000,
      margin: 60,
      marginVariance: 5.2,
      volume: 1800,
      trend: 'up' as const
    }
  ]

  useEffect(() => {
    // 실제 데이터 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [period, viewType, brandId, storeId])

  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod)
    toast.success(`${getPeriodLabel(newPeriod)} 데이터로 업데이트되었습니다`)
  }

  const getPeriodLabel = (p: PeriodType) => {
    const labels = {
      week: '주간',
      month: '월간',
      quarter: '분기',
      year: '연간'
    }
    return labels[p]
  }

  const getViewLabel = () => {
    switch (viewType) {
      case 'brand':
        return '브랜드'
      case 'store':
        return '매장'
      default:
        return '전체'
    }
  }

  return (
    <div className={className}>
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">수익성 분석</h2>
          <p className="text-sm text-gray-500 mt-1">
            {getViewLabel()} 수익성 현황 및 추세
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 기간 선택 */}
          <Select value={period} onValueChange={(value) => handlePeriodChange(value as PeriodType)}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">주간</SelectItem>
              <SelectItem value="month">월간</SelectItem>
              <SelectItem value="quarter">분기</SelectItem>
              <SelectItem value="year">연간</SelectItem>
            </SelectContent>
          </Select>

          {/* 필터 버튼 */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      {/* 메트릭 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ProfitabilityMetricCard
          title="총 매출"
          value={profitabilityData.totalRevenue}
          change={profitabilityData.revenueChange}
          type="revenue"
          loading={loading}
          icon={<DollarSign className="w-5 h-5" />}
        />
        
        <ProfitabilityMetricCard
          title="총 비용"
          value={profitabilityData.totalCosts}
          change={-5.2}
          type="cost"
          loading={loading}
          icon={<TrendingDown className="w-5 h-5" />}
        />
        
        <ProfitabilityMetricCard
          title="순이익"
          value={profitabilityData.totalProfit}
          change={profitabilityData.profitChange}
          type="profit"
          loading={loading}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        
        <ProfitabilityMetricCard
          title="이익률"
          value={profitabilityData.marginRate}
          change={profitabilityData.marginChange}
          type="margin"
          loading={loading}
          icon={<Percent className="w-5 h-5" />}
          suffix="%"
        />
      </div>

      {/* 차트 및 테이블 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수익성 추이 차트 */}
        <div>
          <ProfitabilityChart 
            data={chartData}
            loading={loading}
            className="h-full"
          />
        </div>

        {/* 품목별 수익성 테이블 */}
        <div>
          <ItemProfitabilityTable
            data={itemData}
            loading={loading}
            className="h-full"
          />
        </div>
      </div>

      {/* 인사이트 섹션 */}
      {!loading && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">주요 인사이트</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• 이번 {getPeriodLabel(period)} 매출이 전 기간 대비 {profitabilityData.revenueChange}% 증가했습니다</li>
            <li>• 스테이크의 이익률이 가장 높으며, 지속적인 상승 추세를 보이고 있습니다</li>
            <li>• 비용 관리 개선으로 전체 이익률이 {profitabilityData.marginChange}%p 향상되었습니다</li>
          </ul>
        </div>
      )}
    </div>
  )
}