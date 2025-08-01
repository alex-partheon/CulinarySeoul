import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Store,
  Users,
  ShoppingBag,
  Star,
  ArrowRight,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BrandPerformance {
  id: string;
  name: string;
  logo?: string;
  color: string;
  stores: number;
  employees: number;
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    today: number;
    change: number;
  };
  rating: number;
  health: {
    score: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
  };
  topMetric?: {
    label: string;
    value: string;
  };
}

interface BrandPerformanceGridProps {
  brands: BrandPerformance[];
  loading?: boolean;
  onBrandClick?: (brandId: string) => void;
  onViewDetails?: (brandId: string) => void;
}

export function BrandPerformanceGrid({
  brands,
  loading = false,
  onBrandClick,
  onViewDetails
}: BrandPerformanceGridProps) {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'rating'>('revenue');

  const getHealthStatusColor = (status: BrandPerformance['health']['status']) => {
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

  const getHealthStatusText = (status: BrandPerformance['health']['status']) => {
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₩${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `₩${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `₩${(value / 1000).toFixed(0)}K`;
    }
    return `₩${value.toLocaleString('ko-KR')}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Store className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">등록된 브랜드가 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">브랜드별 성과</h3>
        <div className="flex items-center gap-2">
          <Badge
            variant={selectedMetric === 'revenue' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedMetric('revenue')}
          >
            매출
          </Badge>
          <Badge
            variant={selectedMetric === 'orders' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedMetric('orders')}
          >
            주문
          </Badge>
          <Badge
            variant={selectedMetric === 'rating' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedMetric('rating')}
          >
            평점
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className={cn(
              "hover:shadow-lg transition-all duration-200 cursor-pointer",
              "border-2 hover:border-gray-300"
            )}
            onClick={() => onBrandClick?.(brand.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10" style={{ backgroundColor: brand.color + '20' }}>
                    <AvatarFallback style={{ color: brand.color }}>
                      {brand.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base font-semibold">{brand.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Store className="h-3 w-3" />
                        {brand.stores}개 매장
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {brand.employees}명
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails?.(brand.id)}>
                      상세 보기
                    </DropdownMenuItem>
                    <DropdownMenuItem>리포트 생성</DropdownMenuItem>
                    <DropdownMenuItem>설정</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">브랜드 건강도</span>
                <div className="flex items-center gap-2">
                  <Progress value={brand.health.score} className="w-20 h-2" />
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getHealthStatusColor(brand.health.status))}
                  >
                    {getHealthStatusText(brand.health.status)}
                  </Badge>
                </div>
              </div>

              {/* Selected Metric Display */}
              <div className="pt-2 border-t">
                {selectedMetric === 'revenue' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">오늘 매출</span>
                      <span className="text-lg font-bold">
                        {formatCurrency(brand.revenue.current)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">전일 대비</span>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          brand.revenue.change > 0 
                            ? "text-green-600 bg-green-50" 
                            : "text-red-600 bg-red-50"
                        )}
                      >
                        {brand.revenue.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {brand.revenue.change > 0 ? '+' : ''}{brand.revenue.change}%
                      </Badge>
                    </div>
                  </div>
                )}

                {selectedMetric === 'orders' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">오늘 주문</span>
                      <span className="text-lg font-bold flex items-center gap-1">
                        <ShoppingBag className="h-4 w-4 text-gray-500" />
                        {brand.orders.today}건
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">전일 대비</span>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          brand.orders.change > 0 
                            ? "text-green-600 bg-green-50" 
                            : "text-red-600 bg-red-50"
                        )}
                      >
                        {brand.orders.change > 0 ? '+' : ''}{brand.orders.change}%
                      </Badge>
                    </div>
                  </div>
                )}

                {selectedMetric === 'rating' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">고객 평점</span>
                      <span className="text-lg font-bold flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {brand.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "h-3 w-3",
                            star <= brand.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({Math.floor(Math.random() * 1000) + 100} 리뷰)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Metric or Alert */}
              {brand.topMetric && (
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{brand.topMetric.label}</span>
                    <span className="font-medium">{brand.topMetric.value}</span>
                  </div>
                </div>
              )}

              {brand.health.status === 'warning' || brand.health.status === 'critical' ? (
                <div className={cn(
                  "flex items-center gap-2 p-2 rounded-lg text-xs",
                  brand.health.status === 'warning' ? "bg-yellow-50" : "bg-red-50"
                )}>
                  <AlertCircle className={cn(
                    "h-3 w-3",
                    brand.health.status === 'warning' ? "text-yellow-600" : "text-red-600"
                  )} />
                  <span className={brand.health.status === 'warning' ? "text-yellow-700" : "text-red-700"}>
                    {brand.health.status === 'warning' ? "주의가 필요합니다" : "즉시 확인이 필요합니다"}
                  </span>
                </div>
              ) : null}

              {/* View Details Link */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(brand.id);
                }}
              >
                브랜드 상세 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}