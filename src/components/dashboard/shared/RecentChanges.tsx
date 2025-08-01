import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Plus,
  Edit3,
  Trash2,
  Settings,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  ArrowRight,
  Clock,
  MoreHorizontal
} from 'lucide-react';

export interface Change {
  id: string;
  type: 'create' | 'update' | 'delete' | 'config';
  category: 'inventory' | 'sales' | 'staff' | 'menu' | 'system' | 'marketing';
  title: string;
  description: string;
  user: {
    name: string;
    avatar?: string;
    role: string;
  };
  timestamp: Date;
  metadata?: {
    before?: string | number;
    after?: string | number;
    count?: number;
    location?: string;
  };
}

interface RecentChangesProps {
  changes: Change[];
  title?: string;
  className?: string;
  maxHeight?: string;
  onViewDetails?: (change: Change) => void;
  onViewAll?: () => void;
}

export function RecentChanges({
  changes,
  title = "최근 변경사항",
  className,
  maxHeight = "400px",
  onViewDetails,
  onViewAll
}: RecentChangesProps) {
  const getChangeIcon = (type: Change['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'update':
        return <Edit3 className="h-4 w-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case 'config':
        return <Settings className="h-4 w-4 text-purple-600" />;
    }
  };

  const getCategoryIcon = (category: Change['category']) => {
    switch (category) {
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'sales':
        return <ShoppingBag className="h-4 w-4" />;
      case 'staff':
        return <Users className="h-4 w-4" />;
      case 'menu':
        return <TrendingUp className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'marketing':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: Change['category']) => {
    switch (category) {
      case 'inventory':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'sales':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'staff':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'menu':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'system':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'marketing':
        return 'bg-pink-100 text-pink-700 border-pink-200';
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
    
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryName = (category: Change['category']) => {
    const names = {
      inventory: '재고관리',
      sales: '매출관리',
      staff: '직원관리',
      menu: '메뉴관리',
      system: '시스템',
      marketing: '마케팅'
    };
    return names[category] || category;
  };

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            {title}
          </CardTitle>
          {onViewAll && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-xs"
            >
              전체 이력
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-3 pb-3">
        <ScrollArea className="w-full" style={{ height: maxHeight }}>
          <div className="space-y-3 pr-4">
            {changes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">최근 변경사항이 없습니다</p>
              </div>
            ) : (
              changes.map((change) => (
                <div
                  key={change.id}
                  className={cn(
                    "relative p-3 rounded-lg border bg-white hover:bg-gray-50",
                    "transition-all duration-200 cursor-pointer group",
                    "hover:shadow-sm"
                  )}
                  onClick={() => onViewDetails?.(change)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={change.user.avatar} />
                        <AvatarFallback className="text-xs bg-gray-100">
                          {change.user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {getChangeIcon(change.type)}
                              <h4 className="text-sm font-medium text-gray-900">
                                {change.title}
                              </h4>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-2 py-0 border",
                                getCategoryColor(change.category)
                              )}
                            >
                              <span className="flex items-center gap-1">
                                {getCategoryIcon(change.category)}
                                {getCategoryName(change.category)}
                              </span>
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-600">
                            {change.description}
                          </p>
                          
                          {change.metadata && (
                            <div className="flex items-center gap-3 mt-2">
                              {change.metadata.before && change.metadata.after && (
                                <span className="text-xs text-gray-500">
                                  <span className="line-through">{change.metadata.before}</span>
                                  {' → '}
                                  <span className="font-medium text-gray-700">{change.metadata.after}</span>
                                </span>
                              )}
                              {change.metadata.count && (
                                <Badge variant="secondary" className="text-xs px-2 py-0">
                                  {change.metadata.count}개
                                </Badge>
                              )}
                              {change.metadata.location && (
                                <span className="text-xs text-gray-500">
                                  📍 {change.metadata.location}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-500">
                              {change.user.name} · {change.user.role}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(change.timestamp)}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}