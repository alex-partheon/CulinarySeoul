import { 
  ProfitabilityReport, 
  ItemProfitability, 
  MarginAnalysis, 
  CostStructure,
  Money 
} from './types';

// 메뉴 엔지니어링 카테고리
export type MenuCategory = 'star' | 'puzzle' | 'plowhorse' | 'dog';

// 최적화 제안 우선순위
export type OptimizationPriority = 'high' | 'medium' | 'low';

// 구현 난이도
export type ImplementationDifficulty = 'easy' | 'moderate' | 'hard';

// 최적화 제안 타입
export type SuggestionType = 
  | 'cost_reduction'      // 비용 절감
  | 'price_adjustment'    // 가격 조정
  | 'menu_engineering'    // 메뉴 엔지니어링
  | 'supplier_change'     // 공급업체 변경
  | 'portion_control'     // 포션 관리
  | 'waste_reduction'     // 폐기 감소
  | 'labor_optimization'  // 인건비 최적화
  | 'overhead_reduction'; // 간접비 절감

// 최적화 제안
export interface OptimizationSuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  koreanTitle: string;
  koreanDescription: string;
  priority: OptimizationPriority;
  difficulty: ImplementationDifficulty;
  estimatedSavings: Money;
  estimatedSavingsPercent: number;
  impactScore: number;        // 1-10 영향도
  effortScore: number;        // 1-10 노력도
  implementationTime: string; // 예: "1주", "1개월"
  targetItems?: string[];     // 대상 아이템 ID
  actionSteps?: string[];     // 실행 단계
  metrics?: {                 // 관련 지표
    current: number;
    target: number;
    unit: string;
  };
}

// 메뉴 엔지니어링 분석
export interface MenuEngineeringAnalysis {
  itemId: string;
  itemName: string;
  category: MenuCategory;
  popularity: number;         // 판매 비율 (%)
  profitability: number;      // 수익성 점수
  recommendation: string;
  koreanRecommendation: string;
}

// 가격 조정 제안
export interface PricingAdjustment {
  itemId: string;
  itemName: string;
  currentPrice: Money;
  suggestedPrice: Money;
  priceChange: Money;
  priceChangePercent: number;
  marginImprovement: number;  // 마진 개선율 (%)
  reason: string;
  koreanReason: string;
  elasticityRisk: 'low' | 'medium' | 'high'; // 가격 탄력성 위험
}

// 공급업체 대안
export interface SupplierAlternative {
  materialId: string;
  materialName: string;
  currentSupplier: string;
  currentCost: Money;
  alternativeSupplier: string;
  alternativeCost: Money;
  savingsAmount: Money;
  savingsPercent: number;
  qualityRating: number;      // 1-5 품질 평가
  reliabilityRating: number;  // 1-5 신뢰도 평가
  considerations: string[];
  koreanConsiderations: string[];
}

// 비용 절감 기회
export interface CostReductionOpportunity {
  area: 'material' | 'labor' | 'overhead' | 'waste';
  title: string;
  koreanTitle: string;
  currentCost: Money;
  potentialSavings: Money;
  savingsPercent: number;
  actions: string[];
  koreanActions: string[];
  timeline: string;
  requiredInvestment?: Money;
  paybackPeriod?: string;
}

export class CostOptimizer {
  // 메뉴 엔지니어링 임계값
  private readonly POPULARITY_THRESHOLD = 70;    // 인기도 임계값 (%)
  private readonly PROFITABILITY_THRESHOLD = 70; // 수익성 임계값 (점수)
  
  // 마진 목표
  private readonly TARGET_GROSS_MARGIN = 30;     // 목표 매출총이익률 (%)
  private readonly CRITICAL_MARGIN = 10;         // 위험 마진율 (%)
  
