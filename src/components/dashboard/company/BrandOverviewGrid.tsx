import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  ShoppingBag,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2
} from 'lucide-react';
import { BrandStatusCard } from './BrandStatusCard';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Skeleton } from '../../ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { cn } from '../../../lib/utils';
import type { Brand } from '../../../domains/brand/types';

interface BrandMetrics {
  todaySales: number;
  activeStores: number;
  totalStores: number;
  lowStockAlerts: number;
  orderCount: number;
}

interface BrandWithMetrics {
  brand: Brand;
  status: 'online' | 'offline' | 'issues';
  metrics: BrandMetrics;
  logo?: React.ReactNode;
}

interface BrandOverviewGridProps {
  brands: BrandWithMetrics[];
  isLoading?: boolean;
  className?: string;
}

type SortField = 'name' | 'sales' | 'stores' | 'alerts' | 'orders';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'all' | 'online' | 'offline' | 'issues';

export const BrandOverviewGrid: React.FC<BrandOverviewGridProps> = ({
  brands,
  isLoading = false,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('sales');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  // Filter and sort brands
  const processedBrands = useMemo(() => {
    let filtered = brands;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'name':
          aValue = a.brand.name;
          bValue = b.brand.name;
          break;
        case 'sales':
          aValue = a.metrics.todaySales;
          bValue = b.metrics.todaySales;
          break;
        case 'stores':
          aValue = a.metrics.activeStores;
          bValue = b.metrics.activeStores;
          break;
        case 'alerts':
          aValue = a.metrics.lowStockAlerts;
          bValue = b.metrics.lowStockAlerts;
          break;
        case 'orders':
          aValue = a.metrics.orderCount;
          bValue = b.metrics.orderCount;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [brands, searchQuery, sortField, sortOrder, filterStatus]);

  // Calculate totals
  const totals = useMemo(() => {
    return processedBrands.reduce(
      (acc, item) => ({
        sales: acc.sales + item.metrics.todaySales,
        activeStores: acc.activeStores + item.metrics.activeStores,
        totalStores: acc.totalStores + item.metrics.totalStores,
        alerts: acc.alerts + item.metrics.lowStockAlerts,
        orders: acc.orders + item.metrics.orderCount,
      }),
      { sales: 0, activeStores: 0, totalStores: 0, alerts: 0, orders: 0 }
    );
  }, [processedBrands]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Loading skeleton for controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Loading skeleton for grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="브랜드 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
            <SelectTrigger className="w-32">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="online">정상운영</SelectItem>
              <SelectItem value="offline">오프라인</SelectItem>
              <SelectItem value="issues">문제발생</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">이름순</SelectItem>
              <SelectItem value="sales">매출순</SelectItem>
              <SelectItem value="stores">매장순</SelectItem>
              <SelectItem value="alerts">경고순</SelectItem>
              <SelectItem value="orders">주문순</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSort(sortField)}
          >
            <SortIcon field={sortField} />
          </Button>
        </div>
      </div>

      {/* Summary row */}
      {processedBrands.length > 0 && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h3 className="text-sm font-medium">전체 요약</h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">총 매출:</span>
                <span className="font-semibold">{formatCurrency(totals.sales)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">운영 매장:</span>
                <span className="font-semibold">{totals.activeStores}/{totals.totalStores}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">재고 경고:</span>
                <span className="font-semibold">{formatNumber(totals.alerts)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">총 주문:</span>
                <span className="font-semibold">{formatNumber(totals.orders)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {processedBrands.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {processedBrands.map((item) => (
            <BrandStatusCard
              key={item.brand.id}
              brand={item.brand}
              brandLogo={item.logo}
              status={item.status}
              metrics={item.metrics}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/10 p-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">브랜드가 없습니다</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {searchQuery || filterStatus !== 'all'
              ? '검색 조건에 맞는 브랜드가 없습니다. 다른 조건으로 검색해보세요.'
              : '아직 등록된 브랜드가 없습니다. 새 브랜드를 추가해보세요.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BrandOverviewGrid;