// TASK-008: 수익성 분석 서비스 구현 - 데이터 페칭 및 비즈니스 로직
// Domain-Driven Design 패턴 적용 - Singleton 패턴

import { SupabaseClient } from '@supabase/supabase-js';
import { supabase, realtimeManager } from '@/lib/supabase';
import { permissionService } from '@/services/permissionService';
import { ProfitabilityEngine } from './profitabilityEngine';
import {
  DateRange,
  PeriodType,
  CostStructure,
  MarginAnalysis,
  ItemProfitability,
  ProfitabilityTrend,
  ProfitabilityReport,
  ProfitabilityFilter,
  ProfitabilityAggregation,
  CostCalculationOptions,
  ProfitabilityThresholds,
  ProfitabilityStatus,
  ProfitabilityAssessment
} from './types';
import { Money } from '@/domains/shared/types';
import { toast } from 'react-hot-toast';

/**
 * 수익성 분석 서비스
 * 데이터 페칭, 캐싱, 실시간 업데이트 관리
 */
export class ProfitabilityService {
  private static instance: ProfitabilityService;
  private engine: ProfitabilityEngine;
  private supabase: SupabaseClient;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5분
  private subscriptions: Map<string, any> = new Map();

  private constructor() {
    this.supabase = supabase;
    this.engine = new ProfitabilityEngine(this.supabase);
  }

  /**
   * 싱글톤 인스턴스 반환
   */
  static getInstance(): ProfitabilityService {
    if (!ProfitabilityService.instance) {
      ProfitabilityService.instance = new ProfitabilityService();
    }
    return ProfitabilityService.instance;
  }

