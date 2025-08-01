// 수익성 분석 컴포넌트 모음

// 차트 컴포넌트
export { ProfitabilityChart } from './ProfitabilityChart'
export { TrendAnalysisChart } from './TrendAnalysisChart'
export { CostBreakdownChart } from './CostBreakdownChart'

// 데이터 표시 컴포넌트
export { ItemProfitabilityTable } from './ItemProfitabilityTable'
export type { ItemProfitability } from './ItemProfitabilityTable'

export { MarginVarianceIndicator } from './MarginVarianceIndicator'

export { ProfitabilityMetricCard } from './ProfitabilityMetricCard'
export type { MetricType, TrendDirection } from './ProfitabilityMetricCard'

// 대시보드 및 패널
export { ProfitabilityDashboard } from './ProfitabilityDashboard'
export { CostOptimizationPanel } from './CostOptimizationPanel'

// 리포트 관련
export { ReportGeneratorPanel } from './ReportGeneratorPanel'
export { ReportPreview } from './ReportPreview'