  /**
   * 최적화 제안 생성
   */
  public generateOptimizationSuggestions(
    profitabilityData: ProfitabilityReport
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 1. 마진 분석 기반 제안
    if (profitabilityData.summary.grossMarginPercent < this.TARGET_GROSS_MARGIN) {
      suggestions.push(...this.generateMarginImprovementSuggestions(profitabilityData));
    }
    
    // 2. 저수익 아이템 개선 제안
    if (profitabilityData.lowProfitableItems.length > 0) {
      suggestions.push(...this.generateLowProfitItemSuggestions(profitabilityData.lowProfitableItems));
    }
    
    // 3. 원가 구조 분석 기반 제안
    suggestions.push(...this.analyzeCostStructure(profitabilityData.costBreakdown, profitabilityData.summary.totalRevenue));
    
    // 4. 메뉴 엔지니어링 제안 (전체 아이템 필요)
    const allItems = [...profitabilityData.topProfitableItems, ...profitabilityData.lowProfitableItems];
    if (allItems.length > 0) {
      const menuAnalysis = this.analyzeMenuEngineering(allItems);
      suggestions.push(...this.generateMenuEngineeringSuggestions(menuAnalysis, allItems));
    }
    
    // 우선순위별로 정렬
    return this.prioritizeSuggestions(suggestions);
  }
  
  /**
   * 메뉴 엔지니어링 분석
   */
  public analyzeMenuEngineering(items: ItemProfitability[]): MenuEngineeringAnalysis[] {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const avgProfitability = items.reduce((sum, item) => sum + (item.profitabilityScore || 0), 0) / items.length;
    
    return items.map(item => {
      const popularity = (item.quantity / totalQuantity) * 100;
      const profitability = item.profitabilityScore || 0;
      
      // 카테고리 분류
      let category: MenuCategory;
      let recommendation: string;
      let koreanRecommendation: string;
      
      if (popularity >= this.POPULARITY_THRESHOLD && profitability >= this.PROFITABILITY_THRESHOLD) {
        category = 'star';
        recommendation = 'Maintain quality and promote actively';
        koreanRecommendation = '품질 유지하며 적극 홍보';
      } else if (popularity < this.POPULARITY_THRESHOLD && profitability >= this.PROFITABILITY_THRESHOLD) {
        category = 'puzzle';
        recommendation = 'Increase promotion and visibility';
        koreanRecommendation = '프로모션 강화 및 노출 증대';
      } else if (popularity >= this.POPULARITY_THRESHOLD && profitability < this.PROFITABILITY_THRESHOLD) {
        category = 'plowhorse';
        recommendation = 'Optimize costs or adjust pricing';
        koreanRecommendation = '원가 최적화 또는 가격 조정';
      } else {
        category = 'dog';
        recommendation = 'Consider removing or reimagining';
        koreanRecommendation = '메뉴 제거 또는 전면 개선 검토';
      }
      
      return {
        itemId: item.itemId,
        itemName: item.itemName,
        category,
        popularity,
        profitability,
        recommendation,
        koreanRecommendation
      };
    });
  }
  
  /**
   * 가격 조정 제안
   */
  public suggestPricingAdjustments(marginAnalysis: MarginAnalysis, items: ItemProfitability[]): PricingAdjustment[] {
    const adjustments: PricingAdjustment[] = [];
    
    for (const item of items) {
      // 마진이 낮은 아이템에 대한 가격 조정 제안
      if (item.margin.grossMarginPercent < this.CRITICAL_MARGIN) {
        const currentPrice = {
          amount: item.revenue.amount / item.quantity,
          currency: item.revenue.currency
        };
        
        // 목표 마진 달성을 위한 가격 계산
        const targetRevenue = item.costStructure.totalCost.amount / (1 - this.TARGET_GROSS_MARGIN / 100);
        const suggestedPrice = {
          amount: targetRevenue / item.quantity,
          currency: currentPrice.currency
        };
        
        const priceChange = {
          amount: suggestedPrice.amount - currentPrice.amount,
          currency: currentPrice.currency
        };
        
        const priceChangePercent = (priceChange.amount / currentPrice.amount) * 100;
        
        // 가격 탄력성 위험 평가
        let elasticityRisk: 'low' | 'medium' | 'high';
        if (priceChangePercent < 5) {
          elasticityRisk = 'low';
        } else if (priceChangePercent < 10) {
          elasticityRisk = 'medium';
        } else {
          elasticityRisk = 'high';
        }
        
        adjustments.push({
          itemId: item.itemId,
          itemName: item.itemName,
          currentPrice,
          suggestedPrice,
          priceChange,
          priceChangePercent,
          marginImprovement: this.TARGET_GROSS_MARGIN - item.margin.grossMarginPercent,
          reason: `Current margin ${item.margin.grossMarginPercent.toFixed(1)}% is below critical level`,
          koreanReason: `현재 마진 ${item.margin.grossMarginPercent.toFixed(1)}%는 위험 수준 이하`,
          elasticityRisk
        });
      }
    }
    
    return adjustments;
  }
  
