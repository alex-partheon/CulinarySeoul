import React from 'react'
import { ProfitabilityChart } from './ProfitabilityChart'
import { TrendAnalysisChart } from './TrendAnalysisChart'
import { CostBreakdownChart } from './CostBreakdownChart'

/**
 * 수익성 대시보드 예제 컴포넌트
 * 
 * 사용법:
 * ```tsx
 * import { ProfitabilityDashboardExample } from '@/components/dashboard/profitability/ProfitabilityDashboardExample'
 * 
 * // 페이지나 대시보드에서 사용
 * <ProfitabilityDashboardExample />
 * ```
 */
export function ProfitabilityDashboardExample() {
  // 실제 구현에서는 API나 서비스에서 데이터를 가져옵니다
  const isLoading = false
  
  return (
    <div className="space-y-6">
      {/* 메인 수익성 차트 - 매출/비용/이익률 복합 차트 */}
      <ProfitabilityChart 
        loading={isLoading}
        showTarget={true}
        className="w-full"
      />
      
      {/* 두 번째 행 - 추세 분석과 비용 구조 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 수익성 추세 분석 - YoY 비교 포함 */}
        <TrendAnalysisChart 
          loading={isLoading}
          defaultPeriod="monthly"
          className="w-full"
        />
        
        {/* 비용 구조 분석 - 원형 차트 */}
        <CostBreakdownChart 
          loading={isLoading}
          className="w-full"
        />
      </div>
    </div>
  )
}

/**
 * 개별 컴포넌트 사용 예제
 */
export function IndividualUsageExamples() {
  // 실제 데이터 예제
  const profitabilityData = [
    {
      period: '2024년 1월',
      revenue: 150000000,
      costs: 105000000,
      profit: 45000000,
      marginRate: 30,
      targetMarginRate: 25
    },
    {
      period: '2024년 2월',
      revenue: 145000000,
      costs: 108750000,
      profit: 36250000,
      marginRate: 25,
      targetMarginRate: 25
    },
    // ... 더 많은 데이터
  ]
  
  const trendData = [
    {
      period: '1월',
      currentRevenue: 150000000,
      previousRevenue: 130000000,
      currentProfit: 45000000,
      previousProfit: 35000000,
      currentMargin: 30,
      previousMargin: 26.9
    },
    // ... 더 많은 데이터
  ]
  
  const costData = [
    {
      name: '재료비',
      value: 36750000,
      percentage: 35,
      details: {
        '식재료': 25725000,
        '포장재': 7350000,
        '소모품': 3675000
      }
    },
    {
      name: '인건비',
      value: 31500000,
      percentage: 30,
      details: {
        '급여': 25200000,
        '보험료': 4725000,
        '복리후생': 1575000
      }
    },
    // ... 더 많은 비용 항목
  ]
  
  return (
    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-semibold mb-4">1. 수익성 차트 (ComposedChart)</h3>
        <ProfitabilityChart 
          data={profitabilityData}
          showTarget={true}
        />
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">2. 추세 분석 차트 (AreaChart)</h3>
        <TrendAnalysisChart 
          data={trendData}
          defaultPeriod="monthly"
        />
      </section>
      
      <section>
        <h3 className="text-lg font-semibold mb-4">3. 비용 구조 차트 (PieChart)</h3>
        <CostBreakdownChart 
          data={costData}
          totalCost={105000000}
        />
      </section>
    </div>
  )
}