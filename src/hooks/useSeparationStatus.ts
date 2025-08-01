import { useState, useEffect } from 'react';
import { SeparationStatus, SeparationActionItem } from '@/types/dashboard';

export const useSeparationStatus = (brandId: string) => {
  const [status, setStatus] = useState<SeparationStatus | null>(null);
  const [actionItems, setActionItems] = useState<SeparationActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateSeparationStatus = async () => {
      try {
        setLoading(true);
        
        // In production, this would fetch real data from the API
        // For now, we'll simulate the calculation
        
        // Data Completeness Check
        const dataCompleteness = {
          inventory: 85, // 85% of inventory data is complete
          orders: 92,    // 92% of order history migrated
          customers: 78, // 78% of customer data verified
          suppliers: 65, // 65% of supplier contracts setup
          financials: 71 // 71% of financial records reconciled
        };
        
        const avgDataCompleteness = Object.values(dataCompleteness).reduce((a, b) => a + b, 0) / Object.values(dataCompleteness).length;
        
        // System Readiness Check
        const systemReadiness = {
          apiIntegration: true,     // APIs are integrated
          paymentSetup: true,       // Payment gateway configured
          deliverySetup: false,     // Delivery system not ready
          taxConfiguration: true,   // Tax system configured
          backupSystem: false       // Backup system not ready
        };
        
        const systemReadinessPercentage = (Object.values(systemReadiness).filter(Boolean).length / Object.values(systemReadiness).length) * 100;
        
        // Independent Capability Assessment
        const independentCapability = {
          operationalAutonomy: 82,   // Can operate 82% independently
          financialIndependence: 75, // 75% financial independence
          systemStability: 88,       // System 88% stable
          staffReadiness: 70         // Staff 70% trained
        };
        
        const avgIndependentCapability = Object.values(independentCapability).reduce((a, b) => a + b, 0) / Object.values(independentCapability).length;
        
        // Identify blockers
        const blockers: string[] = [];
        if (!systemReadiness.deliverySetup) blockers.push('배송 시스템 설정 필요');
        if (!systemReadiness.backupSystem) blockers.push('백업 시스템 구축 필요');
        if (dataCompleteness.suppliers < 70) blockers.push('공급업체 계약 완료 필요');
        if (independentCapability.staffReadiness < 80) blockers.push('직원 교육 완료 필요');
        
        // Calculate estimated time
        const criticalItems = blockers.length;
        const estimatedDays = criticalItems * 7 + Math.ceil((100 - avgDataCompleteness) / 5) * 3;
        
        // Overall readiness calculation
        const overallReadiness = (avgDataCompleteness * 0.4 + systemReadinessPercentage * 0.3 + avgIndependentCapability * 0.3);
        
        const separationStatus: SeparationStatus = {
          dataCompleteness: {
            percentage: Math.round(avgDataCompleteness),
            details: dataCompleteness
          },
          systemReadiness: {
            percentage: Math.round(systemReadinessPercentage),
            details: systemReadiness
          },
          independentCapability: {
            percentage: Math.round(avgIndependentCapability),
            details: independentCapability
          },
          estimatedTime: {
            days: estimatedDays,
            confidence: blockers.length > 2 ? 'low' : blockers.length > 0 ? 'medium' : 'high',
            blockers
          },
          overallReadiness: Math.round(overallReadiness)
        };
        
        setStatus(separationStatus);
        
        // Generate action items based on status
        const items: SeparationActionItem[] = [];
        
        // Data completion items
        if (dataCompleteness.inventory < 90) {
          items.push({
            id: 'data-1',
            category: 'data',
            title: '재고 데이터 정리',
            description: '모든 재고 데이터를 검증하고 누락된 정보를 보완하세요.',
            priority: 'high',
            completed: false,
            estimatedDays: 5
          });
        }
        
        if (dataCompleteness.suppliers < 80) {
          items.push({
            id: 'data-2',
            category: 'data',
            title: '공급업체 계약 완료',
            description: '모든 공급업체와의 독립적인 계약을 체결하세요.',
            priority: 'critical',
            completed: false,
            estimatedDays: 14
          });
        }
        
        // System items
        if (!systemReadiness.deliverySetup) {
          items.push({
            id: 'system-1',
            category: 'system',
            title: '배송 시스템 구축',
            description: '독립적인 배송 관리 시스템을 설정하세요.',
            priority: 'critical',
            completed: false,
            estimatedDays: 7
          });
        }
        
        if (!systemReadiness.backupSystem) {
          items.push({
            id: 'system-2',
            category: 'system',
            title: '백업 시스템 설정',
            description: '데이터 백업 및 복구 시스템을 구축하세요.',
            priority: 'high',
            completed: false,
            estimatedDays: 3
          });
        }
        
        // Operational items
        if (independentCapability.staffReadiness < 80) {
          items.push({
            id: 'operational-1',
            category: 'operational',
            title: '직원 교육 완료',
            description: '독립 운영을 위한 직원 교육을 완료하세요.',
            priority: 'medium',
            completed: false,
            estimatedDays: 10
          });
        }
        
        // Financial items
        if (independentCapability.financialIndependence < 80) {
          items.push({
            id: 'financial-1',
            category: 'financial',
            title: '독립 회계 시스템',
            description: '독립적인 회계 및 재무 관리 시스템을 구축하세요.',
            priority: 'high',
            completed: false,
            estimatedDays: 7
          });
        }
        
        setActionItems(items.sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : '분리 준비 상태를 확인할 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    
    calculateSeparationStatus();
  }, [brandId]);
  
  const updateActionItem = (itemId: string, completed: boolean) => {
    setActionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed } : item
      )
    );
  };
  
  return {
    status,
    actionItems,
    loading,
    error,
    updateActionItem
  };
};