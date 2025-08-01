import React from 'react';
import { Link } from 'react-router';
import { 
  Building2, 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  ShoppingBag,
  MoreVertical,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { cn } from '../../../lib/utils';
import type { Brand } from '../../../domains/brand/types';

interface BrandStatusCardProps {
  brand: Brand;
  brandLogo?: React.ReactNode;
  status: 'online' | 'offline' | 'issues';
  metrics: {
    todaySales: number;
    activeStores: number;
    totalStores: number;
    lowStockAlerts: number;
    orderCount: number;
  };
  isLoading?: boolean;
}

const statusConfig = {
  online: {
    label: '정상운영',
    className: 'bg-green-500',
    pulseClassName: 'bg-green-400',
  },
  offline: {
    label: '오프라인',
    className: 'bg-gray-500',
    pulseClassName: 'bg-gray-400',
  },
  issues: {
    label: '문제발생',
    className: 'bg-yellow-500',
    pulseClassName: 'bg-yellow-400',
  },
};

export const BrandStatusCard: React.FC<BrandStatusCardProps> = ({
  brand,
  brandLogo,
  status,
  metrics,
  isLoading = false,
}) => {
  const config = statusConfig[status];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            config.pulseClassName
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            config.className
          )} />
        </div>
        <span className="text-xs text-muted-foreground">{config.label}</span>
      </div>

      <CardContent className="p-6">
        {/* Brand header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
            {brandLogo || <Building2 className="h-8 w-8 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{brand.name}</h3>
            <p className="text-sm text-muted-foreground">{brand.code}</p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Today's sales */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>오늘 매출</span>
            </div>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted" />
              ) : (
                formatCurrency(metrics.todaySales)
              )}
            </p>
          </div>

          {/* Active stores */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              <span>운영 매장</span>
            </div>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <span className="inline-block h-6 w-16 animate-pulse rounded bg-muted" />
              ) : (
                `${metrics.activeStores}/${metrics.totalStores}`
              )}
            </p>
          </div>

          {/* Low stock alerts */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>재고 경고</span>
            </div>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <span className="inline-block h-6 w-12 animate-pulse rounded bg-muted" />
              ) : (
                <>
                  {formatNumber(metrics.lowStockAlerts)}
                  {metrics.lowStockAlerts > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      주의
                    </Badge>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Order count */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4" />
              <span>오늘 주문</span>
            </div>
            <p className="text-lg font-semibold">
              {isLoading ? (
                <span className="inline-block h-6 w-12 animate-pulse rounded bg-muted" />
              ) : (
                formatNumber(metrics.orderCount)
              )}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Link to={`/brand/${brand.code}/dashboard`}>
              <Eye className="mr-2 h-4 w-4" />
              상세보기
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Link to={`/company/brands/${brand.id}/manage`}>
              <Settings className="mr-2 h-4 w-4" />
              관리
            </Link>
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">더보기</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/company/brands/${brand.id}/reports`}>
                <BarChart3 className="mr-2 h-4 w-4" />
                리포트 보기
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default BrandStatusCard;