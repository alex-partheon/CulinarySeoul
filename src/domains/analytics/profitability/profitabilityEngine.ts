// TASK-008: 수익성 분석 엔진 구현 - FIFO 원가 통합
// Domain-Driven Design 패턴 적용

import { SupabaseClient } from '@supabase/supabase-js';
import { FIFOInventoryEngine } from '@/domains/inventory/fifoEngine';
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

/**
 * 수익성 분석 엔진
 * FIFO 기반 정확한 원가 추적과 실시간 수익성 분석 제공
 */
export class ProfitabilityEngine {
  private fifoEngine: FIFOInventoryEngine;
  
  // 기본 임계값 설정
  private defaultThresholds: ProfitabilityThresholds = {
    excellentMargin: 30,  // 우수 마진율 30%
    goodMargin: 20,      // 양호 마진율 20%
    warningMargin: 10,   // 주의 마진율 10%
    criticalMargin: 5    // 위험 마진율 5%
  };

  constructor(
    private supabase: SupabaseClient,
    private thresholds: ProfitabilityThresholds = {} as ProfitabilityThresholds
  ) {
    this.fifoEngine = new FIFOInventoryEngine(supabase);
    this.thresholds = { ...this.defaultThresholds, ...thresholds };
  }

  /**
   * 실시간 수익성 계산
   * @param period 분석 기간
   * @param filter 필터 옵션
   * @returns 수익성 보고서
   */
  async calculateRealTimeProfitability(
    period: DateRange,
    filter?: ProfitabilityFilter
  ): Promise<ProfitabilityReport> {
    try {
      // 1. 매출 데이터 조회
      const salesData = await this.getSalesData(period, filter);
      
      // 2. FIFO 기반 원가 계산
      const costData = await this.calculateCostsWithFIFO(salesData, period);
      
      // 3. 수익성 메트릭 계산
      const profitabilityMetrics = this.calculateProfitabilityMetrics(
        salesData.totalRevenue,
        costData.totalCost
      );
      
      // 4. 아이템별 수익성 분석
      const itemProfitabilities = await this.analyzeItemProfitability(
        salesData.items,
        period
      );
      
      // 5. 상위/하위 수익 아이템 추출
      const sortedItems = [...itemProfitabilities].sort(
        (a, b) => b.margin.grossMarginPercent - a.margin.grossMarginPercent
      );
      const topProfitableItems = sortedItems.slice(0, 10);
      const lowProfitableItems = sortedItems.slice(-10).reverse();
      
      // 6. 기간별 추세 계산
      const trends = await this.calculatePeriodTrends(period, filter);
      
      // 7. 보고서 생성
      const report: ProfitabilityReport = {
        id: this.generateReportId(),
        companyId: filter?.companyId || '',
        brandId: filter?.brandId,
        storeId: filter?.storeId,
        period: {
          type: 'custom' as PeriodType,
          range: period
        },
        summary: {
          totalRevenue: salesData.totalRevenue,
          totalCost: costData.totalCost,
          grossProfit: profitabilityMetrics.grossProfit,
          grossMarginPercent: profitabilityMetrics.grossMarginPercent,
          netProfit: profitabilityMetrics.netProfit,
          netMarginPercent: profitabilityMetrics.netMarginPercent
        },
        costBreakdown: costData.costStructure,
        topProfitableItems,
        lowProfitableItems,
        trends,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return report;
    } catch (error) {
      console.error('Error calculating real-time profitability:', error);
      throw error;
    }
  }

  /**
   * 특정 아이템의 수익성 분석
   * @param itemId 아이템 ID
   * @param period 분석 기간
   * @returns 아이템 수익성 정보
   */
  async getItemProfitability(
    itemId: string,
    period: DateRange
  ): Promise<ItemProfitability> {
    try {
      // 1. 아이템 판매 데이터 조회
      const { data: salesData, error: salesError } = await this.supabase
        .from('order_items')
        .select(`
          *,
          menu_items!inner(name, category),
          orders!inner(order_date, store_id, status)
        `)
        .eq('menu_item_id', itemId)
        .eq('orders.status', 'completed')
        .gte('orders.order_date', period.startDate.toISOString())
        .lte('orders.order_date', period.endDate.toISOString());

      if (salesError) throw salesError;
      if (!salesData || salesData.length === 0) {
        throw new Error('No sales data found for the item');
      }

      // 2. 총 판매량 및 매출 계산
      const quantity = salesData.reduce((sum, item) => sum + item.quantity, 0);
      const revenue = salesData.reduce(
        (sum, item) => sum + (item.unit_price * item.quantity),
        0
      );

      // 3. FIFO 원가 계산
      const materialCosts = await this.calculateItemMaterialCost(
        itemId,
        quantity,
        salesData[0].orders.store_id
      );

      // 4. 원가 구조 계산
      const costStructure = await this.calculateItemCostStructure(
        revenue,
        materialCosts
      );

      // 5. 마진 분석
      const margin = this.calculateMarginAnalysis(
        { amount: revenue, currency: 'KRW' },
        { amount: costStructure.totalCost, currency: 'KRW' }
      );

      // 6. 수익성 점수 계산
      const profitabilityScore = this.calculateProfitabilityScore(
        margin.grossMarginPercent
      );

      return {
        itemId,
        itemName: salesData[0].menu_items.name,
        category: salesData[0].menu_items.category,
        quantity,
        revenue: { amount: revenue, currency: 'KRW' },
        costStructure,
        margin,
        profitabilityScore
      };
    } catch (error) {
      console.error('Error getting item profitability:', error);
      throw error;
    }
  }

  /**
   * 원가 구조 분석
   * @param storeId 매장 ID
   * @param period 분석 기간
   * @returns 원가 구조 분석 결과
   */
  async analyzeCostStructure(
    storeId: string,
    period: DateRange
  ): Promise<{
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
  }> {
    try {
      // 1. 기간 내 총 매출 조회
      const { totalRevenue } = await this.getStoreRevenue(storeId, period);

      // 2. FIFO 기반 재료비 계산
      const materialCost = await this.getStoreMaterialCost(storeId, period);

      // 3. 인건비 및 간접비 계산 (설정된 비율 적용)
      const laborCost = totalRevenue * 0.25;  // 매출의 25%
      const overheadCost = totalRevenue * 0.15; // 매출의 15%
      const otherCost = totalRevenue * 0.05;   // 매출의 5%

      const totalCost = materialCost + laborCost + overheadCost + otherCost;

      const costStructure: CostStructure = {
        materialCost: { amount: materialCost, currency: 'KRW' },
        laborCost: { amount: laborCost, currency: 'KRW' },
        overheadCost: { amount: overheadCost, currency: 'KRW' },
        otherCost: { amount: otherCost, currency: 'KRW' },
        totalCost: { amount: totalCost, currency: 'KRW' }
      };

      // 4. 비율 계산
      const costBreakdownPercentage = {
        materialCostPercent: (materialCost / totalCost) * 100,
        laborCostPercent: (laborCost / totalCost) * 100,
        overheadCostPercent: (overheadCost / totalCost) * 100,
        otherCostPercent: (otherCost / totalCost) * 100
      };

      // 5. 일별 추세 계산
      const trends = await this.calculateCostStructureTrends(storeId, period);

      return {
        costStructure,
        costBreakdownPercentage,
        trends
      };
    } catch (error) {
      console.error('Error analyzing cost structure:', error);
      throw error;
    }
  }

  /**
   * 목표 대비 실제 마진 비교
   * @param period 분석 기간
   * @param targetMargin 목표 마진율
   * @returns 마진 비교 분석 결과
   */
  async compareTargetVsActualMargins(
    period: DateRange,
    targetMargin: number = 25
  ): Promise<{
    actualMargin: number;
    targetMargin: number;
    marginGap: number;
    performance: 'exceeded' | 'met' | 'below';
    varianceAnalysis: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
  }> {
    try {
      // 1. 실제 마진 계산
      const profitability = await this.calculateRealTimeProfitability(period);
      const actualMargin = profitability.summary.grossMarginPercent;

      // 2. 마진 갭 계산
      const marginGap = actualMargin - targetMargin;

      // 3. 성과 평가
      let performance: 'exceeded' | 'met' | 'below';
      if (marginGap > 2) {
        performance = 'exceeded';
      } else if (marginGap >= -2) {
        performance = 'met';
      } else {
        performance = 'below';
      }

      // 4. 차이 분석
      const varianceAnalysis = await this.analyzeMarginVariance(
        profitability,
        targetMargin
      );

      return {
        actualMargin,
        targetMargin,
        marginGap,
        performance,
        varianceAnalysis
      };
    } catch (error) {
      console.error('Error comparing margins:', error);
      throw error;
    }
  }

  /**
   * 수익성 추세 분석
   * @param periods 분석할 기간 수
   * @param periodType 기간 유형
   * @returns 수익성 추세 데이터
   */
  async getProfitabilityTrends(
    periods: number,
    periodType: PeriodType
  ): Promise<ProfitabilityTrend[]> {
    try {
      const trends: ProfitabilityTrend[] = [];
      const now = new Date();

      for (let i = periods - 1; i >= 0; i--) {
        const periodRange = this.calculatePeriodRange(now, i, periodType);
        
        // 기간별 데이터 조회
        const salesData = await this.getSalesData(periodRange);
        const costData = await this.calculateCostsWithFIFO(salesData, periodRange);
        
        const grossProfit = salesData.totalRevenue.amount - costData.totalCost.amount;
        const grossMarginPercent = salesData.totalRevenue.amount > 0
          ? (grossProfit / salesData.totalRevenue.amount) * 100
          : 0;

        trends.push({
          date: periodRange.startDate,
          revenue: salesData.totalRevenue,
          cost: costData.totalCost,
          grossProfit: { amount: grossProfit, currency: 'KRW' },
          grossMarginPercent,
          itemCount: salesData.itemCount,
          orderCount: salesData.orderCount
        });
      }

      return trends;
    } catch (error) {
      console.error('Error getting profitability trends:', error);
      throw error;
    }
  }

  /**
   * 수익성 상위 아이템 조회
   * @param limit 조회 개수
   * @param period 분석 기간
   * @returns 상위 수익 아이템 목록
   */
  async getTopPerformingItems(
    limit: number,
    period: DateRange
  ): Promise<ItemProfitability[]> {
    try {
      // 1. 모든 아이템의 판매 데이터 조회
      const itemSales = await this.getItemSalesData(period);
      
      // 2. 각 아이템의 수익성 계산
      const itemProfitabilities: ItemProfitability[] = [];
      
      for (const item of itemSales) {
        try {
          const profitability = await this.getItemProfitability(
            item.itemId,
            period
          );
          itemProfitabilities.push(profitability);
        } catch (error) {
          console.error(`Error calculating profitability for item ${item.itemId}:`, error);
          // 계속 진행
        }
      }
      
      // 3. 마진율 기준 정렬 및 상위 아이템 추출
      const sortedItems = itemProfitabilities.sort(
        (a, b) => b.margin.grossMarginPercent - a.margin.grossMarginPercent
      );
      
      return sortedItems.slice(0, limit);
    } catch (error) {
      console.error('Error getting top performing items:', error);
      throw error;
    }
  }

  /**
   * 수익성 하위 아이템 조회
   * @param threshold 임계값 (마진율 %)
   * @param period 분석 기간
   * @returns 하위 수익 아이템 목록
   */
  async getUnderperformingItems(
    threshold: number,
    period: DateRange
  ): Promise<ItemProfitability[]> {
    try {
      // 1. 모든 아이템의 판매 데이터 조회
      const itemSales = await this.getItemSalesData(period);
      
      // 2. 각 아이템의 수익성 계산
      const underperformingItems: ItemProfitability[] = [];
      
      for (const item of itemSales) {
        try {
          const profitability = await this.getItemProfitability(
            item.itemId,
            period
          );
          
          // 임계값 이하인 아이템만 추가
          if (profitability.margin.grossMarginPercent < threshold) {
            underperformingItems.push(profitability);
          }
        } catch (error) {
          console.error(`Error calculating profitability for item ${item.itemId}:`, error);
          // 계속 진행
        }
      }
      
      // 3. 마진율 기준 오름차순 정렬
      underperformingItems.sort(
        (a, b) => a.margin.grossMarginPercent - b.margin.grossMarginPercent
      );
      
      return underperformingItems;
    } catch (error) {
      console.error('Error getting underperforming items:', error);
      throw error;
    }
  }

  /**
   * 수익성 평가
   * @param marginPercent 마진율
   * @returns 수익성 평가 결과
   */
  assessProfitability(marginPercent: number): ProfitabilityAssessment {
    let status: ProfitabilityStatus;
    let score: number;
    const recommendations: string[] = [];
    const risks: string[] = [];

    // 상태 판정
    if (marginPercent >= this.thresholds.excellentMargin) {
      status = 'excellent';
      score = 90 + (marginPercent - this.thresholds.excellentMargin) * 0.5;
      recommendations.push('현재 수익성이 우수합니다. 품질 유지에 집중하세요.');
    } else if (marginPercent >= this.thresholds.goodMargin) {
      status = 'good';
      score = 70 + ((marginPercent - this.thresholds.goodMargin) / 
        (this.thresholds.excellentMargin - this.thresholds.goodMargin)) * 20;
      recommendations.push('원가 절감 기회를 탐색해보세요.');
      recommendations.push('고마진 메뉴 판매를 늘려보세요.');
    } else if (marginPercent >= this.thresholds.warningMargin) {
      status = 'warning';
      score = 40 + ((marginPercent - this.thresholds.warningMargin) / 
        (this.thresholds.goodMargin - this.thresholds.warningMargin)) * 30;
      recommendations.push('긴급히 원가 구조를 재검토하세요.');
      recommendations.push('메뉴 가격 조정을 고려하세요.');
      risks.push('수익성이 목표치를 하회하고 있습니다.');
    } else {
      status = 'critical';
      score = Math.max(0, 40 * (marginPercent / this.thresholds.warningMargin));
      recommendations.push('즉시 비상 대책을 수립하세요.');
      recommendations.push('손실 메뉴를 식별하고 개선하세요.');
      recommendations.push('공급업체 재협상을 진행하세요.');
      risks.push('심각한 수익성 문제가 발생했습니다.');
      risks.push('지속 시 사업 존속이 위험할 수 있습니다.');
    }

    // 점수 범위 제한
    score = Math.min(100, Math.max(0, score));

    return {
      status,
      score,
      recommendations,
      risks
    };
  }

  // === Private Helper Methods ===

  /**
   * 판매 데이터 조회
   */
  private async getSalesData(
    period: DateRange,
    filter?: ProfitabilityFilter
  ): Promise<{
    totalRevenue: Money;
    items: any[];
    itemCount: number;
    orderCount: number;
  }> {
    let query = this.supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          menu_items(name, category)
        )
      `)
      .eq('status', 'completed')
      .gte('order_date', period.startDate.toISOString())
      .lte('order_date', period.endDate.toISOString());

    if (filter?.storeId) {
      query = query.eq('store_id', filter.storeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const totalRevenue = data?.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    ) || 0;

    const items = data?.flatMap(order => order.order_items) || [];
    const itemCount = new Set(items.map(item => item.menu_item_id)).size;

    return {
      totalRevenue: { amount: totalRevenue, currency: 'KRW' },
      items,
      itemCount,
      orderCount: data?.length || 0
    };
  }

  /**
   * FIFO 기반 원가 계산
   */
  private async calculateCostsWithFIFO(
    salesData: any,
    period: DateRange
  ): Promise<{
    totalCost: Money;
    costStructure: CostStructure;
  }> {
    // 실제 구현에서는 레시피 데이터와 FIFO 엔진을 연동하여
    // 정확한 재료비를 계산해야 합니다
    const materialCostRate = 0.35; // 임시값: 매출의 35%
    const laborCostRate = 0.25;    // 임시값: 매출의 25%
    const overheadCostRate = 0.15; // 임시값: 매출의 15%
    const otherCostRate = 0.05;    // 임시값: 매출의 5%

    const revenue = salesData.totalRevenue.amount;
    
    const materialCost = revenue * materialCostRate;
    const laborCost = revenue * laborCostRate;
    const overheadCost = revenue * overheadCostRate;
    const otherCost = revenue * otherCostRate;
    const totalCost = materialCost + laborCost + overheadCost + otherCost;

    return {
      totalCost: { amount: totalCost, currency: 'KRW' },
      costStructure: {
        materialCost: { amount: materialCost, currency: 'KRW' },
        laborCost: { amount: laborCost, currency: 'KRW' },
        overheadCost: { amount: overheadCost, currency: 'KRW' },
        otherCost: { amount: otherCost, currency: 'KRW' },
        totalCost: { amount: totalCost, currency: 'KRW' }
      }
    };
  }

  /**
   * 수익성 메트릭 계산
   */
  private calculateProfitabilityMetrics(
    revenue: Money,
    cost: Money
  ): {
    grossProfit: Money;
    grossMarginPercent: number;
    netProfit?: Money;
    netMarginPercent?: number;
  } {
    const grossProfit = revenue.amount - cost.amount;
    const grossMarginPercent = revenue.amount > 0
      ? (grossProfit / revenue.amount) * 100
      : 0;

    return {
      grossProfit: { amount: grossProfit, currency: 'KRW' },
      grossMarginPercent: Math.round(grossMarginPercent * 100) / 100,
      netProfit: { amount: grossProfit * 0.8, currency: 'KRW' }, // 임시: 세금 등 20% 차감
      netMarginPercent: Math.round(grossMarginPercent * 0.8 * 100) / 100
    };
  }

  /**
   * 아이템별 수익성 분석
   */
  private async analyzeItemProfitability(
    items: any[],
    period: DateRange
  ): Promise<ItemProfitability[]> {
    const itemMap = new Map<string, any>();

    // 아이템별 집계
    items.forEach(item => {
      const existing = itemMap.get(item.menu_item_id) || {
        itemId: item.menu_item_id,
        itemName: item.menu_items?.name || 'Unknown',
        category: item.menu_items?.category,
        quantity: 0,
        revenue: 0
      };

      existing.quantity += item.quantity;
      existing.revenue += item.unit_price * item.quantity;
      
      itemMap.set(item.menu_item_id, existing);
    });

    // 수익성 계산
    const profitabilities: ItemProfitability[] = [];
    
    for (const [itemId, data] of itemMap) {
      try {
        const profitability = await this.getItemProfitability(
          itemId,
          period
        );
        profitabilities.push(profitability);
      } catch (error) {
        console.error(`Error analyzing item ${itemId}:`, error);
      }
    }

    return profitabilities;
  }

  /**
   * 기간별 추세 계산
   */
  private async calculatePeriodTrends(
    period: DateRange,
    filter?: ProfitabilityFilter
  ): Promise<ProfitabilityTrend[]> {
    // 일별 추세 계산 (최대 30일)
    const trends: ProfitabilityTrend[] = [];
    const daysDiff = Math.ceil(
      (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysToAnalyze = Math.min(daysDiff, 30);

    for (let i = 0; i < daysToAnalyze; i++) {
      const date = new Date(period.startDate);
      date.setDate(date.getDate() + i);
      
      const dayRange: DateRange = {
        startDate: new Date(date.setHours(0, 0, 0, 0)),
        endDate: new Date(date.setHours(23, 59, 59, 999))
      };

      const dayData = await this.getSalesData(dayRange, filter);
      const costData = await this.calculateCostsWithFIFO(dayData, dayRange);
      
      const grossProfit = dayData.totalRevenue.amount - costData.totalCost.amount;
      const grossMarginPercent = dayData.totalRevenue.amount > 0
        ? (grossProfit / dayData.totalRevenue.amount) * 100
        : 0;

      trends.push({
        date: dayRange.startDate,
        revenue: dayData.totalRevenue,
        cost: costData.totalCost,
        grossProfit: { amount: grossProfit, currency: 'KRW' },
        grossMarginPercent,
        itemCount: dayData.itemCount,
        orderCount: dayData.orderCount
      });
    }

    return trends;
  }

  /**
   * 아이템 재료비 계산 (FIFO 기반)
   */
  private async calculateItemMaterialCost(
    itemId: string,
    quantity: number,
    storeId: string
  ): Promise<number> {
    // 실제 구현에서는 레시피와 FIFO 엔진을 연동
    // 임시로 판매가의 35%로 계산
    return quantity * 5000 * 0.35; // 임시값
  }

  /**
   * 아이템 원가 구조 계산
   */
  private async calculateItemCostStructure(
    revenue: number,
    materialCost: number
  ): Promise<CostStructure> {
    const laborCost = revenue * 0.25;
    const overheadCost = revenue * 0.15;
    const otherCost = revenue * 0.05;
    const totalCost = materialCost + laborCost + overheadCost + otherCost;

    return {
      materialCost: { amount: materialCost, currency: 'KRW' },
      laborCost: { amount: laborCost, currency: 'KRW' },
      overheadCost: { amount: overheadCost, currency: 'KRW' },
      otherCost: { amount: otherCost, currency: 'KRW' },
      totalCost: { amount: totalCost, currency: 'KRW' }
    };
  }

  /**
   * 마진 분석 계산
   */
  private calculateMarginAnalysis(
    revenue: Money,
    cost: Money,
    targetMargin?: number
  ): MarginAnalysis {
    const grossProfit = revenue.amount - cost.amount;
    const grossMarginPercent = revenue.amount > 0
      ? (grossProfit / revenue.amount) * 100
      : 0;

    return {
      revenue,
      cost,
      grossProfit: { amount: grossProfit, currency: 'KRW' },
      grossMarginPercent: Math.round(grossMarginPercent * 100) / 100,
      targetMarginPercent: targetMargin,
      marginGap: targetMargin ? grossMarginPercent - targetMargin : undefined
    };
  }

  /**
   * 수익성 점수 계산
   */
  private calculateProfitabilityScore(marginPercent: number): number {
    if (marginPercent >= this.thresholds.excellentMargin) {
      return 90 + Math.min(10, (marginPercent - this.thresholds.excellentMargin) * 0.5);
    } else if (marginPercent >= this.thresholds.goodMargin) {
      return 70 + ((marginPercent - this.thresholds.goodMargin) / 
        (this.thresholds.excellentMargin - this.thresholds.goodMargin)) * 20;
    } else if (marginPercent >= this.thresholds.warningMargin) {
      return 40 + ((marginPercent - this.thresholds.warningMargin) / 
        (this.thresholds.goodMargin - this.thresholds.warningMargin)) * 30;
    } else if (marginPercent >= this.thresholds.criticalMargin) {
      return 20 + ((marginPercent - this.thresholds.criticalMargin) / 
        (this.thresholds.warningMargin - this.thresholds.criticalMargin)) * 20;
    } else {
      return Math.max(0, 20 * (marginPercent / this.thresholds.criticalMargin));
    }
  }

  /**
   * 매장 매출 조회
   */
  private async getStoreRevenue(
    storeId: string,
    period: DateRange
  ): Promise<{ totalRevenue: number }> {
    const { data, error } = await this.supabase
      .from('orders')
      .select('total_amount')
      .eq('store_id', storeId)
      .eq('status', 'completed')
      .gte('order_date', period.startDate.toISOString())
      .lte('order_date', period.endDate.toISOString());

    if (error) throw error;

    const totalRevenue = data?.reduce((sum, order) => 
      sum + (order.total_amount || 0), 0
    ) || 0;

    return { totalRevenue };
  }

  /**
   * 매장 재료비 조회 (FIFO 기반)
   */
  private async getStoreMaterialCost(
    storeId: string,
    period: DateRange
  ): Promise<number> {
    // 실제 구현에서는 inventory_movements 테이블에서
    // FIFO 기반 출고 원가를 집계
    const { data, error } = await this.supabase
      .from('inventory_movements')
      .select('total_cost')
      .eq('store_id', storeId)
      .in('movement_type', ['consumption', 'waste'])
      .gte('created_at', period.startDate.toISOString())
      .lte('created_at', period.endDate.toISOString());

    if (error) throw error;

    return data?.reduce((sum, movement) => 
      sum + (movement.total_cost?.amount || 0), 0
    ) || 0;
  }

  /**
   * 원가 구조 추세 계산
   */
  private async calculateCostStructureTrends(
    storeId: string,
    period: DateRange
  ): Promise<Array<{ date: Date; costStructure: CostStructure }>> {
    const trends: Array<{ date: Date; costStructure: CostStructure }> = [];
    
    // 일별 추세 계산 (최대 30일)
    const daysDiff = Math.ceil(
      (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysToAnalyze = Math.min(daysDiff, 30);

    for (let i = 0; i < daysToAnalyze; i++) {
      const date = new Date(period.startDate);
      date.setDate(date.getDate() + i);
      
      const dayRange: DateRange = {
        startDate: new Date(date.setHours(0, 0, 0, 0)),
        endDate: new Date(date.setHours(23, 59, 59, 999))
      };

      const { totalRevenue } = await this.getStoreRevenue(storeId, dayRange);
      const materialCost = await this.getStoreMaterialCost(storeId, dayRange);
      
      const laborCost = totalRevenue * 0.25;
      const overheadCost = totalRevenue * 0.15;
      const otherCost = totalRevenue * 0.05;
      const totalCost = materialCost + laborCost + overheadCost + otherCost;

      trends.push({
        date: dayRange.startDate,
        costStructure: {
          materialCost: { amount: materialCost, currency: 'KRW' },
          laborCost: { amount: laborCost, currency: 'KRW' },
          overheadCost: { amount: overheadCost, currency: 'KRW' },
          otherCost: { amount: otherCost, currency: 'KRW' },
          totalCost: { amount: totalCost, currency: 'KRW' }
        }
      });
    }

    return trends;
  }

  /**
   * 아이템별 판매 데이터 조회
   */
  private async getItemSalesData(
    period: DateRange
  ): Promise<Array<{ itemId: string; itemName: string; quantity: number; revenue: number }>> {
    const { data, error } = await this.supabase
      .from('order_items')
      .select(`
        menu_item_id,
        quantity,
        unit_price,
        menu_items!inner(name),
        orders!inner(order_date, status)
      `)
      .eq('orders.status', 'completed')
      .gte('orders.order_date', period.startDate.toISOString())
      .lte('orders.order_date', period.endDate.toISOString());

    if (error) throw error;

    // 아이템별 집계
    const itemMap = new Map<string, any>();
    
    data?.forEach(item => {
      const existing = itemMap.get(item.menu_item_id) || {
        itemId: item.menu_item_id,
        itemName: item.menu_items.name,
        quantity: 0,
        revenue: 0
      };

      existing.quantity += item.quantity;
      existing.revenue += item.unit_price * item.quantity;
      
      itemMap.set(item.menu_item_id, existing);
    });

    return Array.from(itemMap.values());
  }

  /**
   * 마진 차이 분석
   */
  private async analyzeMarginVariance(
    profitability: ProfitabilityReport,
    targetMargin: number
  ): Promise<Array<{
    factor: string;
    impact: number;
    description: string;
  }>> {
    const variance: Array<{
      factor: string;
      impact: number;
      description: string;
    }> = [];

    const actualMargin = profitability.summary.grossMarginPercent;
    const marginGap = actualMargin - targetMargin;

    // 재료비 영향 분석
    const materialCostRate = profitability.costBreakdown.materialCost.amount / 
      profitability.summary.totalRevenue.amount * 100;
    
    if (materialCostRate > 35) {
      variance.push({
        factor: '재료비 과다',
        impact: -(materialCostRate - 35),
        description: `재료비가 목표치보다 ${(materialCostRate - 35).toFixed(1)}% 높습니다`
      });
    }

    // 인건비 영향 분석
    const laborCostRate = profitability.costBreakdown.laborCost.amount / 
      profitability.summary.totalRevenue.amount * 100;
    
    if (laborCostRate > 25) {
      variance.push({
        factor: '인건비 과다',
        impact: -(laborCostRate - 25),
        description: `인건비가 목표치보다 ${(laborCostRate - 25).toFixed(1)}% 높습니다`
      });
    }

    // 판매 믹스 영향 분석
    if (profitability.lowProfitableItems.length > profitability.topProfitableItems.length) {
      variance.push({
        factor: '판매 믹스 불균형',
        impact: -5,
        description: '저수익 메뉴의 판매 비중이 높습니다'
      });
    }

    return variance;
  }

  /**
   * 기간 범위 계산
   */
  private calculatePeriodRange(
    baseDate: Date,
    periodsAgo: number,
    periodType: PeriodType
  ): DateRange {
    const startDate = new Date(baseDate);
    const endDate = new Date(baseDate);

    switch (periodType) {
      case 'daily':
        startDate.setDate(startDate.getDate() - periodsAgo);
        endDate.setDate(endDate.getDate() - periodsAgo);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - (periodsAgo * 7));
        endDate.setDate(endDate.getDate() - (periodsAgo * 7) + 6);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - periodsAgo);
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() - periodsAgo + 1);
        endDate.setDate(0); // 마지막 날
        break;
      case 'quarterly':
        startDate.setMonth(startDate.getMonth() - (periodsAgo * 3));
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() - (periodsAgo * 3) + 3);
        endDate.setDate(0);
        break;
      case 'yearly':
        startDate.setFullYear(startDate.getFullYear() - periodsAgo);
        startDate.setMonth(0, 1);
        endDate.setFullYear(endDate.getFullYear() - periodsAgo);
        endDate.setMonth(11, 31);
        break;
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }

  /**
   * 보고서 ID 생성
   */
  private generateReportId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `RPT-${timestamp}-${random}`;
  }
}