import { CostOptimizer } from '../costOptimizer';
import { ProfitabilityReport, ItemProfitability, CostStructure } from '../types';

describe('CostOptimizer', () => {
  let optimizer: CostOptimizer;
  
  beforeEach(() => {
    optimizer = new CostOptimizer();
  });
  
  describe('generateOptimizationSuggestions', () => {
    it('should generate margin improvement suggestions when margin is below target', () => {
      const report: ProfitabilityReport = {
        id: 'report-1',
        companyId: 'company-1',
        period: {
          type: 'monthly',
          range: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31')
          }
        },
        summary: {
          totalRevenue: { amount: 100000000, currency: 'KRW' },
          totalCost: { amount: 80000000, currency: 'KRW' },
          grossProfit: { amount: 20000000, currency: 'KRW' },
          grossMarginPercent: 20 // Below target 30%
        },
        costBreakdown: {
          materialCost: { amount: 40000000, currency: 'KRW' },
          laborCost: { amount: 25000000, currency: 'KRW' },
          overheadCost: { amount: 15000000, currency: 'KRW' },
          totalCost: { amount: 80000000, currency: 'KRW' }
        },
        topProfitableItems: [],
        lowProfitableItems: [],
        trends: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const suggestions = optimizer.generateOptimizationSuggestions(report);
      
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.type === 'cost_reduction')).toBe(true);
      expect(suggestions.some(s => s.priority === 'high')).toBe(true);
    });
    
    it('should generate supplier change suggestions for high material costs', () => {
      const report: ProfitabilityReport = {
        id: 'report-1',
        companyId: 'company-1',
        period: {
          type: 'monthly',
          range: {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-01-31')
          }
        },
        summary: {
          totalRevenue: { amount: 100000000, currency: 'KRW' },
          totalCost: { amount: 70000000, currency: 'KRW' },
          grossProfit: { amount: 30000000, currency: 'KRW' },
          grossMarginPercent: 30
        },
        costBreakdown: {
          materialCost: { amount: 40000000, currency: 'KRW' }, // 40% of revenue, above 35%
          laborCost: { amount: 20000000, currency: 'KRW' },
          overheadCost: { amount: 10000000, currency: 'KRW' },
          totalCost: { amount: 70000000, currency: 'KRW' }
        },
        topProfitableItems: [],
        lowProfitableItems: [],
        trends: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const suggestions = optimizer.generateOptimizationSuggestions(report);
      
      expect(suggestions.some(s => s.type === 'supplier_change')).toBe(true);
      expect(suggestions.some(s => s.koreanTitle.includes('재료비'))).toBe(true);
    });
  });
  
  describe('analyzeMenuEngineering', () => {
    it('should correctly categorize menu items', () => {
      const items: ItemProfitability[] = [
        {
          itemId: 'item-1',
          itemName: '베스트셀러 메뉴',
          quantity: 100,
          revenue: { amount: 1000000, currency: 'KRW' },
          costStructure: {
            materialCost: { amount: 300000, currency: 'KRW' },
            laborCost: { amount: 200000, currency: 'KRW' },
            overheadCost: { amount: 100000, currency: 'KRW' },
            totalCost: { amount: 600000, currency: 'KRW' }
          },
          margin: {
            revenue: { amount: 1000000, currency: 'KRW' },
            cost: { amount: 600000, currency: 'KRW' },
            grossProfit: { amount: 400000, currency: 'KRW' },
            grossMarginPercent: 40
          },
          profitabilityScore: 80 // High profitability
        },
        {
          itemId: 'item-2',
          itemName: '저수익 메뉴',
          quantity: 20,
          revenue: { amount: 200000, currency: 'KRW' },
          costStructure: {
            materialCost: { amount: 150000, currency: 'KRW' },
            laborCost: { amount: 30000, currency: 'KRW' },
            overheadCost: { amount: 10000, currency: 'KRW' },
            totalCost: { amount: 190000, currency: 'KRW' }
          },
          margin: {
            revenue: { amount: 200000, currency: 'KRW' },
            cost: { amount: 190000, currency: 'KRW' },
            grossProfit: { amount: 10000, currency: 'KRW' },
            grossMarginPercent: 5
          },
          profitabilityScore: 20 // Low profitability
        }
      ];
      
      const analysis = optimizer.analyzeMenuEngineering(items);
      
      expect(analysis).toHaveLength(2);
      expect(analysis[0].category).toBe('star'); // High popularity, high profitability
      expect(analysis[1].category).toBe('dog');  // Low popularity, low profitability
      expect(analysis[0].koreanRecommendation).toBe('품질 유지하며 적극 홍보');
      expect(analysis[1].koreanRecommendation).toBe('메뉴 제거 또는 전면 개선 검토');
    });
  });
  
  describe('suggestPricingAdjustments', () => {
    it('should suggest price increases for low-margin items', () => {
      const marginAnalysis = {
        revenue: { amount: 100000000, currency: 'KRW' as const },
        cost: { amount: 80000000, currency: 'KRW' as const },
        grossProfit: { amount: 20000000, currency: 'KRW' as const },
        grossMarginPercent: 20
      };
      
      const items: ItemProfitability[] = [
        {
          itemId: 'low-margin-item',
          itemName: '저마진 메뉴',
          quantity: 100,
          revenue: { amount: 1000000, currency: 'KRW' },
          costStructure: {
            materialCost: { amount: 700000, currency: 'KRW' },
            laborCost: { amount: 200000, currency: 'KRW' },
            overheadCost: { amount: 50000, currency: 'KRW' },
            totalCost: { amount: 950000, currency: 'KRW' }
          },
          margin: {
            revenue: { amount: 1000000, currency: 'KRW' },
            cost: { amount: 950000, currency: 'KRW' },
            grossProfit: { amount: 50000, currency: 'KRW' },
            grossMarginPercent: 5 // Below critical 10%
          }
        }
      ];
      
      const adjustments = optimizer.suggestPricingAdjustments(marginAnalysis, items);
      
      expect(adjustments).toHaveLength(1);
      expect(adjustments[0].itemId).toBe('low-margin-item');
      expect(adjustments[0].suggestedPrice.amount).toBeGreaterThan(adjustments[0].currentPrice.amount);
      expect(adjustments[0].koreanReason).toContain('위험 수준');
    });
  });
  
  describe('identifyCostReductionOpportunities', () => {
    it('should identify opportunities when cost ratios are high', () => {
      const costStructure: CostStructure = {
        materialCost: { amount: 40000000, currency: 'KRW' }, // 40% of revenue
        laborCost: { amount: 35000000, currency: 'KRW' },  // 35% of revenue
        overheadCost: { amount: 25000000, currency: 'KRW' }, // 25% of revenue
        totalCost: { amount: 100000000, currency: 'KRW' }
      };
      
      const totalRevenue = { amount: 100000000, currency: 'KRW' as const };
      
      const opportunities = optimizer.identifyCostReductionOpportunities(costStructure, totalRevenue);
      
      expect(opportunities.length).toBeGreaterThan(0);
      expect(opportunities.some(o => o.area === 'material')).toBe(true);
      expect(opportunities.some(o => o.area === 'labor')).toBe(true);
      expect(opportunities.some(o => o.area === 'overhead')).toBe(true);
      
      const materialOpp = opportunities.find(o => o.area === 'material');
      expect(materialOpp?.koreanActions).toContain('대량 구매 할인 협상');
    });
  });
  
  describe('recommendSupplierAlternatives', () => {
    it('should return supplier alternatives', () => {
      const materialCosts = [
        { materialId: 'mat-001', cost: 50000 }
      ];
      
      const alternatives = optimizer.recommendSupplierAlternatives(materialCosts);
      
      expect(alternatives.length).toBeGreaterThan(0);
      expect(alternatives[0].savingsPercent).toBeGreaterThan(0);
      expect(alternatives[0].koreanConsiderations).toContain('동일한 품질 등급');
    });
  });
});