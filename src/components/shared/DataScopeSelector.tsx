import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Store, 
  Globe,
  ChevronRight,
  Database,
  Filter
} from 'lucide-react'
import { useDataScope, DataScopeLevel } from '@/contexts/DataScopeContext'

interface DataScopeSelectorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact'
  dashboardType: 'company' | 'brand'
}

// Mock data - should come from API/context
const mockBrands = [
  { id: 'brand_1', name: '밀랍', code: 'MILLAB', status: 'active', storeCount: 3 },
  { id: 'brand_2', name: '카페 밀랍', code: 'CAFE_MILLAB', status: 'active', storeCount: 2 },
  { id: 'brand_3', name: '베이커리 밀랍', code: 'BAKERY_MILLAB', status: 'active', storeCount: 1 },
]

const mockStores = [
  { id: 'store_1', name: '성수점', code: 'SEONGSU', brandId: 'brand_1', status: 'active' },
  { id: 'store_2', name: '홍대점', code: 'HONGDAE', brandId: 'brand_1', status: 'active' },
  { id: 'store_3', name: '강남점', code: 'GANGNAM', brandId: 'brand_1', status: 'maintenance' },
  { id: 'store_4', name: '카페 성수점', code: 'CAFE_SEONGSU', brandId: 'brand_2', status: 'active' },
  { id: 'store_5', name: '카페 홍대점', code: 'CAFE_HONGDAE', brandId: 'brand_2', status: 'active' },
  { id: 'store_6', name: '베이커리 성수점', code: 'BAKERY_SEONGSU', brandId: 'brand_3', status: 'active' },
]

