import React, { useState, useEffect } from 'react'
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
import { 
  Building2, 
  Store, 
  ChevronDown,
  Globe
} from 'lucide-react'
import { useScopeSelector } from '@/contexts/DataScopeContext'

interface Brand {
  id: string
  name: string
  code: string
  status: 'active' | 'inactive'
  storeCount: number
}

interface Store {
  id: string
  name: string
  code: string
  brandId: string
  status: 'active' | 'inactive' | 'maintenance'
}

interface BrandStoreSelectorProps {
  selectedBrand?: string | null
  selectedStore?: string | null
  onBrandChange: (brandId: string | null) => void
  onStoreChange: (storeId: string | null) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
}

// Mock data - should come from API/context
const mockBrands: Brand[] = [
  { id: 'brand_1', name: '밀랍', code: 'MILLAB', status: 'active', storeCount: 3 },
  { id: 'brand_2', name: '카페 밀랍', code: 'CAFE_MILLAB', status: 'active', storeCount: 2 },
  { id: 'brand_3', name: '베이커리 밀랍', code: 'BAKERY_MILLAB', status: 'active', storeCount: 1 },
]

const mockStores: Store[] = [
  { id: 'store_1', name: '성수점', code: 'SEONGSU', brandId: 'brand_1', status: 'active' },
  { id: 'store_2', name: '홍대점', code: 'HONGDAE', brandId: 'brand_1', status: 'active' },
  { id: 'store_3', name: '강남점', code: 'GANGNAM', brandId: 'brand_1', status: 'maintenance' },
  { id: 'store_4', name: '카페 성수점', code: 'CAFE_SEONGSU', brandId: 'brand_2', status: 'active' },
  { id: 'store_5', name: '카페 홍대점', code: 'CAFE_HONGDAE', brandId: 'brand_2', status: 'active' },
  { id: 'store_6', name: '베이커리 성수점', code: 'BAKERY_SEONGSU', brandId: 'brand_3', status: 'active' },
]

export function BrandStoreSelector({
  selectedBrand,
  selectedStore,
  onBrandChange,
  onStoreChange,
  className,
  size = 'md',
  showLabels = true
}: BrandStoreSelectorProps) {
  // Use DataScopeContext for integrated state management
  const {
    accessibleBrands,
    accessibleStores,
    onBrandChange: contextBrandChange,
    onStoreChange: contextStoreChange
  } = useScopeSelector()

  const [availableStores, setAvailableStores] = useState<Store[]>([])

  // Update available stores when brand changes
  useEffect(() => {
    if (selectedBrand) {
      const brandStores = mockStores.filter(store => 
        store.brandId === selectedBrand && accessibleStores.includes(store.id)
      )
      setAvailableStores(brandStores)
      
      // Reset store selection if current store doesn't belong to selected brand
      if (selectedStore && !brandStores.find(store => store.id === selectedStore)) {
        handleStoreChange(null)
      }
    } else {
      const allAccessibleStores = mockStores.filter(store => 
        accessibleStores.includes(store.id)
      )
      setAvailableStores(allAccessibleStores)
      handleStoreChange(null)
    }
  }, [selectedBrand, selectedStore, accessibleStores])

  // Wrapper functions to coordinate with context
  const handleBrandChange = (brandId: string | null) => {
    onBrandChange(brandId)
    contextBrandChange(brandId)
  }

  const handleStoreChange = (storeId: string | null) => {
    onStoreChange(storeId)
    contextStoreChange(storeId)
  }

  const selectedBrandData = mockBrands.find(brand => brand.id === selectedBrand)
  const selectedStoreData = availableStores.find(store => store.id === selectedStore)

  const getStoreStatusColor = (status: Store['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200'
      case 'maintenance': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'inactive': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-base'
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Global/All Data Option */}
      <Button
        variant={!selectedBrand ? "default" : "outline"}
        size={size}
        onClick={() => {
          handleBrandChange(null)
          handleStoreChange(null)
        }}
        className={cn(
          "flex items-center gap-2",
          sizeClasses[size]
        )}
      >
        <Globe className="h-4 w-4" />
        {showLabels && "전체"}
      </Button>

      {/* Brand Selector */}
      <div className="flex items-center gap-1">
        {showLabels && (
          <span className="text-sm text-muted-foreground hidden sm:inline">브랜드:</span>
        )}
        <Select 
          value={selectedBrand || 'all'} 
          onValueChange={(value) => handleBrandChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className={cn("min-w-[120px]", sizeClasses[size])}>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <SelectValue>
                {selectedBrandData ? selectedBrandData.name : '전체 브랜드'}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>전체 브랜드</span>
                <Badge variant="secondary" className="ml-auto">
                  {mockBrands.length}개
                </Badge>
              </div>
            </SelectItem>
            {mockBrands.filter(brand => accessibleBrands.includes(brand.id)).map((brand) => (
              <SelectItem key={brand.id} value={brand.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{brand.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {brand.storeCount}개 매장
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Store Selector */}
      <div className="flex items-center gap-1">
        {showLabels && (
          <span className="text-sm text-muted-foreground hidden sm:inline">매장:</span>
        )}
        <Select 
          value={selectedStore || 'all'} 
          onValueChange={(value) => handleStoreChange(value === 'all' ? null : value)}
          disabled={!selectedBrand}
        >
          <SelectTrigger className={cn("min-w-[120px]", sizeClasses[size])}>
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              <SelectValue>
                {selectedStoreData ? selectedStoreData.name : 
                 selectedBrand ? '전체 매장' : '브랜드 선택'}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            {selectedBrand && (
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>전체 매장</span>
                  <Badge variant="secondary" className="ml-auto">
                    {availableStores.length}개
                  </Badge>
                </div>
              </SelectItem>
            )}
            {availableStores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span>{store.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getStoreStatusColor(store.status))}
                  >
                    {store.status === 'active' ? '운영중' : 
                     store.status === 'maintenance' ? '점검중' : '휴업'}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current Selection Display */}
      {(selectedBrand || selectedStore) && (
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground">선택됨:</span>
          {selectedBrandData && (
            <Badge variant="secondary" className="text-xs">
              {selectedBrandData.name}
            </Badge>
          )}
          {selectedStoreData && (
            <Badge variant="outline" className={cn("text-xs", getStoreStatusColor(selectedStoreData.status))}>
              {selectedStoreData.name}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default BrandStoreSelector