  /**
   * 실시간 수익성 조회
   * @param filters 필터 옵션
   * @returns 수익성 보고서
   */
  async getRealTimeProfitability(filters: ProfitabilityFilter): Promise<ProfitabilityReport | null> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('수익성 데이터 조회 권한이 없습니다.');
        return null;
      }

      // 2. 캐시 확인
      const cacheKey = this.generateCacheKey('profitability', filters);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // 3. 날짜 범위 설정
      const dateRange = filters.dateRange || this.getDefaultDateRange(filters.periodType || 'monthly');

      // 4. 엔진을 통한 수익성 계산
      const report = await this.engine.calculateRealTimeProfitability(dateRange, filters);

      // 5. 캐시 저장
      this.saveToCache(cacheKey, report);

      // 6. 보고서 저장 (선택적)
      if (filters.saveReport) {
        await this.saveProfitabilityReport(report);
      }

      return report;
    } catch (error) {
      console.error('Error getting real-time profitability:', error);
      toast.error('수익성 데이터 조회 중 오류가 발생했습니다.');
      return null;
    }
  }

  /**
   * 아이템별 수익성 조회
   * @param itemId 아이템 ID
   * @param filters 필터 옵션
   * @returns 아이템 수익성 정보
   */
  async getItemProfitability(
    itemId: string,
    filters: ProfitabilityFilter
  ): Promise<ItemProfitability | null> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('아이템 수익성 데이터 조회 권한이 없습니다.');
        return null;
      }

      // 2. 캐시 확인
      const cacheKey = this.generateCacheKey('item-profitability', { itemId, ...filters });
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // 3. 날짜 범위 설정
      const dateRange = filters.dateRange || this.getDefaultDateRange(filters.periodType || 'monthly');

      // 4. 엔진을 통한 아이템 수익성 계산
      const profitability = await this.engine.getItemProfitability(itemId, dateRange);

      // 5. 캐시 저장
      this.saveToCache(cacheKey, profitability);

      return profitability;
    } catch (error) {
      console.error('Error getting item profitability:', error);
      toast.error('아이템 수익성 데이터 조회 중 오류가 발생했습니다.');
      return null;
    }
  }

  /**
   * 원가 구조 분석
   * @param storeId 매장 ID
   * @param period 분석 기간
   * @returns 원가 구조 분석 결과
   */
  async getCostBreakdown(storeId: string, period: DateRange): Promise<{
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
  } | null> {
    try {
      // 1. 권한 확인
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        toast.error('로그인이 필요합니다.');
        return null;
      }

      const hasPermission = await permissionService.canAccessDashboard(
        currentUser.id,
        'brand',
        undefined
      );
      if (!hasPermission) {
        toast.error('원가 구조 데이터 조회 권한이 없습니다.');
        return null;
      }

      // 2. 캐시 확인
      const cacheKey = this.generateCacheKey('cost-breakdown', { storeId, period });
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // 3. 엔진을 통한 원가 구조 분석
      const costAnalysis = await this.engine.analyzeCostStructure(storeId, period);

      // 4. 캐시 저장
      this.saveToCache(cacheKey, costAnalysis);

      return costAnalysis;
    } catch (error) {
      console.error('Error getting cost breakdown:', error);
      toast.error('원가 구조 분석 중 오류가 발생했습니다.');
      return null;
    }
  }

  /**
   * 마진 분석
   * @param filters 필터 옵션
   * @returns 마진 분석 결과
   */
  async getMarginAnalysis(filters: ProfitabilityFilter): Promise<{
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
  } | null> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('마진 분석 데이터 조회 권한이 없습니다.');
        return null;
      }

      // 2. 날짜 범위 설정
      const dateRange = filters.dateRange || this.getDefaultDateRange(filters.periodType || 'monthly');

      // 3. 현재 마진 계산
      const profitability = await this.engine.calculateRealTimeProfitability(dateRange, filters);
      const currentMargin: MarginAnalysis = {
        revenue: profitability.summary.totalRevenue,
        cost: profitability.summary.totalCost,
        grossProfit: profitability.summary.grossProfit,
        grossMarginPercent: profitability.summary.grossMarginPercent,
        targetMarginPercent: filters.targetMargin || 25,
        marginGap: profitability.summary.grossMarginPercent - (filters.targetMargin || 25)
      };

      // 4. 목표 대비 비교
      const targetComparison = await this.engine.compareTargetVsActualMargins(
        dateRange,
        filters.targetMargin || 25
      );

      // 5. 추세 분석
      const trends = await this.engine.getProfitabilityTrends(
        6, // 최근 6개월
        filters.periodType || 'monthly'
      );

      return {
        currentMargin,
        targetComparison,
        trends
      };
    } catch (error) {
      console.error('Error getting margin analysis:', error);
      toast.error('마진 분석 중 오류가 발생했습니다.');
      return null;
    }
  }

  /**
   * 수익성 보고서 저장
   * @param report 수익성 보고서
   * @returns 저장 성공 여부
   */
  async saveProfitabilityReport(report: ProfitabilityReport): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('profitability_reports')
        .insert({
          id: report.id,
          company_id: report.companyId,
          brand_id: report.brandId,
          store_id: report.storeId,
          period_type: report.period.type,
          start_date: report.period.range.startDate.toISOString(),
          end_date: report.period.range.endDate.toISOString(),
          total_revenue: report.summary.totalRevenue.amount,
          total_cost: report.summary.totalCost.amount,
          gross_profit: report.summary.grossProfit.amount,
          gross_margin_percent: report.summary.grossMarginPercent,
          net_profit: report.summary.netProfit?.amount,
          net_margin_percent: report.summary.netMarginPercent,
          cost_breakdown: report.costBreakdown,
          top_profitable_items: report.topProfitableItems,
          low_profitable_items: report.lowProfitableItems,
          trends: report.trends,
          created_at: report.createdAt.toISOString(),
          updated_at: report.updatedAt.toISOString()
        });

      if (error) {
        console.error('Error saving profitability report:', error);
        return false;
      }

      toast.success('수익성 보고서가 저장되었습니다.');
      return true;
    } catch (error) {
      console.error('Error saving profitability report:', error);
      toast.error('수익성 보고서 저장 중 오류가 발생했습니다.');
      return false;
    }
  }

  /**
   * 수익성 업데이트 구독
   * @param callback 업데이트 콜백 함수
   * @returns 구독 해제 함수
   */
  subscribeToProfitabilityUpdates(
    callback: (payload: any) => void,
    filters?: ProfitabilityFilter
  ): () => void {
    const channelName = `profitability-updates-${filters?.storeId || 'all'}`;
    
    // 기존 구독 해제
    if (this.subscriptions.has(channelName)) {
      this.unsubscribeFromUpdates(channelName);
    }

    // 새 구독 생성
    const subscription = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: filters?.storeId ? `store_id=eq.${filters.storeId}` : undefined
        },
        async (payload) => {
          // 캐시 무효화
          this.invalidateCache('profitability');
          
          // 콜백 실행
          callback(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_movements',
          filter: filters?.storeId ? `store_id=eq.${filters.storeId}` : undefined
        },
        async (payload) => {
          // 캐시 무효화
          this.invalidateCache('cost-breakdown');
          
          // 콜백 실행
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelName, subscription);

    // 구독 해제 함수 반환
    return () => this.unsubscribeFromUpdates(channelName);
  }

  /**
   * 수익성 보고서 내보내기
   * @param format 내보내기 형식
   * @param filters 필터 옵션
   * @returns 내보내기 URL 또는 Blob
   */
  async exportProfitabilityReport(
    format: 'pdf' | 'excel',
    filters: ProfitabilityFilter
  ): Promise<{ url?: string; blob?: Blob } | null> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('보고서 내보내기 권한이 없습니다.');
        return null;
      }

      // 2. 수익성 데이터 조회
      const report = await this.getRealTimeProfitability(filters);
      if (!report) {
        return null;
      }

      // 3. 형식에 따른 내보내기
      if (format === 'excel') {
        return await this.exportToExcel(report);
      } else if (format === 'pdf') {
        return await this.exportToPDF(report);
      }

      return null;
    } catch (error) {
      console.error('Error exporting profitability report:', error);
      toast.error('보고서 내보내기 중 오류가 발생했습니다.');
      return null;
    }
  }

  /**
   * 상위 수익 아이템 조회
   * @param limit 조회 개수
   * @param filters 필터 옵션
   * @returns 상위 수익 아이템 목록
   */
  async getTopPerformingItems(
    limit: number,
    filters: ProfitabilityFilter
  ): Promise<ItemProfitability[]> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('데이터 조회 권한이 없습니다.');
        return [];
      }

      // 2. 날짜 범위 설정
      const dateRange = filters.dateRange || this.getDefaultDateRange(filters.periodType || 'monthly');

      // 3. 엔진을 통한 상위 아이템 조회
      const topItems = await this.engine.getTopPerformingItems(limit, dateRange);

      return topItems;
    } catch (error) {
      console.error('Error getting top performing items:', error);
      toast.error('상위 수익 아이템 조회 중 오류가 발생했습니다.');
      return [];
    }
  }

  /**
   * 하위 수익 아이템 조회
   * @param threshold 임계값 (마진율 %)
   * @param filters 필터 옵션
   * @returns 하위 수익 아이템 목록
   */
  async getUnderperformingItems(
    threshold: number,
    filters: ProfitabilityFilter
  ): Promise<ItemProfitability[]> {
    try {
      // 1. 권한 확인
      const hasPermission = await this.checkPermission(filters);
      if (!hasPermission) {
        toast.error('데이터 조회 권한이 없습니다.');
        return [];
      }

      // 2. 날짜 범위 설정
      const dateRange = filters.dateRange || this.getDefaultDateRange(filters.periodType || 'monthly');

      // 3. 엔진을 통한 하위 아이템 조회
      const underperformingItems = await this.engine.getUnderperformingItems(threshold, dateRange);

      return underperformingItems;
    } catch (error) {
      console.error('Error getting underperforming items:', error);
      toast.error('하위 수익 아이템 조회 중 오류가 발생했습니다.');
      return [];
    }
  }

  /**
   * 수익성 추세 조회
   * @param periods 조회할 기간 수
   * @param periodType 기간 유형
   * @param filters 필터 옵션
   * @returns 수익성 추세 데이터
   */
  async getProfitabilityTrends(
    periods: number,
    periodType: PeriodType,
    filters?: ProfitabilityFilter
  ): Promise<ProfitabilityTrend[]> {
    try {
      // 1. 권한 확인
      if (filters) {
        const hasPermission = await this.checkPermission(filters);
        if (!hasPermission) {
          toast.error('추세 데이터 조회 권한이 없습니다.');
          return [];
        }
      }

      // 2. 엔진을 통한 추세 조회
      const trends = await this.engine.getProfitabilityTrends(periods, periodType);

      return trends;
    } catch (error) {
      console.error('Error getting profitability trends:', error);
      toast.error('수익성 추세 조회 중 오류가 발생했습니다.');
      return [];
    }
  }

  /**
   * 수익성 평가
   * @param marginPercent 마진율
   * @returns 수익성 평가 결과
   */
  assessProfitability(marginPercent: number): ProfitabilityAssessment {
    return this.engine.assessProfitability(marginPercent);
  }

  // === Private Helper Methods ===

  /**
   * 권한 확인
   */
  private async checkPermission(filters: ProfitabilityFilter): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return false;
      }

      // Super admin은 모든 권한 보유
      if (currentUser.role === 'super_admin') {
        return true;
      }

      // Company dashboard 권한 확인
      if (filters.companyId) {
        const canAccessCompany = await permissionService.canAccessDashboard(
          currentUser.id,
          'company'
        );
        if (!canAccessCompany) {
          return false;
        }
      }

      // Brand dashboard 권한 확인
      if (filters.brandId) {
        const canAccessBrand = await permissionService.canAccessDashboard(
          currentUser.id,
          'brand',
          filters.brandId
        );
        if (!canAccessBrand) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * 현재 사용자 조회
   */
  private async getCurrentUser(): Promise<any> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return data;
  }

  /**
   * 캐시 키 생성
   */
  private generateCacheKey(type: string, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }

  /**
   * 캐시에서 조회
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.CACHE_TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 캐시에 저장
   */
  private saveToCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 캐시 무효화
   */
  private invalidateCache(prefix?: string): void {
    if (prefix) {
      // 특정 prefix로 시작하는 키만 삭제
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      // 전체 캐시 삭제
      this.cache.clear();
    }
  }

  /**
   * 기본 날짜 범위 생성
   */
  private getDefaultDateRange(periodType: PeriodType): DateRange {
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
      default:
        startDate.setMonth(startDate.getMonth() - 1);
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  /**
   * 구독 해제
   */
  private unsubscribeFromUpdates(channelName: string): void {
    const subscription = this.subscriptions.get(channelName);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(channelName);
    }
  }

  /**
   * Excel로 내보내기
   */
  private async exportToExcel(report: ProfitabilityReport): Promise<{ blob: Blob }> {
    // 실제 구현에서는 xlsx 라이브러리를 사용하여 Excel 파일 생성
    // 임시로 CSV 형식으로 생성
    const csvContent = this.generateCSVContent(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return { blob };
  }

  /**
   * PDF로 내보내기
   */
  private async exportToPDF(report: ProfitabilityReport): Promise<{ url: string }> {
    // 실제 구현에서는 PDF 생성 서비스를 호출하거나
    // jsPDF 같은 라이브러리를 사용하여 PDF 생성
    // 임시로 더미 URL 반환
    return { url: '/api/reports/profitability/' + report.id + '.pdf' };
  }

  /**
   * CSV 콘텐츠 생성
   */
  private generateCSVContent(report: ProfitabilityReport): string {
    const headers = [
      '항목',
      '값',
      '단위'
    ].join(',');

    const rows = [
      ['총 매출', report.summary.totalRevenue.amount, '원'],
      ['총 원가', report.summary.totalCost.amount, '원'],
      ['매출총이익', report.summary.grossProfit.amount, '원'],
      ['매출총이익률', report.summary.grossMarginPercent, '%'],
      ['순이익', report.summary.netProfit?.amount || 0, '원'],
      ['순이익률', report.summary.netMarginPercent || 0, '%']
    ];

    const csvRows = [
      headers,
      ...rows.map(row => row.join(','))
    ];

    return csvRows.join('\n');
  }

  /**
   * 모든 구독 해제
   */
  cleanup(): void {
    // 모든 실시간 구독 해제
    this.subscriptions.forEach((subscription, channelName) => {
      this.unsubscribeFromUpdates(channelName);
    });

    // 캐시 초기화
    this.cache.clear();
  }
}

// 싱글톤 인스턴스 내보내기
export const profitabilityService = ProfitabilityService.getInstance();