export function DataScopeSelector({
  className,
  size = 'md',
  variant = 'default',
  dashboardType
}: DataScopeSelectorProps) {
  const {
    scopeLevel,
    selectedBrand,
    selectedStore,
    setScopeLevel,
    setSelectedBrand,
    setSelectedStore,
    canAccessLevel,
    getAccessibleBrands,
    getAccessibleStores,
    getScopeDisplayName,
    getScopeBreadcrumb
  } = useDataScope()

  const accessibleBrands = getAccessibleBrands()
  const accessibleStores = getAccessibleStores(selectedBrand || undefined)

  const handleScopeChange = (level: DataScopeLevel) => {
    setScopeLevel(level)
    if (level === 'company') {
      setSelectedBrand(null)
      setSelectedStore(null)
    } else if (level === 'brand' && selectedStore) {
      setSelectedStore(null)
    }
  }

  const handleBrandChange = (brandId: string | null) => {
    setSelectedBrand(brandId)
    setSelectedStore(null)
    if (brandId) {
      setScopeLevel('brand')
    }
  }

  const handleStoreChange = (storeId: string | null) => {
    setSelectedStore(storeId)
    if (storeId) {
      setScopeLevel('store')
      // Find and set the brand for this store
      const store = mockStores.find(s => s.id === storeId)
      if (store && store.brandId !== selectedBrand) {
        setSelectedBrand(store.brandId)
      }
    }
  }

  const selectedBrandData = mockBrands.find(b => b.id === selectedBrand)
  const selectedStoreData = mockStores.find(s => s.id === selectedStore)
  const availableStores = selectedBrand 
    ? mockStores.filter(s => s.brandId === selectedBrand && accessibleStores.includes(s.id))
    : mockStores.filter(s => accessibleStores.includes(s.id))

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base'
  }

  if (variant === 'compact') {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Database className="h-4 w-4" />
          <span className="hidden sm:inline">데이터 범위:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Scope Level Buttons */}
          <div className="flex items-center rounded-lg border bg-background p-0.5">
            {dashboardType === 'company' && canAccessLevel('company') && (
              <Button
                variant={scopeLevel === 'company' && !selectedBrand && !selectedStore ? "default" : "ghost"}
                size="sm"
                onClick={() => handleScopeChange('company')}
                className="h-7 px-2 text-xs"
              >
                <Globe className="h-3 w-3 mr-1" />
                전체
              </Button>
            )}
            {canAccessLevel('brand') && (
              <Button
                variant={scopeLevel === 'brand' || selectedBrand ? "default" : "ghost"}
                size="sm"
                onClick={() => handleScopeChange('brand')}
                className="h-7 px-2 text-xs"
              >
                <Building2 className="h-3 w-3 mr-1" />
                브랜드
              </Button>
            )}
            {canAccessLevel('store') && (
              <Button
                variant={scopeLevel === 'store' || selectedStore ? "default" : "ghost"}
                size="sm"
                onClick={() => handleScopeChange('store')}
                className="h-7 px-2 text-xs"
              >
                <Store className="h-3 w-3 mr-1" />
                매장
              </Button>
            )}
          </div>

          {/* Brand/Store Selectors */}
          {(scopeLevel === 'brand' || scopeLevel === 'store') && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedBrand || ''}
                onValueChange={handleBrandChange}
              >
                <SelectTrigger className="h-7 min-w-[100px] text-xs">
                  <SelectValue placeholder="브랜드 선택">
                    {selectedBrandData?.name || '브랜드 선택'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {accessibleBrands.map((brandId) => {
                    const brand = mockBrands.find(b => b.id === brandId)
                    if (!brand) return null
                    return (
                      <SelectItem key={brand.id} value={brand.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          <span>{brand.name}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {brand.storeCount}개
                          </Badge>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </>
          )}

          {scopeLevel === 'store' && selectedBrand && (
            <>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedStore || ''}
                onValueChange={handleStoreChange}
              >
                <SelectTrigger className="h-7 min-w-[100px] text-xs">
                  <SelectValue placeholder="매장 선택">
                    {selectedStoreData?.name || '매장 선택'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className="flex items-center gap-2">
                        <Store className="h-3 w-3" />
                        <span>{store.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>
    )
  }

  // Default variant - more prominent display
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold">데이터 범위 선택</h3>
        </div>
        <Badge variant="outline" className="text-xs">
          현재: {getScopeDisplayName()}
        </Badge>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
        {/* Scope Level Selection */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">범위 수준</span>
          <div className="flex items-center gap-1">
            {dashboardType === 'company' && canAccessLevel('company') && (
              <Button
                variant={scopeLevel === 'company' && !selectedBrand && !selectedStore ? "default" : "outline"}
                size={size}
                onClick={() => handleScopeChange('company')}
                className={cn("gap-2", sizeClasses[size])}
              >
                <Globe className="h-4 w-4" />
                전체
              </Button>
            )}
            {canAccessLevel('brand') && (
              <Button
                variant={scopeLevel === 'brand' ? "default" : "outline"}
                size={size}
                onClick={() => handleScopeChange('brand')}
                className={cn("gap-2", sizeClasses[size])}
                disabled={dashboardType === 'brand' && !canAccessLevel('company')}
              >
                <Building2 className="h-4 w-4" />
                브랜드별
              </Button>
            )}
            {canAccessLevel('store') && (
              <Button
                variant={scopeLevel === 'store' ? "default" : "outline"}
                size={size}
                onClick={() => handleScopeChange('store')}
                className={cn("gap-2", sizeClasses[size])}
              >
                <Store className="h-4 w-4" />
                매장별
              </Button>
            )}
          </div>
        </div>

        {(scopeLevel === 'brand' || scopeLevel === 'store') && (
          <>
            <Separator orientation="vertical" className="h-12" />
            
            {/* Brand Selection */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">브랜드</span>
              <Select
                value={selectedBrand || 'all'}
                onValueChange={(value) => handleBrandChange(value === 'all' ? null : value)}
              >
                <SelectTrigger className={cn("min-w-[140px]", sizeClasses[size])}>
                  <SelectValue>
                    {selectedBrandData ? selectedBrandData.name : '전체 브랜드'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {dashboardType === 'company' && (
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>전체 브랜드</span>
                      </div>
                    </SelectItem>
                  )}
                  {accessibleBrands.map((brandId) => {
                    const brand = mockBrands.find(b => b.id === brandId)
                    if (!brand) return null
                    return (
                      <SelectItem key={brand.id} value={brand.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{brand.name}</span>
                          <Badge variant="secondary" className="ml-auto">
                            {brand.storeCount}개 매장
                          </Badge>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {scopeLevel === 'store' && (
          <>
            <Separator orientation="vertical" className="h-12" />
            
            {/* Store Selection */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">매장</span>
              <Select
                value={selectedStore || 'all'}
                onValueChange={(value) => handleStoreChange(value === 'all' ? null : value)}
                disabled={!selectedBrand && dashboardType === 'company'}
              >
                <SelectTrigger className={cn("min-w-[140px]", sizeClasses[size])}>
                  <SelectValue>
                    {selectedStoreData ? selectedStoreData.name : 
                     selectedBrand || dashboardType === 'brand' ? '전체 매장' : '브랜드 먼저 선택'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {(selectedBrand || dashboardType === 'brand') && (
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span>전체 매장</span>
                      </div>
                    </SelectItem>
                  )}
                  {availableStores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4" />
                        <span>{store.name}</span>
                        {store.status !== 'active' && (
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "ml-auto text-xs",
                              store.status === 'maintenance' 
                                ? "text-yellow-600 border-yellow-600" 
                                : "text-red-600 border-red-600"
                            )}
                          >
                            {store.status === 'maintenance' ? '점검중' : '휴업'}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {/* Scope Breadcrumb */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>현재 데이터 범위:</span>
        {getScopeBreadcrumb().map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-3 w-3" />}
            <span className={cn(
              "font-medium",
              index === getScopeBreadcrumb().length - 1 && "text-foreground"
            )}>
              {crumb.name}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default DataScopeSelector