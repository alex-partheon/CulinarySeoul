import { Money } from '@/domains/shared/types';

// 날짜 범위 타입
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// 기간 타입
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

// 원가 구조
export interface CostStructure {
  materialCost: Money;        // 재료비 (FIFO 기반)
  laborCost: Money;          // 인건비
  overheadCost: Money;       // 간접비 (임대료, 유틸리티 등)
  otherCost?: Money;         // 기타 비용
  totalCost: Money;          // 총 원가
}

// 마진 분석
export interface MarginAnalysis {
  revenue: Money;            // 매출액
  cost: Money;              // 원가
  grossProfit: Money;       // 매출총이익 (매출액 - 원가)
  grossMarginPercent: number; // 매출총이익률 (%)
  targetMarginPercent?: number; // 목표 마진율 (%)
  marginGap?: number;       // 마진 갭 (목표 - 실제) (%)
}

// 아이템별 수익성
export interface ItemProfitability {
  itemId: string;
  itemName: string;
  category?: string;
  quantity: number;          // 판매 수량
  revenue: Money;           // 매출액
  costStructure: CostStructure; // 원가 구조
  margin: MarginAnalysis;   // 마진 분석
  profitabilityScore?: number; // 수익성 점수 (0-100)
}

// 수익성 추세
export interface ProfitabilityTrend {
  date: Date;
  revenue: Money;
  cost: Money;
  grossProfit: Money;
  grossMarginPercent: number;
  itemCount: number;        // 판매 아이템 수
  orderCount: number;       // 주문 수
}

// 수익성 보고서
export interface ProfitabilityReport {
  id: string;
  companyId: string;
  brandId?: string;
  storeId?: string;
  period: {
    type: PeriodType;
    range: DateRange;
  };
  summary: {
    totalRevenue: Money;      // 총 매출액
    totalCost: Money;         // 총 원가
    grossProfit: Money;       // 매출총이익
    grossMarginPercent: number; // 매출총이익률
    netProfit?: Money;        // 순이익 (선택사항)
    netMarginPercent?: number; // 순이익률 (선택사항)
  };
  costBreakdown: CostStructure; // 원가 상세 분석
  topProfitableItems: ItemProfitability[]; // 수익성 상위 아이템
  lowProfitableItems: ItemProfitability[]; // 수익성 하위 아이템
  trends: ProfitabilityTrend[]; // 기간별 추세
  createdAt: Date;
  updatedAt: Date;
}

// 수익성 필터 옵션
export interface ProfitabilityFilter {
  companyId?: string;
  brandId?: string;
  storeId?: string;
  dateRange?: DateRange;
  periodType?: PeriodType;
  itemIds?: string[];
  categories?: string[];
  minMargin?: number;       // 최소 마진율 필터
  maxMargin?: number;       // 최대 마진율 필터
}

// 수익성 집계 옵션
export interface ProfitabilityAggregation {
  groupBy?: 'item' | 'category' | 'store' | 'brand'; // 집계 기준
  sortBy?: 'revenue' | 'profit' | 'margin' | 'quantity'; // 정렬 기준
  sortOrder?: 'asc' | 'desc';
  limit?: number;           // 결과 제한
}

// 원가 계산 옵션
export interface CostCalculationOptions {
  includeLaborCost?: boolean;    // 인건비 포함 여부
  includeOverheadCost?: boolean; // 간접비 포함 여부
  laborCostRate?: number;        // 인건비율 (매출 대비 %)
  overheadCostRate?: number;     // 간접비율 (매출 대비 %)
  useFIFO?: boolean;            // FIFO 원가 사용 여부 (기본: true)
}

// 수익성 임계값 설정
export interface ProfitabilityThresholds {
  excellentMargin: number;    // 우수 마진율 (예: 30%)
  goodMargin: number;        // 양호 마진율 (예: 20%)
  warningMargin: number;     // 주의 마진율 (예: 10%)
  criticalMargin: number;    // 위험 마진율 (예: 5%)
}

// 수익성 상태
export type ProfitabilityStatus = 'excellent' | 'good' | 'warning' | 'critical';

// 수익성 평가 결과
export interface ProfitabilityAssessment {
  status: ProfitabilityStatus;
  score: number;            // 0-100
  recommendations?: string[]; // 개선 권고사항
  risks?: string[];         // 위험 요소
}