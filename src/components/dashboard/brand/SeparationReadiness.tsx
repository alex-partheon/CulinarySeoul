import React from 'react';
import { 
  TrendingUp, 
  Database, 
  Settings, 
  Users, 
  Calendar,
  CheckCircle,
  Circle,
  AlertCircle,
  Info
} from 'lucide-react';
import { useSeparationStatus } from '@/hooks/useSeparationStatus';
import { cn } from '@/lib/utils';

interface SeparationReadinessProps {
  brandId: string;
  className?: string;
}

export const SeparationReadiness: React.FC<SeparationReadinessProps> = ({ 
  brandId, 
  className 
}) => {
  const { status, actionItems, loading, error, updateActionItem } = useSeparationStatus(brandId);
  
  if (loading) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm p-6", className)}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !status) {
    return (
      <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm p-6", className)}>
        <div className="text-center text-red-600">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">{error || '데이터를 불러올 수 없습니다.'}</p>
        </div>
      </div>
    );
  }
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  const getReadinessMessage = (percentage: number) => {
    if (percentage >= 90) return '분리 준비 거의 완료';
    if (percentage >= 70) return '분리 준비 진행 중';
    if (percentage >= 50) return '추가 준비 필요';
    return '상당한 준비 필요';
  };
  
  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      critical: '긴급',
      high: '높음',
      medium: '보통',
      low: '낮음'
    };
    
    return (
      <span className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
        colors[priority as keyof typeof colors]
      )}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };
  
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">독립 운영 준비도</h3>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "text-2xl font-bold",
              status.overallReadiness >= 80 ? 'text-green-600' :
              status.overallReadiness >= 60 ? 'text-blue-600' :
              status.overallReadiness >= 40 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {status.overallReadiness}%
            </div>
            <span className="text-sm text-gray-500">{getReadinessMessage(status.overallReadiness)}</span>
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className={cn("h-3 rounded-full transition-all duration-500", getProgressColor(status.overallReadiness))}
            style={{ width: `${status.overallReadiness}%` }}
          />
        </div>
        
        {/* Estimated Time */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            예상 소요 시간
          </div>
          <div className="text-sm">
            <span className="font-semibold text-gray-900">{status.estimatedTime.days}일</span>
            <span className={cn(
              "ml-2 text-xs",
              status.estimatedTime.confidence === 'high' ? 'text-green-600' :
              status.estimatedTime.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
            )}>
              (신뢰도: {
                status.estimatedTime.confidence === 'high' ? '높음' :
                status.estimatedTime.confidence === 'medium' ? '보통' : '낮음'
              })
            </span>
          </div>
        </div>
      </div>
      
      {/* Detailed Metrics */}
      <div className="p-6 space-y-6">
        {/* Data Completeness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">데이터 완성도</h4>
            </div>
            <span className="text-sm font-semibold text-gray-900">{status.dataCompleteness.percentage}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={cn("h-2 rounded-full transition-all duration-500", getProgressColor(status.dataCompleteness.percentage))}
              style={{ width: `${status.dataCompleteness.percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">재고 데이터</span>
              <span className="font-medium">{status.dataCompleteness.details.inventory}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주문 기록</span>
              <span className="font-medium">{status.dataCompleteness.details.orders}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">고객 정보</span>
              <span className="font-medium">{status.dataCompleteness.details.customers}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">공급업체</span>
              <span className="font-medium">{status.dataCompleteness.details.suppliers}%</span>
            </div>
          </div>
        </div>
        
        {/* System Readiness */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">시스템 준비도</h4>
            </div>
            <span className="text-sm font-semibold text-gray-900">{status.systemReadiness.percentage}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={cn("h-2 rounded-full transition-all duration-500", getProgressColor(status.systemReadiness.percentage))}
              style={{ width: `${status.systemReadiness.percentage}%` }}
            />
          </div>
          <div className="space-y-1 text-xs">
            {Object.entries(status.systemReadiness.details).map(([key, value]) => {
              const labels = {
                apiIntegration: 'API 연동',
                paymentSetup: '결제 시스템',
                deliverySetup: '배송 시스템',
                taxConfiguration: '세금 설정',
                backupSystem: '백업 시스템'
              };
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600">{labels[key as keyof typeof labels]}</span>
                  <span className={cn(
                    "flex items-center",
                    value ? 'text-green-600' : 'text-red-600'
                  )}>
                    {value ? <CheckCircle className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Independent Capability */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">독립 운영 역량</h4>
            </div>
            <span className="text-sm font-semibold text-gray-900">{status.independentCapability.percentage}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={cn("h-2 rounded-full transition-all duration-500", getProgressColor(status.independentCapability.percentage))}
              style={{ width: `${status.independentCapability.percentage}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">운영 자율성</span>
              <span className="font-medium">{status.independentCapability.details.operationalAutonomy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">재무 독립성</span>
              <span className="font-medium">{status.independentCapability.details.financialIndependence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">시스템 안정성</span>
              <span className="font-medium">{status.independentCapability.details.systemStability}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">직원 준비도</span>
              <span className="font-medium">{status.independentCapability.details.staffReadiness}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blockers */}
      {status.estimatedTime.blockers.length > 0 && (
        <div className="px-6 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <h5 className="text-sm font-medium text-red-900 mb-1">주요 차단 요소</h5>
                <ul className="text-xs text-red-700 space-y-1">
                  {status.estimatedTime.blockers.map((blocker, index) => (
                    <li key={index}>• {blocker}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Items */}
      <div className="border-t border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">필수 작업 항목</h4>
            <span className="text-xs text-gray-500">
              {actionItems.filter(item => item.completed).length} / {actionItems.length} 완료
            </span>
          </div>
          
          <div className="space-y-3">
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3">
                <button
                  onClick={() => updateActionItem(item.id, !item.completed)}
                  className={cn(
                    "mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                    item.completed 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  {item.completed && (
                    <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L5 6.586 3.707 5.293z" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className={cn(
                        "text-sm font-medium",
                        item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                      )}>
                        {item.title}
                      </h5>
                      <p className={cn(
                        "text-xs mt-0.5",
                        item.completed ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {item.description}
                      </p>
                    </div>
                    <div className="ml-3 flex flex-col items-end space-y-1">
                      {getPriorityBadge(item.priority)}
                      {item.estimatedDays && (
                        <span className="text-xs text-gray-500">~{item.estimatedDays}일</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {actionItems.length === 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              모든 준비가 완료되었습니다!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};