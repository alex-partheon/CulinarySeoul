// TASK-008: 수익성 분석 API 클라이언트
// React 컴포넌트에서 사용할 수익성 분석 API 래퍼

import {
  DateRange,
  PeriodType,
  CostStructure,
  MarginAnalysis,
  ItemProfitability,
  ProfitabilityTrend,
  ProfitabilityReport,
  ProfitabilityFilter,
  ProfitabilityAssessment
} from '@/domains/analytics/profitability/types';
import { profitabilityService } from '@/domains/analytics/profitability/profitabilityService';

/**
 * API 응답 타입
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * 수익성 보고서 조회
 * @param filters 필터 옵션
 * @returns 수익성 보고서
 */
export async function fetchProfitabilityReport(
  filters: ProfitabilityFilter
): Promise<ApiResponse<ProfitabilityReport>> {
  try {
    const report = await profitabilityService.getRealTimeProfitability(filters);
    
    if (!report) {
      return {
        success: false,
        error: '수익성 데이터를 가져올 수 없습니다.'
      };
    }

    return {
      success: true,
      data: report
    };
  } catch (error) {
    console.error('Error fetching profitability report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '수익성 보고서 조회 실패'
    };
  }
}

/**
 * 아이템별 수익성 조회
 * @param itemId 아이템 ID
 * @param filters 필터 옵션
 * @returns 아이템 수익성 정보
 */
export async function fetchItemProfitability(
  itemId: string,
  filters: ProfitabilityFilter
): Promise<ApiResponse<ItemProfitability>> {
  try {
    const profitability = await profitabilityService.getItemProfitability(itemId, filters);
    
    if (!profitability) {
      return {
        success: false,
        error: '아이템 수익성 데이터를 가져올 수 없습니다.'
      };
    }

    return {
      success: true,
      data: profitability
    };
  } catch (error) {
    console.error('Error fetching item profitability:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '아이템 수익성 조회 실패'
    };
  }
}

/**
 * 원가 구조 분석 조회
 * @param storeId 매장 ID
 * @param period 분석 기간
 * @returns 원가 구조 분석 결과
 */
export async function fetchCostBreakdown(
  storeId: string,
  period: DateRange
): Promise<ApiResponse<{
  costStructure: CostStructure;
  costBreakdownPercentage: {
    materialCostPercent: number;
    laborCostPercent: number;
    overheadCostPercent: number;
    otherCostPercent: number;
  };
  trends: Array<{
    date: Date;
    costStructure: CostStructure;
  }>;
}>> {
  try {
    const costAnalysis = await profitabilityService.getCostBreakdown(storeId, period);
    
    if (!costAnalysis) {
      return {
        success: false,
        error: '원가 구조 데이터를 가져올 수 없습니다.'
      };
    }

    return {
      success: true,
      data: costAnalysis
    };
  } catch (error) {
    console.error('Error fetching cost breakdown:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '원가 구조 분석 조회 실패'
    };
  }
}

/**
 * 마진 분석 조회
 * @param filters 필터 옵션
 * @returns 마진 분석 결과
 */
export async function fetchMarginAnalysis(
  filters: ProfitabilityFilter
): Promise<ApiResponse<{
  currentMargin: MarginAnalysis;
  targetComparison: {
    actualMargin: number;
    targetMargin: number;
    marginGap: number;
    performance: 'exceeded' | 'met' | 'below';
    varianceAnalysis: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  };
  trends: ProfitabilityTrend[];
}>> {
  try {
    const marginAnalysis = await profitabilityService.getMarginAnalysis(filters);
    
    if (!marginAnalysis) {
      return {
        success: false,
        error: '마진 분석 데이터를 가져올 수 없습니다.'
      };
    }

    return {
      success: true,
      data: marginAnalysis
    };
  } catch (error) {
    console.error('Error fetching margin analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '마진 분석 조회 실패'
    };
  }
}

/**
 * 수익성 추세 조회
 * @param periods 조회할 기간 수
 * @param periodType 기간 유형
 * @param filters 필터 옵션
 * @returns 수익성 추세 데이터
 */
export async function fetchProfitabilityTrends(
  periods: number,
  periodType: PeriodType,
  filters?: ProfitabilityFilter
): Promise<ApiResponse<ProfitabilityTrend[]>> {
  try {
    const trends = await profitabilityService.getProfitabilityTrends(
      periods,
      periodType,
      filters
    );

    return {
      success: true,
      data: trends
    };
  } catch (error) {
    console.error('Error fetching profitability trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '수익성 추세 조회 실패'
    };
  }
}

/**
 * 수익성 보고서 저장
 * @param report 수익성 보고서
 * @returns 저장 성공 여부
 */