  /**
   * 비용 절감 기회 식별
   */
  public identifyCostReductionOpportunities(costStructure: CostStructure, totalRevenue: Money): CostReductionOpportunity[] {
    const opportunities: CostReductionOpportunity[] = [];
    
    // 재료비 분석
    const materialCostRatio = (costStructure.materialCost.amount / totalRevenue.amount) * 100;
    if (materialCostRatio > 35) {
      opportunities.push({
        area: 'material',
        title: 'Material Cost Optimization',
        koreanTitle: '재료비 최적화',
        currentCost: costStructure.materialCost,
        potentialSavings: {
          amount: costStructure.materialCost.amount * 0.1, // 10% 절감 목표
          currency: costStructure.materialCost.currency
        },
        savingsPercent: 10,
        actions: [
          'Negotiate bulk purchase discounts',
          'Explore alternative suppliers',
          'Implement portion control',
          'Reduce menu complexity'
        ],
        koreanActions: [
          '대량 구매 할인 협상',
          '대체 공급업체 탐색',
          '포션 컨트롤 시행',
          '메뉴 복잡도 감소'
        ],
        timeline: '2-3개월'
      });
    }
    
    // 인건비 분석
    const laborCostRatio = (costStructure.laborCost.amount / totalRevenue.amount) * 100;
    if (laborCostRatio > 30) {
      opportunities.push({
        area: 'labor',
        title: 'Labor Cost Efficiency',
        koreanTitle: '인건비 효율화',
        currentCost: costStructure.laborCost,
        potentialSavings: {
          amount: costStructure.laborCost.amount * 0.15, // 15% 절감 목표
          currency: costStructure.laborCost.currency
        },
        savingsPercent: 15,
        actions: [
          'Optimize staff scheduling',
          'Cross-train employees',
          'Implement productivity tools',
          'Review overtime policies'
        ],
        koreanActions: [
          '직원 스케줄 최적화',
          '교차 교육 실시',
          '생산성 도구 도입',
          '초과근무 정책 검토'
        ],
        timeline: '1-2개월',
        requiredInvestment: {
          amount: 5000000,
          currency: 'KRW'
        },
        paybackPeriod: '6개월'
      });
    }
    
    // 간접비 분석
    const overheadCostRatio = (costStructure.overheadCost.amount / totalRevenue.amount) * 100;
    if (overheadCostRatio > 20) {
      opportunities.push({
        area: 'overhead',
        title: 'Overhead Cost Reduction',
        koreanTitle: '간접비 절감',
        currentCost: costStructure.overheadCost,
        potentialSavings: {
          amount: costStructure.overheadCost.amount * 0.08, // 8% 절감 목표
          currency: costStructure.overheadCost.currency
        },
        savingsPercent: 8,
        actions: [
          'Negotiate rent reduction',
          'Implement energy-saving measures',
          'Review subscription services',
          'Optimize delivery routes'
        ],
        koreanActions: [
          '임대료 인하 협상',
          '에너지 절약 조치 시행',
          '구독 서비스 검토',
          '배송 경로 최적화'
        ],
        timeline: '3-6개월'
      });
    }
    
    return opportunities;
  }
  
  /**
   * 공급업체 대안 추천
   */
  public recommendSupplierAlternatives(materialCosts: any[]): SupplierAlternative[] {
    // 실제 구현에서는 공급업체 데이터베이스와 연동
    // 여기서는 예시 데이터로 시뮬레이션
    const alternatives: SupplierAlternative[] = [];
    
    // 고비용 재료에 대한 대안 제시
    const mockAlternatives = [
      {
        materialId: 'mat-001',
        materialName: '한우 등심',
        currentSupplier: '현재 공급업체 A',
        currentCost: { amount: 50000, currency: 'KRW' as const },
        alternativeSupplier: '대안 공급업체 B',
        alternativeCost: { amount: 42000, currency: 'KRW' as const },
        savingsAmount: { amount: 8000, currency: 'KRW' as const },
        savingsPercent: 16,
        qualityRating: 4.5,
        reliabilityRating: 4.0,
        considerations: [
          'Similar quality grade',
          'Requires 2-week lead time',
          'Minimum order quantity: 50kg'
        ],
        koreanConsiderations: [
          '동일한 품질 등급',
          '2주 리드타임 필요',
          '최소 주문 수량: 50kg'
        ]
      }
    ];
    
    return mockAlternatives;
  }
  
