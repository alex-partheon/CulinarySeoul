import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Info,
  Download,
  Filter
} from 'lucide-react';

export interface KPI {
  id: string;
  name: string;
  value: number | string;
  target: number | string;
  unit?: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  period: string;
  category: string;
  description?: string;
}

interface KPIDashboardProps {
  kpis: KPI[];
  title?: string;
  onKPIClick?: (kpi: KPI) => void;
  onExport?: () => void;
  showFilters?: boolean;
  layout?: 'grid' | 'list';
}

export function KPIDashboard({
  kpis,
  title = '핵심 성과 지표',
  onKPIClick,
  onExport,
  showFilters = true,
  layout = 'grid'
}: KPIDashboardProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const categories = ['all', ...Array.from(new Set(kpis.map(kpi => kpi.category)))];
  
  const filteredKPIs = kpis.filter(kpi => {
    if (selectedCategory !== 'all' && kpi.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && kpi.status !== selectedStatus) return false;
    return true;
  });

  const getStatusIcon = (status: KPI['status']) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getStatusText = (status: KPI['status']) => {
    switch (status) {
      case 'excellent':
        return '우수';
      case 'good':
        return '양호';
      case 'warning':
        return '주의';
      case 'critical':
        return '위험';
    }
  };

  const getProgressColor = (progress: number, status: KPI['status']) => {
    if (status === 'critical') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    const className = "h-3 w-3";
    switch (trend) {
      case 'up':
        return <TrendingUp className={cn(className, "text-green-600")} />;
      case 'down':
        return <TrendingUp className={cn(className, "text-red-600 rotate-180")} />;
      case 'stable':
        return <span className={cn(className, "text-gray-600")}>→</span>;
    }
  };

  const KPICard = ({ kpi }: { kpi: KPI }) => (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-lg transition-all duration-200",
        "border-2",
        kpi.status === 'critical' && "border-red-200",
        kpi.status === 'warning' && "border-yellow-200"
      )}
      onClick={() => onKPIClick?.(kpi)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs">
                {kpi.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusColor(kpi.status))}
              >
                {getStatusIcon(kpi.status)}
                <span className="ml-1">{getStatusText(kpi.status)}</span>
              </Badge>
            </div>
            <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
          </div>
          {getTrendIcon(kpi.trend)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{kpi.value}</span>
            {kpi.unit && <span className="text-sm text-gray-600">{kpi.unit}</span>}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Target className="h-3 w-3" />
              <span>목표: {kpi.target}{kpi.unit}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.period}</p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">달성률</span>
            <span className="font-medium">{kpi.progress}%</span>
          </div>
          <Progress 
            value={kpi.progress} 
            className="h-2"
            indicatorClassName={getProgressColor(kpi.progress, kpi.status)}
          />
        </div>

        {kpi.description && (
          <p className="text-xs text-gray-600 pt-2 border-t">
            {kpi.description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  const KPIListItem = ({ kpi }: { kpi: KPI }) => (
    <div
      className={cn(
        "p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all",
        "flex items-center gap-4",
        kpi.status === 'critical' && "border-red-200 bg-red-50",
        kpi.status === 'warning' && "border-yellow-200 bg-yellow-50"
      )}
      onClick={() => onKPIClick?.(kpi)}
    >
      <div className="flex-shrink-0">
        {getStatusIcon(kpi.status)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium truncate">{kpi.name}</h4>
          <Badge variant="secondary" className="text-xs">
            {kpi.category}
          </Badge>
        </div>
        <p className="text-xs text-gray-600">{kpi.description || kpi.period}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold">{kpi.value}</span>
          {kpi.unit && <span className="text-xs text-gray-600">{kpi.unit}</span>}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Target className="h-3 w-3" />
          <span>{kpi.target}{kpi.unit}</span>
        </div>
      </div>

      <div className="flex-shrink-0 w-20">
        <div className="flex items-center justify-between text-xs mb-1">
          <span>{kpi.progress}%</span>
          {getTrendIcon(kpi.trend)}
        </div>
        <Progress 
          value={kpi.progress} 
          className="h-2"
          indicatorClassName={getProgressColor(kpi.progress, kpi.status)}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {showFilters && (
            <>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm border rounded-md px-3 py-1"
              >
                <option value="all">모든 카테고리</option>
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-sm border rounded-md px-3 py-1"
              >
                <option value="all">모든 상태</option>
                <option value="excellent">우수</option>
                <option value="good">양호</option>
                <option value="warning">주의</option>
                <option value="critical">위험</option>
              </select>
            </>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
            >
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
          )}
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-3">
        {['excellent', 'good', 'warning', 'critical'].map((status) => {
          const count = kpis.filter(k => k.status === status).length;
          return (
            <Card key={status} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status as KPI['status'])}
                  <span className="text-sm font-medium">
                    {getStatusText(status as KPI['status'])}
                  </span>
                </div>
                <span className="text-xl font-bold">{count}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* KPI Display */}
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKPIs.map((kpi) => (
            <KPIListItem key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}

      {filteredKPIs.length === 0 && (
        <Card className="p-8 text-center">
          <Info className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">조건에 맞는 KPI가 없습니다</p>
        </Card>
      )}
    </div>
  );
}