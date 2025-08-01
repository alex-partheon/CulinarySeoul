import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Plus,
  ArrowUpDown,
  Store,
  MapPin,
  CheckSquare,
  Square,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { StoreMetricsCard } from './StoreMetricsCard'
import { cn } from '@/lib/utils'
import type { Store } from '@/domains/store/types'

interface StoreManagementPanelProps {
  stores: Store[]
  isLoading?: boolean
  onAddStore?: () => void
  onEditStore?: (store: Store) => void
  onToggleStoreStatus?: (store: Store) => void
  onViewStoreDetails?: (store: Store) => void
  className?: string
}

type ViewMode = 'grid' | 'list'
type SortOption = 'name' | 'sales' | 'created' | 'status'
type FilterStatus = 'all' | 'active' | 'inactive'
type FilterType = 'all' | 'direct' | 'franchise' | 'partner'

// Mock metrics data - in real app, this would come from API
const mockStoreMetrics: Record<string, any> = {
  'store_1': {
    todaySales: 3850000,
    salesChange: 12,
    inventoryStatus: 'good',
    inventoryLevel: 85,
    activeOrders: 8,
    staffCount: 4,
    isOnline: true
  },
  'store_2': {
    todaySales: 2920000,
    salesChange: -5,
    inventoryStatus: 'low',
    inventoryLevel: 35,
    activeOrders: 5,
    staffCount: 3,
    isOnline: true
  },
  'store_3': {
    todaySales: 0,
    salesChange: 0,
    inventoryStatus: 'critical',
    inventoryLevel: 15,
    activeOrders: 0,
    staffCount: 0,
    isOnline: false
  }
}

export function StoreManagementPanel({
  stores,
  isLoading = false,
  onAddStore,
  onEditStore,
  onToggleStoreStatus,
  onViewStoreDetails,
  className
}: StoreManagementPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [selectedStores, setSelectedStores] = useState<Set<string>>(new Set())

  // Filter and sort stores
  const filteredAndSortedStores = useMemo(() => {
    let filtered = stores.filter(store => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = store.name.toLowerCase().includes(query)
        const matchesCode = store.code.toLowerCase().includes(query)
        const matchesAddress = store.address?.city?.toLowerCase().includes(query) ||
                              store.address?.street?.toLowerCase().includes(query)
        if (!matchesName && !matchesCode && !matchesAddress) return false
      }

      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !store.is_active) return false
        if (filterStatus === 'inactive' && store.is_active) return false
      }

      // Type filter
      if (filterType !== 'all' && store.store_type !== filterType) return false

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'sales':
          // In real app, would sort by actual sales data
          const salesA = mockStoreMetrics[a.id]?.todaySales || 0
          const salesB = mockStoreMetrics[b.id]?.todaySales || 0
          return salesB - salesA
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'status':
          return (b.is_active ? 1 : 0) - (a.is_active ? 1 : 0)
        default:
          return 0
      }
    })

    return filtered
  }, [stores, searchQuery, sortBy, filterStatus, filterType])

  const handleSelectAll = () => {
    if (selectedStores.size === filteredAndSortedStores.length) {
      setSelectedStores(new Set())
    } else {
      setSelectedStores(new Set(filteredAndSortedStores.map(s => s.id)))
    }
  }

  const handleSelectStore = (storeId: string) => {
    const newSelected = new Set(selectedStores)
    if (newSelected.has(storeId)) {
      newSelected.delete(storeId)
    } else {
      newSelected.add(storeId)
    }
    setSelectedStores(newSelected)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for ${selectedStores.size} stores`)
    // Implement bulk actions
    setSelectedStores(new Set())
  }

  const getStoreTypeLabel = (type: string) => {
    switch (type) {
      case 'direct': return '직영'
      case 'franchise': return '가맹'
      case 'partner': return '파트너'
      default: return type
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>매장 관리</CardTitle>
          <Button onClick={onAddStore} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            새 매장 추가
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="매장명, 코드, 주소로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="상태" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="direct">직영</SelectItem>
                <SelectItem value="franchise">가맹</SelectItem>
                <SelectItem value="partner">파트너</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[120px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">이름순</SelectItem>
                <SelectItem value="sales">매출순</SelectItem>
                <SelectItem value="created">등록순</SelectItem>
                <SelectItem value="status">상태순</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStores.size > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedStores.size === filteredAndSortedStores.length ? (
                  <CheckSquare className="h-4 w-4 mr-2" />
                ) : (
                  <Square className="h-4 w-4 mr-2" />
                )}
                전체 선택
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedStores.size}개 선택됨
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  일괄 작업
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>일괄 작업</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                  선택 항목 활성화
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                  선택 항목 비활성화
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                  선택 항목 내보내기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Store List */}
        {filteredAndSortedStores.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? '검색 결과가 없습니다'
                : '등록된 매장이 없습니다'}
            </p>
            {!searchQuery && filterStatus === 'all' && filterType === 'all' && (
              <Button variant="outline" size="sm" className="mt-3" onClick={onAddStore}>
                <Plus className="h-4 w-4 mr-2" />
                첫 매장 추가하기
              </Button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedStores.map(store => (
              <StoreMetricsCard
                key={store.id}
                store={store}
                metrics={mockStoreMetrics[store.id]}
                onViewDetails={() => onViewStoreDetails?.(store)}
                onEdit={() => onEditStore?.(store)}
                onToggleStatus={() => onToggleStoreStatus?.(store)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAndSortedStores.map(store => (
              <div
                key={store.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleSelectStore(store.id)}
                  >
                    {selectedStores.has(store.id) ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{store.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {getStoreTypeLabel(store.store_type)}
                      </Badge>
                      {!store.is_active && (
                        <Badge variant="secondary" className="text-xs">
                          비활성
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {store.address?.city} {store.address?.street}
                      </span>
                      <span>코드: {store.code}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewStoreDetails?.(store)}
                  >
                    상세 보기
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditStore?.(store)}>
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleStoreStatus?.(store)}>
                        {store.is_active ? '비활성화' : '활성화'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
          <span>
            총 {filteredAndSortedStores.length}개 매장
            {searchQuery && ` (검색 결과)`}
          </span>
          <span>
            활성: {filteredAndSortedStores.filter(s => s.is_active).length}개 | 
            비활성: {filteredAndSortedStores.filter(s => !s.is_active).length}개
          </span>
        </div>
      </CardContent>
    </Card>
  )
}