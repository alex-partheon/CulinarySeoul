import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface PerformanceData {
  date: string;
  value: number;
}

interface PerformanceMetricProps {
  title: string;
  value: string | number;
  target?: string | number;
  unit?: string;
  change?: {
    value: number;
    period: string;
  };
  progress?: number;
  trend?: 'up' | 'down' | 'stable';
  data?: PerformanceData[];
  category?: string;
  description?: string;
  showChart?: boolean;
  chartType?: 'line' | 'area';
  onClick?: () => void;
}

export function PerformanceMetric({
  title,
  value,
  target,
  unit = '',
  change,
  progress,
  trend,
  data,
  category,
  description,
  showChart = true,
  chartType = 'line',
  onClick
}: PerformanceMetricProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />;
      case 'down':
        return <TrendingDown className="h-4 w-4" />;
      case 'stable':
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      case 'stable':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 70) return 'bg-yellow-500';
    if (value >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 rounded shadow-lg border text-xs">
          <p className="font-medium">{payload[0].payload.date}</p>
          <p className="text-gray-600">
            {payload[0].value.toLocaleString('ko-KR')}{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!data || data.length === 0) return null;

    const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
    const DataComponent = chartType === 'area' ? Area : Line;

    return (
      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <DataComponent
              type="monotone"
              dataKey="value"
              stroke={trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280'}
              fill={trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280'}
              fillOpacity={chartType === 'area' ? 0.1 : 0}
              strokeWidth={2}
              dot={false}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            {category && (
              <Badge variant="secondary" className="text-xs mb-1">
                {category}
              </Badge>
            )}
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          {target && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Target className="h-3 w-3" />
              목표: {target}{unit}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-lg text-gray-600">{unit}</span>}
          </div>
          {change && (
            <Badge 
              variant="secondary" 
              className={cn("flex items-center gap-1", getTrendColor())}
            >
              {getTrendIcon()}
              {change.value > 0 ? '+' : ''}{change.value}%
              <span className="text-xs font-normal ml-1">({change.period})</span>
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-gray-600">{description}</p>
        )}

        {progress !== undefined && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">달성률</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              indicatorClassName={getProgressColor(progress)}
            />
          </div>
        )}

        {showChart && data && renderChart()}
      </CardContent>
    </Card>
  );
}