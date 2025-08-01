import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  Clock,
  Target,
  ChevronRight,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  OptimizationSuggestion,
  OptimizationPriority,
  ImplementationDifficulty,
  SuggestionType
} from '@/domains/analytics/profitability/costOptimizer';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';

interface CostOptimizationPanelProps {
  suggestions: OptimizationSuggestion[];
  onImplement?: (suggestionId: string) => void;
  onDismiss?: (suggestionId: string) => void;
  onViewDetails?: (suggestionId: string) => void;
}

export const CostOptimizationPanel: React.FC<CostOptimizationPanelProps> = ({
  suggestions,
  onImplement,
  onDismiss,
  onViewDetails
}) => {
  const [selectedType, setSelectedType] = useState<SuggestionType | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<OptimizationPriority | 'all'>('all');
  
  // 필터링된 제안들
  const filteredSuggestions = suggestions.filter(suggestion => {
    const typeMatch = selectedType === 'all' || suggestion.type === selectedType;
    const priorityMatch = selectedPriority === 'all' || suggestion.priority === selectedPriority;
    return typeMatch && priorityMatch;
  });
  
  // 전체 예상 절감액 계산
  const totalSavings = filteredSuggestions.reduce(
    (sum, s) => sum + s.estimatedSavings.amount, 
    0
  );
  
  // 평균 절감률 계산
  const avgSavingsPercent = filteredSuggestions.length > 0
    ? filteredSuggestions.reduce((sum, s) => sum + s.estimatedSavingsPercent, 0) / filteredSuggestions.length
    : 0;
  
  // 타입별 아이콘
  const getTypeIcon = (type: SuggestionType) => {
    switch (type) {
      case 'cost_reduction': return <TrendingDown className="w-4 h-4" />;
      case 'price_adjustment': return <DollarSign className="w-4 h-4" />;
      case 'menu_engineering': return <Target className="w-4 h-4" />;
      case 'supplier_change': return <TrendingUp className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };
  
  // 우선순위별 색상
  const getPriorityColor = (priority: OptimizationPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  // 난이도별 표시
  const getDifficultyDisplay = (difficulty: ImplementationDifficulty) => {
    switch (difficulty) {
      case 'easy': return { text: '쉬움', color: 'text-green-600' };
      case 'moderate': return { text: '보통', color: 'text-yellow-600' };
      case 'hard': return { text: '어려움', color: 'text-red-600' };
    }
  };
  
  // 타입 한글명
  const getTypeKoreanName = (type: SuggestionType) => {
    switch (type) {
      case 'cost_reduction': return '비용 절감';
      case 'price_adjustment': return '가격 조정';
      case 'menu_engineering': return '메뉴 최적화';
      case 'supplier_change': return '공급업체 변경';
      case 'portion_control': return '포션 관리';
      case 'waste_reduction': return '폐기 감소';
      case 'labor_optimization': return '인건비 최적화';
      case 'overhead_reduction': return '간접비 절감';
      default: return type;
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 헤더 및 요약 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">비용 최적화 제안</h2>
          <Badge variant="default">
            {filteredSuggestions.length}개 제안
          </Badge>
        </div>
        
        {/* 요약 통계 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">예상 총 절감액</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalSavings)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">평균 절감률</p>
            <p className="text-2xl font-bold text-blue-600">
              {avgSavingsPercent.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">즉시 실행 가능</p>
            <p className="text-2xl font-bold text-purple-600">
              {filteredSuggestions.filter(s => s.difficulty === 'easy').length}개
            </p>
          </div>
        </div>
        
        {/* 필터 */}
        <div className="flex gap-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">유형</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as SuggestionType | 'all')}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">전체</option>
              <option value="cost_reduction">비용 절감</option>
              <option value="price_adjustment">가격 조정</option>
              <option value="menu_engineering">메뉴 최적화</option>
              <option value="supplier_change">공급업체 변경</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">우선순위</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as OptimizationPriority | 'all')}
              className="border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">전체</option>
              <option value="high">높음</option>
              <option value="medium">중간</option>
              <option value="low">낮음</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 제안 카드 목록 */}
      <div className="space-y-3">
        {filteredSuggestions.map((suggestion) => (
          <Card key={suggestion.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* 헤더 */}
                <div className="flex items-center gap-3 mb-2">
                  {getTypeIcon(suggestion.type)}
                  <h3 className="font-semibold text-lg">{suggestion.koreanTitle}</h3>
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(suggestion.priority)}
                  >
                    {suggestion.priority === 'high' ? '높음' : 
                     suggestion.priority === 'medium' ? '중간' : '낮음'}
                  </Badge>
                  <Badge variant="secondary">
                    {getTypeKoreanName(suggestion.type)}
                  </Badge>
                </div>
                
                {/* 설명 */}
                <p className="text-gray-600 mb-3">{suggestion.koreanDescription}</p>
                
                {/* 메트릭스 */}
                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">예상 절감액</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(suggestion.estimatedSavings.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">절감률</p>
                    <p className="font-semibold">{suggestion.estimatedSavingsPercent.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">구현 기간</p>
                    <p className="font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {suggestion.implementationTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">난이도</p>
                    <p className={`font-semibold ${getDifficultyDisplay(suggestion.difficulty).color}`}>
                      {getDifficultyDisplay(suggestion.difficulty).text}
                    </p>
                  </div>
                </div>
                
                {/* 영향도/노력도 시각화 */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">영향도</span>
                      <span className="font-semibold">{suggestion.impactScore}/10</span>
                    </div>
                    <Progress value={suggestion.impactScore * 10} className="h-2" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">노력도</span>
                      <span className="font-semibold">{suggestion.effortScore}/10</span>
                    </div>
                    <Progress value={suggestion.effortScore * 10} className="h-2" />
                  </div>
                </div>
                
                {/* 목표 메트릭 */}
                {suggestion.metrics && (
                  <div className="bg-gray-50 rounded p-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">현재: {suggestion.metrics.current}{suggestion.metrics.unit}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-green-600">목표: {suggestion.metrics.target}{suggestion.metrics.unit}</span>
                    </div>
                  </div>
                )}
                
                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onImplement?.(suggestion.id)}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    실행
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails?.(suggestion.id)}
                  >
                    상세보기
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDismiss?.(suggestion.id)}
                    className="text-gray-500"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {filteredSuggestions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>선택한 조건에 맞는 최적화 제안이 없습니다.</p>
        </div>
      )}
    </div>
  );
};