import React, { useState, useEffect } from 'react';
import { CostOptimizationPanel } from './CostOptimizationPanel';
import { CostOptimizer, OptimizationSuggestion } from '@/domains/analytics/profitability';
import { profitabilityService } from '@/domains/analytics/profitability';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';

/**
 * 비용 최적화 예제 컴포넌트
 * 
 * 사용법:
 * 1. 수익성 데이터를 가져옴
 * 2. CostOptimizer를 사용하여 최적화 제안 생성
 * 3. CostOptimizationPanel로 제안 표시
 */
export const CostOptimizationExample: React.FC = () => {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    loadOptimizationSuggestions();
  }, []);
  
  const loadOptimizationSuggestions = async () => {
    try {
      setIsLoading(true);
      
      // 현재 회사의 수익성 보고서 가져오기
      const reports = await profitabilityService.getReports({
        companyId: 'current-company-id', // 실제로는 AuthContext에서 가져옴
        periodType: 'monthly'
      });
      
      if (reports.length > 0) {
        // 최신 보고서로 최적화 제안 생성
        const optimizer = new CostOptimizer();
        const optimizationSuggestions = optimizer.generateOptimizationSuggestions(reports[0]);
        setSuggestions(optimizationSuggestions);
      }
    } catch (error) {
      console.error('Failed to load optimization suggestions:', error);
      toast({
        title: '최적화 제안 로드 실패',
        description: '데이터를 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImplementSuggestion = async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    toast({
      title: '최적화 실행',
      description: `"${suggestion.koreanTitle}" 실행을 시작합니다.`,
    });
    
    // 실제 구현: 제안 타입에 따라 적절한 액션 수행
    // 예: 가격 조정, 공급업체 변경 요청 등
  };
  
  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    toast({
      title: '제안 숨김',
      description: '제안이 목록에서 제거되었습니다.',
    });
  };
  
  const handleViewDetails = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;
    
    // 실제 구현: 상세 모달이나 페이지로 이동
    console.log('View details for:', suggestion);
    
    toast({
      title: '상세 정보',
      description: '제안의 상세 정보를 확인합니다.',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <CostOptimizationPanel
        suggestions={suggestions}
        onImplement={handleImplementSuggestion}
        onDismiss={handleDismissSuggestion}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};