export async function saveProfitabilityReport(
  report: ProfitabilityReport
): Promise<ApiResponse<boolean>> {
  try {
    const success = await profitabilityService.saveProfitabilityReport(report);

    return {
      success,
      message: success ? '수익성 보고서가 저장되었습니다.' : '수익성 보고서 저장에 실패했습니다.'
    };
  } catch (error) {
    console.error('Error saving profitability report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '수익성 보고서 저장 실패'
    };
  }
}

/**
 * 수익성 보고서 내보내기
 * @param format 내보내기 형식 (pdf 또는 excel)
 * @param filters 필터 옵션
 * @returns 내보내기된 파일 Blob
 */
export async function exportProfitabilityReport(
  format: 'pdf' | 'excel',
  filters: ProfitabilityFilter
): Promise<ApiResponse<Blob>> {
  try {
    const result = await profitabilityService.exportProfitabilityReport(format, filters);
    
    if (!result) {
      return {
        success: false,
        error: '보고서를 내보낼 수 없습니다.'
      };
    }

    // PDF URL을 Blob으로 변환
    if (result.url) {
      const response = await fetch(result.url);
      const blob = await response.blob();
      return {
        success: true,
        data: blob
      };
    }

    // Excel Blob 직접 반환
    if (result.blob) {
      return {
        success: true,
        data: result.blob
      };
    }

    return {
      success: false,
      error: '보고서 내보내기 형식이 올바르지 않습니다.'
    };
  } catch (error) {
    console.error('Error exporting profitability report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '수익성 보고서 내보내기 실패'
    };
  }
}

/**
 * 상위 수익 아이템 조회
 * @param limit 조회 개수
 * @param filters 필터 옵션
 * @returns 상위 수익 아이템 목록
 */
export async function fetchTopPerformingItems(
  limit: number,
  filters: ProfitabilityFilter
): Promise<ApiResponse<ItemProfitability[]>> {
  try {
    const items = await profitabilityService.getTopPerformingItems(limit, filters);

    return {
      success: true,
      data: items
    };
  } catch (error) {
    console.error('Error fetching top performing items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '상위 수익 아이템 조회 실패'
    };
  }
}

/**
 * 하위 수익 아이템 조회
 * @param threshold 임계값 (마진율 %)
 * @param filters 필터 옵션
 * @returns 하위 수익 아이템 목록
 */
export async function fetchUnderperformingItems(
  threshold: number,
  filters: ProfitabilityFilter
): Promise<ApiResponse<ItemProfitability[]>> {
  try {
    const items = await profitabilityService.getUnderperformingItems(threshold, filters);

    return {
      success: true,
      data: items
    };
  } catch (error) {
    console.error('Error fetching underperforming items:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '하위 수익 아이템 조회 실패'
    };
  }
}

/**
 * 수익성 평가
 * @param marginPercent 마진율
 * @returns 수익성 평가 결과
 */
export function assessProfitability(marginPercent: number): ProfitabilityAssessment {
  return profitabilityService.assessProfitability(marginPercent);
}

/**
 * 수익성 업데이트 구독
 * @param callback 업데이트 콜백 함수
 * @param filters 필터 옵션
 * @returns 구독 해제 함수
 */
export function subscribeToProfitabilityUpdates(
  callback: (payload: any) => void,
  filters?: ProfitabilityFilter
): () => void {
  return profitabilityService.subscribeToProfitabilityUpdates(callback, filters);
}

/**
 * 보고서 다운로드 헬퍼 함수
 * @param blob 파일 Blob
 * @param filename 파일명
 */
export function downloadReport(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * 날짜 범위 생성 헬퍼
 * @param periodType 기간 유형
 * @returns 날짜 범위
 */
export function createDateRange(periodType: PeriodType): DateRange {
  const endDate = new Date();
  const startDate = new Date();

  switch (periodType) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'quarterly':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'yearly':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'custom':
      // 커스텀 날짜는 호출하는 쪽에서 직접 설정
      break;
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * 수익성 상태에 따른 색상 반환
 * @param status 수익성 상태
 * @returns Tailwind CSS 색상 클래스
 */
export function getProfitabilityStatusColor(status: 'excellent' | 'good' | 'warning' | 'critical'): string {
  switch (status) {
    case 'excellent':
      return 'text-green-600 bg-green-50';
    case 'good':
      return 'text-blue-600 bg-blue-50';
    case 'warning':
      return 'text-yellow-600 bg-yellow-50';
    case 'critical':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

/**
 * 마진율 포맷팅
 * @param margin 마진율
 * @returns 포맷된 마진율 문자열
 */
export function formatMarginPercent(margin: number): string {
  return `${margin.toFixed(1)}%`;
}

/**
 * 금액 포맷팅
 * @param amount 금액
 * @param currency 통화 (기본: KRW)
 * @returns 포맷된 금액 문자열
 */
export function formatMoney(amount: number, currency: string = 'KRW'): string {
  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount);
  }
  
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: currency
  }).format(amount);
}