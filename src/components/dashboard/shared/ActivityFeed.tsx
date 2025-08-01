import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Clock,
  ChevronDown,
  Pause,
  Play
} from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'order' | 'staff' | 'inventory' | 'alert' | 'system' | 'customer';
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
  value?: string | number;
  status?: 'success' | 'warning' | 'error' | 'info';
  isNew?: boolean;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  onActivityClick?: (activity: ActivityItem) => void;
  maxHeight?: string;
  autoScroll?: boolean;
  showFilters?: boolean;
  title?: string;
  updateInterval?: number;
}

export function ActivityFeed({
  activities,
  onActivityClick,
  maxHeight = '400px',
  autoScroll = true,
  showFilters = true,
  title = '실시간 활동',
  updateInterval = 5000
}: ActivityFeedProps) {
  const [filteredActivities, setFilteredActivities] = useState(activities);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    setFilteredActivities(
      selectedFilter === 'all' 
        ? activities 
        : activities.filter(a => a.type === selectedFilter)
    );
    
    // Count new activities
    const newItems = activities.filter(a => a.isNew).length;
    setNewCount(newItems);
  }, [activities, selectedFilter]);

  useEffect(() => {
    if (autoScroll && !isPaused && isAtBottom) {
      scrollAreaRef.current?.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [filteredActivities, autoScroll, isPaused, isAtBottom]);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'staff':
        return Users;
      case 'inventory':
        return Package;
      case 'alert':
        return AlertTriangle;
      case 'customer':
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: ActivityItem['type'], status?: ActivityItem['status']) => {
    if (status === 'error') return 'text-red-600';
    if (status === 'warning') return 'text-yellow-600';
    
    switch (type) {
      case 'order':
        return 'text-blue-600';
      case 'staff':
        return 'text-purple-600';
      case 'inventory':
        return 'text-orange-600';
      case 'alert':
        return 'text-red-600';
      case 'customer':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const filters = [
    { value: 'all', label: '전체' },
    { value: 'order', label: '주문' },
    { value: 'staff', label: '직원' },
    { value: 'inventory', label: '재고' },
    { value: 'alert', label: '알림' },
    { value: 'customer', label: '고객' }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const threshold = 50;
    const isBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    setIsAtBottom(isBottom);
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{title}</CardTitle>
            {newCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {newCount} NEW
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isAtBottom && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  scrollAreaRef.current?.scrollTo({
                    top: scrollAreaRef.current.scrollHeight,
                    behavior: 'smooth'
                  });
                }}
                className="h-7 px-2"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="h-7 w-7 p-0"
            >
              {isPaused ? (
                <Play className="h-3 w-3" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <div className="flex items-center gap-1 mt-3">
            {filters.map((filter) => (
              <Badge
                key={filter.value}
                variant={selectedFilter === filter.value ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedFilter(filter.value)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea 
          ref={scrollAreaRef}
          className="w-full" 
          style={{ height: maxHeight }}
          onScroll={handleScroll}
        >
          <div className="p-4 space-y-3">
            {filteredActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                활동 내역이 없습니다
              </p>
            ) : (
              filteredActivities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all duration-200",
                      "hover:bg-gray-50 cursor-pointer",
                      activity.isNew && "bg-blue-50 border border-blue-200"
                    )}
                    onClick={() => onActivityClick?.(activity)}
                  >
                    <div className={cn(
                      "p-2 rounded-full",
                      activity.status === 'error' ? "bg-red-100" :
                      activity.status === 'warning' ? "bg-yellow-100" :
                      "bg-gray-100"
                    )}>
                      <Icon className={cn("h-4 w-4", getActivityColor(activity.type, activity.status))} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {activity.description}
                          </p>
                          {(activity.location || activity.value) && (
                            <div className="flex items-center gap-3 mt-1">
                              {activity.location && (
                                <span className="text-xs text-gray-500">
                                  📍 {activity.location}
                                </span>
                              )}
                              {activity.value && (
                                <span className="text-xs font-medium text-gray-700">
                                  {activity.value}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Live Update Indicator */}
      {!isPaused && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="text-xs flex items-center gap-1 animate-pulse">
            <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            실시간 업데이트 중
          </Badge>
        </div>
      )}
    </Card>
  );
}