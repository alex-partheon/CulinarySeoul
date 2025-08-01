import React from 'react'
import {
  ItemProfitabilityTable,
  MarginVarianceIndicator,
  ProfitabilityMetricCard,
  type ItemProfitability
} from './'
import { DollarSign, TrendingUp, Package, Calculator } from 'lucide-react'

// 샘플 데이터
const sampleItems: ItemProfitability[] = [
  {
    id: '1',
    name: '김치찌개',
    category: '찌개류',
    quantitySold: 450,
    revenue: 5400000,
    cost: 3240000,
    margin: 2160000,
    marginRate: 40.0
  },
  {
    id: '2',
    name: '된장찌개',
    category: '찌개류',
    quantitySold: 380,
    revenue: 4180000,
    cost: 2926000,
    margin: 1254000,
    marginRate: 30.0
  },
  {
    id: '3',
    name: '제육볶음',
    category: '볶음류',
    quantitySold: 320,
    revenue: 4160000,
    cost: 3328000,
    margin: 832000,
    marginRate: 20.0 // 목표 미달
  },
  {
    id: '4',
    name: '불고기',
    category: '구이류',
    quantitySold: 280,
    revenue: 5600000,
    cost: 4480000,
    margin: 1120000,
    marginRate: 20.0 // 목표 미달
  },
  {
    id: '5',
    name: '비빔밥',
    category: '밥류',
    quantitySold: 340,
    revenue: 4080000,
    cost: 2652000,
    margin: 1428000,
    marginRate: 35.0
  },
  {
    id: '6',
    name: '냉면',
    category: '면류',
    quantitySold: 220,
    revenue: 2640000,
    cost: 2112000,
    margin: 528000,
    marginRate: 20.0 // 목표 미달
  },
  {
    id: '7',
    name: '갈비탕',
    category: '탕류',
    quantitySold: 150,
    revenue: 3000000,
    cost: 2400000,
    margin: 600000,
    marginRate: 20.0 // 목표 미달
  },
  {
    id: '8',
    name: '삼계탕',
    category: '탕류',
    quantitySold: 180,
    revenue: 4500000,
    cost: 2700000,
    margin: 1800000,
    marginRate: 40.0
  }
]

export function ProfitabilityComponentsDemo() {
  const handleViewDetails = (item: ItemProfitability) => {
    console.log('상세보기:', item)
  }

  const handleExport = () => {
    console.log('데이터 내보내기')
  }

  const handleMetricClick = () => {
    console.log('메트릭 카드 클릭')
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">수익성 분석 컴포넌트 데모</h1>

      {/* 메트릭 카드 섹션 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. 수익성 메트릭 카드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProfitabilityMetricCard
            title="총 매출액"
            value={32060000}
            metricType="currency"
            previousValue={28500000}
            trendLabel="전월 대비"
            icon={<DollarSign className="w-5 h-5" />}
            onClick={handleMetricClick}
          />
          <ProfitabilityMetricCard
            title="평균 마진율"
            value={28.3}
            metricType="percentage"
            previousValue={32.5}
            trendLabel="전월 대비"
            status="warning"
            icon={<Calculator className="w-5 h-5" />}
            onClick={handleMetricClick}
          />
          <ProfitabilityMetricCard
            title="총 원가"
            value={23004000}
            metricType="currency"
            previousValue={25000000}
            trendLabel="전월 대비"
            icon={<Package className="w-5 h-5" />}
            onClick={handleMetricClick}
          />
          <ProfitabilityMetricCard
            title="순이익"
            value={9056000}
            metricType="currency"
            previousValue={3500000}
            trendLabel="전월 대비"
            status="success"
            icon={<TrendingUp className="w-5 h-5" />}
            onClick={handleMetricClick}
          />
        </div>
      </section>

      {/* 마진 차이 인디케이터 섹션 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. 마진율 목표 대비 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">목표 초과 달성</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={35.2}
              size="md"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">목표 근접</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={28.3}
              size="md"
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">개선 필요</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={20.5}
              size="md"
            />
          </div>
        </div>
      </section>

      {/* 크기별 마진 인디케이터 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. 크기별 마진 인디케이터</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Small</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={28.3}
              size="sm"
              showRecommendations={false}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Medium</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={28.3}
              size="md"
              showRecommendations={false}
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Large</h3>
            <MarginVarianceIndicator
              targetMargin={30}
              actualMargin={28.3}
              size="lg"
              showRecommendations={false}
            />
          </div>
        </div>
      </section>

      {/* 항목별 수익성 테이블 섹션 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. 항목별 수익성 분석 테이블</h2>
        <ItemProfitabilityTable
          items={sampleItems}
          onViewDetails={handleViewDetails}
          onExport={handleExport}
          targetMarginRate={30}
        />
      </section>

      {/* 로딩 상태 데모 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. 로딩 상태</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ProfitabilityMetricCard
            title="로딩 중..."
            value={0}
            loading={true}
          />
        </div>
        <ItemProfitabilityTable
          items={[]}
          loading={true}
        />
      </section>
    </div>
  )
}