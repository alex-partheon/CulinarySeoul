import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon, Activity } from 'lucide-react';

interface LiveMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: 'active' | 'warning' | 'critical' | 'idle';
  updateInterval?: number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  onClick?: () => void;
  pulse?: boolean;
}

export function LiveMetricCard({
  title,
  value,
  unit = '',
  status = 'active',
  updateInterval = 3000,
  icon: Icon = Activity,
  iconColor = 'text-gray-600',
  trend,
  description,
  onClick,
  pulse = true
}: LiveMetricCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (pulse) {
      const interval = setInterval(() => {
        setIsUpdating(true);
        setLastUpdate(new Date());
        setTimeout(() => setIsUpdating(false), 500);
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [updateInterval, pulse]);

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      case 'idle':
        return 'bg-gray-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg",
        isUpdating && "ring-2 ring-blue-400 ring-opacity-50"
      )}
      onClick={onClick}
    >
      {/* Live Indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className={cn(
          "h-2 w-2 rounded-full animate-pulse",
          getStatusColor()
        )} />
        <span className="text-xs text-gray-500">LIVE</span>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn("h-4 w-4", iconColor)} />
              <p className="text-sm font-medium text-gray-600">{title}</p>
            </div>
            
            <div className="flex items-baseline gap-2 mt-2">
              <span className={cn(
                "text-3xl font-bold transition-all duration-300",
                isUpdating && "scale-110"
              )}>
                {value}
              </span>
              {unit && <span className="text-lg text-gray-600">{unit}</span>}
              {trend && (
                <span className={cn(
                  "text-lg font-bold",
                  trend === 'up' ? "text-green-600" : 
                  trend === 'down' ? "text-red-600" : 
                  "text-gray-600"
                )}>
                  {getTrendIcon()}
                </span>
              )}
            </div>

            {description && (
              <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}

            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs">
                {formatTime(lastUpdate)}
              </Badge>
              {status !== 'active' && (
                <Badge 
                  variant={status === 'critical' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {status === 'critical' ? '위험' : status === 'warning' ? '주의' : '대기'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Update Animation */}
      {isUpdating && (
        <div className="absolute inset-0 bg-blue-400 opacity-10 animate-pulse" />
      )}
    </Card>
  );
}