  /**
   * 마진 개선 제안 생성
   */
  private generateMarginImprovementSuggestions(report: ProfitabilityReport): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const marginGap = this.TARGET_GROSS_MARGIN - report.summary.grossMarginPercent;
    
    if (marginGap > 0) {
      const requiredSavings = report.summary.totalCost.amount * (marginGap / 100);
      
      suggestions.push({
        id: 'margin-improvement-001',
        type: 'cost_reduction',
        title: 'Overall Margin Improvement Plan',
        description: `Current gross margin ${report.summary.grossMarginPercent.toFixed(1)}% is below target ${this.TARGET_GROSS_MARGIN}%`,
        koreanTitle: '전체 마진 개선 계획',
        koreanDescription: `현재 매출총이익률 ${report.summary.grossMarginPercent.toFixed(1)}%는 목표 ${this.TARGET_GROSS_MARGIN}% 미달`,
        priority: 'high',
        difficulty: 'moderate',
        estimatedSavings: {
          amount: requiredSavings,
          currency: report.summary.totalCost.currency
        },
        estimatedSavingsPercent: marginGap,
        impactScore: 9,
        effortScore: 6,
        implementationTime: '2-3개월',
        actionSteps: [
          'Review all cost components',
          'Identify quick wins',
          'Implement cost controls',
          'Monitor progress weekly'
        ],
        metrics: {
          current: report.summary.grossMarginPercent,
          target: this.TARGET_GROSS_MARGIN,
          unit: '%'
        }
      });
    }
    
