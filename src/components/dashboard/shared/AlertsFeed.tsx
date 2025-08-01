import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
  Bell,
  BellOff,
  Filter,
  X
} from 'lucide-react';

export interface Alert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  category: string;
  read?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface AlertsFeedProps {
  alerts: Alert[];
  title?: string;
  className?: string;
  maxHeight?: string;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onViewAll?: () => void;
}

export function AlertsFeed({
  alerts,
  title = "알림 센터",
  className,
  maxHeight = "400px",
  onMarkAsRead,
  onDismiss,
  onViewAll
}: AlertsFeedProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', ...new Set(alerts.map(alert => alert.category))];
  
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread' && alert.read) return false;
    if (categoryFilter !== 'all' && alert.category !== categoryFilter) return false;
    return true;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 hover:bg-green-100 border-green-200';
      case 'warning':
        return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200';
      case 'error':
        return 'bg-red-50 hover:bg-red-100 border-red-200';
      case 'info':
        return 'bg-blue-50 hover:bg-blue-100 border-blue-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleDateString('ko-KR');
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-xs"
            >
              전체 보기
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
          <div className="flex items-center justify-between mb-3">
            <TabsList className="grid w-[200px] grid-cols-2 h-8">
              <TabsTrigger value="all" className="text-xs">전체</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                읽지 않음 ({unreadCount})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? '모든 카테고리' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TabsContent value={filter} className="mt-0">
            <ScrollArea className="w-full" style={{ height: maxHeight }}>
              <div className="space-y-2 pr-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BellOff className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">알림이 없습니다</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "relative p-3 rounded-lg border transition-all duration-200 group",
                        getAlertBgColor(alert.type),
                        !alert.read && "font-medium"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className={cn(
                                "text-sm",
                                !alert.read && "font-semibold"
                              )}>
                                {alert.title}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs px-2 py-0">
                                  {alert.category}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimestamp(alert.timestamp)}
                                </span>
                              </div>
                              {alert.actionLabel && alert.onAction && (
                                <Button
                                  size="sm"
                                  variant="link"
                                  className="h-auto p-0 mt-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    alert.onAction?.();
                                  }}
                                >
                                  {alert.actionLabel} →
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!alert.read && onMarkAsRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onMarkAsRead(alert.id);
                                  }}
                                  title="읽음으로 표시"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {onDismiss && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDismiss(alert.id);
                                  }}
                                  title="삭제"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}