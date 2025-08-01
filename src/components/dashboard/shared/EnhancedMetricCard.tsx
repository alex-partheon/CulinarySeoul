import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    data: number[];
    color?: string;
  };
  className?: string;
  onClick?: () => void;
}

export function EnhancedMetricCard({
  title,
  value,
  change,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  trend,
  className,
  onClick
}: EnhancedMetricCardProps) {
  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    if (!change) return '';
    
    switch (change.type) {
      case 'increase':
        return 'text-green-600 bg-green-50';
      case 'decrease':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const generateSparkline = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const height = 40;
    const width = 100;
    const step = width / (data.length - 1);
    
    const points = data.map((val, i) => {
      const x = i * step;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <svg className="w-full h-10" viewBox={`0 0 ${width} ${height}`}>
        <polyline
          fill="none"
          stroke={trend?.color || 'currentColor'}
          strokeWidth="2"
          points={points}
          className="opacity-50"
        />
        <polyline
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          points={points}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={trend?.color || 'currentColor'} stopOpacity="0.1" />
            <stop offset="100%" stopColor={trend?.color || 'currentColor'} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-all duration-200 cursor-pointer group",
        "bg-gradient-to-br from-white to-gray-50/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all",
            iconColor.replace('text-', 'bg-').replace('600', '50')
          )}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        {change && (
          <Badge 
            variant="secondary" 
            className={cn("flex items-center gap-1 px-2 py-0.5", getTrendColor())}
          >
            {getTrendIcon()}
            <span className="text-xs font-medium">
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {trend && trend.data.length > 0 && (
            <div className="w-24 h-10 text-blue-600">
              {generateSparkline(trend.data)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}