    return suggestions;
  }
  
  /**
   * 저수익 아이템 개선 제안
   */
  private generateLowProfitItemSuggestions(items: ItemProfitability[]): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 마진이 위험 수준인 아이템들
    const criticalItems = items.filter(item => item.margin.grossMarginPercent < this.CRITICAL_MARGIN);
    
    if (criticalItems.length > 0) {
      const totalLoss = criticalItems.reduce((sum, item) => {
        const targetRevenue = item.costStructure.totalCost.amount / (1 - this.CRITICAL_MARGIN / 100);
        return sum + (targetRevenue - item.revenue.amount);
      }, 0);
      
      suggestions.push({
        id: 'critical-items-001',
        type: 'menu_engineering',
        title: 'Critical Low-Margin Items',
        description: `${criticalItems.length} items have margins below ${this.CRITICAL_MARGIN}%`,
        koreanTitle: '위험 저마진 아이템',
        koreanDescription: `${criticalItems.length}개 아이템의 마진이 ${this.CRITICAL_MARGIN}% 미만`,
        priority: 'high',
        difficulty: 'easy',
        estimatedSavings: {
          amount: totalLoss,
          currency: 'KRW'
        },
        estimatedSavingsPercent: (totalLoss / items.reduce((s, i) => s + i.revenue.amount, 0)) * 100,
        impactScore: 8,
        effortScore: 3,
        implementationTime: '1주',
        targetItems: criticalItems.map(i => i.itemId),
        actionSteps: [
          'Review item recipes',
          'Adjust portions or prices',
          'Consider removing unprofitable items',
          'Renegotiate supplier prices'
        ]
      });
    }
    
    return suggestions;
  }
  
  /**
   * 원가 구조 분석
   */
  private analyzeCostStructure(costStructure: CostStructure, totalRevenue: Money): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 재료비 비중이 높은 경우
    const materialRatio = (costStructure.materialCost.amount / totalRevenue.amount) * 100;
    if (materialRatio > 35) {
      suggestions.push({
        id: 'material-cost-001',
        type: 'supplier_change',
        title: 'High Material Cost Ratio',
        description: `Material costs are ${materialRatio.toFixed(1)}% of revenue (target: <35%)`,
        koreanTitle: '높은 재료비 비중',
        koreanDescription: `재료비가 매출의 ${materialRatio.toFixed(1)}% 차지 (목표: 35% 미만)`,
        priority: 'high',
        difficulty: 'moderate',
        estimatedSavings: {
          amount: costStructure.materialCost.amount * 0.1,
          currency: costStructure.materialCost.currency
        },
        estimatedSavingsPercent: 10,
        impactScore: 7,
        effortScore: 5,
        implementationTime: '1개월',
        actionSteps: [
          'Audit current suppliers',
          'Request competitive quotes',
          'Negotiate volume discounts',
          'Explore local alternatives'
        ]
      });
    }
    
    return suggestions;
  }
  
  /**
   * 메뉴 엔지니어링 제안 생성
   */
  private generateMenuEngineeringSuggestions(
    analysis: MenuEngineeringAnalysis[], 
    items: ItemProfitability[]
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 카테고리별 아이템 수 계산
    const categoryCounts = analysis.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<MenuCategory, number>);
    
    // Dog 아이템이 많은 경우
    if (categoryCounts.dog && categoryCounts.dog > 0) {
      const dogItems = analysis.filter(a => a.category === 'dog');
      const dogRevenue = items
        .filter(i => dogItems.some(d => d.itemId === i.itemId))
        .reduce((sum, item) => sum + item.revenue.amount, 0);
      
      suggestions.push({
        id: 'menu-dog-items-001',
        type: 'menu_engineering',
        title: 'Remove or Reimagine Dog Items',
        description: `${categoryCounts.dog} items are low popularity and low profitability`,
        koreanTitle: 'Dog 아이템 제거 또는 개선',
        koreanDescription: `${categoryCounts.dog}개 아이템이 저인기-저수익 상태`,
        priority: 'medium',
        difficulty: 'easy',
        estimatedSavings: {
          amount: dogRevenue * 0.5, // 제거 시 예상 절감액
          currency: 'KRW'
        },
        estimatedSavingsPercent: 5,
        impactScore: 6,
        effortScore: 2,
        implementationTime: '2주',
        targetItems: dogItems.map(d => d.itemId),
        actionSteps: [
          'Evaluate each dog item',
          'Test recipe improvements',
          'Consider seasonal rotation',
          'Remove consistently poor performers'
        ]
      });
    }
    
    // Puzzle 아이템 프로모션
    if (categoryCounts.puzzle && categoryCounts.puzzle > 0) {
      const puzzleItems = analysis.filter(a => a.category === 'puzzle');
      
      suggestions.push({
        id: 'menu-puzzle-promo-001',
        type: 'menu_engineering',
        title: 'Promote High-Profit Puzzle Items',
        description: `${categoryCounts.puzzle} profitable items need more visibility`,
        koreanTitle: '고수익 Puzzle 아이템 홍보',
        koreanDescription: `${categoryCounts.puzzle}개 고수익 아이템의 노출 증대 필요`,
        priority: 'medium',
        difficulty: 'easy',
        estimatedSavings: {
          amount: puzzleItems.length * 1000000, // 아이템당 예상 추가 수익
          currency: 'KRW'
        },
        estimatedSavingsPercent: 3,
        impactScore: 7,
        effortScore: 2,
        implementationTime: '1주',
        targetItems: puzzleItems.map(p => p.itemId),
        actionSteps: [
          'Create promotional materials',
          'Train staff on upselling',
          'Feature in prime menu positions',
          'Offer limited-time specials'
        ]
      });
    }
    
    return suggestions;
  }
  
  /**
   * 제안 우선순위 정렬
   */
  private prioritizeSuggestions(suggestions: OptimizationSuggestion[]): OptimizationSuggestion[] {
    return suggestions.sort((a, b) => {
      // 우선순위 점수 계산 (영향도 / 노력도 * 우선순위 가중치)
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const scoreA = (a.impactScore / a.effortScore) * priorityWeight[a.priority];
      const scoreB = (b.impactScore / b.effortScore) * priorityWeight[b.priority];
      
      return scoreB - scoreA;
    });
  }
}