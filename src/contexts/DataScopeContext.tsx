import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { UserRole } from '../domains/user/types'

export type DataScopeLevel = 'company' | 'brand' | 'store'

export interface DataScopeContextType {
  // Current scope settings
  scopeLevel: DataScopeLevel
  selectedBrand?: string | null
  selectedStore?: string | null
  
  // Scope management
  setScopeLevel: (level: DataScopeLevel) => void
  setSelectedBrand: (brandId: string | null) => void
  setSelectedStore: (storeId: string | null) => void
  
  // Permission checks
  canAccessLevel: (level: DataScopeLevel) => boolean
  canAccessBrand: (brandId: string) => boolean
  canAccessStore: (storeId: string) => boolean
  
  // Data filtering helpers
  getDataScope: () => {
    level: DataScopeLevel
    brandId?: string | null
    storeId?: string | null
  }
  
  // Hierarchy helpers
  getAccessibleBrands: () => string[]
  getAccessibleStores: (brandId?: string) => string[]
  
  // Scope display helpers
  getScopeDisplayName: () => string
  getScopeBreadcrumb: () => { level: DataScopeLevel; name: string; id?: string }[]
}

const DataScopeContext = createContext<DataScopeContextType | undefined>(undefined)

export function useDataScope() {
  const context = useContext(DataScopeContext)
  if (context === undefined) {
    throw new Error('useDataScope must be used within a DataScopeProvider')
  }
  return context
}

interface DataScopeProviderProps {
  children: ReactNode
  defaultScope?: DataScopeLevel
  defaultBrand?: string | null
  defaultStore?: string | null
}

export function DataScopeProvider({
  children,
  defaultScope = 'company',
  defaultBrand = null,
  defaultStore = null
}: DataScopeProviderProps) {
  const { user } = useAuth()
  const [scopeLevel, setScopeLevel] = useState<DataScopeLevel>(defaultScope)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(defaultBrand)
  const [selectedStore, setSelectedStore] = useState<string | null>(defaultStore)
  
  // Update selected brand when defaultBrand changes (e.g., from URL params)
  useEffect(() => {
    if (defaultBrand && defaultBrand !== selectedBrand) {
      setSelectedBrand(defaultBrand)
    }
  }, [defaultBrand])

  // Mock data - should come from user permissions/API
  const mockUserBrands = ['brand_1', 'brand_2', 'brand_3'] // User accessible brands
  const mockUserStores = ['store_1', 'store_2', 'store_3', 'store_4', 'store_5', 'store_6'] // User accessible stores
  
  // Mock brand-store mapping
  const mockBrandStoreMap: Record<string, string[]> = {
    'brand_1': ['store_1', 'store_2', 'store_3'],
    'brand_2': ['store_4', 'store_5'],
    'brand_3': ['store_6']
  }

  // Permission checks based on user role and hierarchy
  const canAccessLevel = (level: DataScopeLevel): boolean => {
    if (!user) return false
    
    switch (user.role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.ADMIN:
        return true // Can access all levels
      
      case UserRole.MANAGER:
        return level !== 'company' // Can access brand and store levels
      
      case UserRole.EMPLOYEE:
        return level === 'store' // Can only access store level
      
      default:
        return false
    }
  }

  const canAccessBrand = (brandId: string): boolean => {
    if (!user) return false
    
    // Super admin and admin can access all brands
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return true
    }
    
    // Other roles need specific brand permissions
    return mockUserBrands.includes(brandId)
  }

  const canAccessStore = (storeId: string): boolean => {
    if (!user) return false
    
    // Super admin and admin can access all stores
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return true
    }
    
    // Other roles need specific store permissions
    return mockUserStores.includes(storeId)
  }

  // Auto-adjust scope based on user permissions
  useEffect(() => {
    if (!user) return

    // If user can't access current scope level, adjust to highest accessible level
    if (!canAccessLevel(scopeLevel)) {
      if (canAccessLevel('store')) {
        setScopeLevel('store')
      } else if (canAccessLevel('brand')) {
        setScopeLevel('brand')
      } else if (canAccessLevel('company')) {
        setScopeLevel('company')
      }
    }

    // If user can't access selected brand, reset
    if (selectedBrand && !canAccessBrand(selectedBrand)) {
      setSelectedBrand(null)
    }

    // If user can't access selected store, reset
    if (selectedStore && !canAccessStore(selectedStore)) {
      setSelectedStore(null)
    }
  }, [user, scopeLevel, selectedBrand, selectedStore])

  // Auto-clear store when brand changes
  useEffect(() => {
    if (selectedBrand && selectedStore) {
      const brandStores = mockBrandStoreMap[selectedBrand] || []
      if (!brandStores.includes(selectedStore)) {
        setSelectedStore(null)
      }
    } else if (!selectedBrand) {
      setSelectedStore(null)
    }
  }, [selectedBrand, selectedStore])

  const getDataScope = () => ({
    level: scopeLevel,
    brandId: selectedBrand,
    storeId: selectedStore
  })

  const getAccessibleBrands = (): string[] => {
    if (!user) return []
    
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
      return mockUserBrands // All brands for admin users
    }
    
    return mockUserBrands.filter(brandId => canAccessBrand(brandId))
  }

  const getAccessibleStores = (brandId?: string): string[] => {
    if (!user) return []
    
    let availableStores = mockUserStores
    
    // Filter by brand if specified
    if (brandId) {
      const brandStores = mockBrandStoreMap[brandId] || []
      availableStores = availableStores.filter(storeId => brandStores.includes(storeId))
    }
    
    // Filter by user permissions
    return availableStores.filter(storeId => canAccessStore(storeId))
  }

  const getScopeDisplayName = (): string => {
    if (selectedStore) {
      // Mock store names - should come from API
      const storeNames: Record<string, string> = {
        'store_1': '성수점',
        'store_2': '홍대점',
        'store_3': '강남점',
        'store_4': '카페 성수점',
        'store_5': '카페 홍대점',
        'store_6': '베이커리 성수점'
      }
      return storeNames[selectedStore] || selectedStore
    }
    
    if (selectedBrand) {
      // Mock brand names - should come from API
      const brandNames: Record<string, string> = {
        'brand_1': '밀랍',
        'brand_2': '카페 밀랍',
        'brand_3': '베이커리 밀랍'
      }
      return brandNames[selectedBrand] || selectedBrand
    }
    
    return '전체'
  }

  const getScopeBreadcrumb = () => {
    const breadcrumb: { level: DataScopeLevel; name: string; id?: string }[] = []
    
    breadcrumb.push({ level: 'company', name: '전체' })
    
    if (selectedBrand) {
      const brandNames: Record<string, string> = {
        'brand_1': '밀랍',
        'brand_2': '카페 밀랍',
        'brand_3': '베이커리 밀랍'
      }
      breadcrumb.push({ 
        level: 'brand', 
        name: brandNames[selectedBrand] || selectedBrand, 
        id: selectedBrand 
      })
    }
    
    if (selectedStore) {
      const storeNames: Record<string, string> = {
        'store_1': '성수점',
        'store_2': '홍대점',  
        'store_3': '강남점',
        'store_4': '카페 성수점',
        'store_5': '카페 홍대점',
        'store_6': '베이커리 성수점'
      }
      breadcrumb.push({ 
        level: 'store', 
        name: storeNames[selectedStore] || selectedStore, 
        id: selectedStore 
      })
    }
    
    return breadcrumb
  }

  const value: DataScopeContextType = {
    scopeLevel,
    selectedBrand,
    selectedStore,
    setScopeLevel,
    setSelectedBrand,
    setSelectedStore,
    canAccessLevel,
    canAccessBrand,
    canAccessStore,
    getDataScope,
    getAccessibleBrands,
    getAccessibleStores,
    getScopeDisplayName,
    getScopeBreadcrumb
  }

  return (
    <DataScopeContext.Provider value={value}>
      {children}
    </DataScopeContext.Provider>
  )
}

// Hook for easy scope management
export function useScopeSelector() {
  const {
    selectedBrand,
    selectedStore,
    setSelectedBrand,
    setSelectedStore,
    canAccessBrand,
    canAccessStore,
    getAccessibleBrands,
    getAccessibleStores
  } = useDataScope()

  const handleBrandChange = (brandId: string | null) => {
    if (brandId && canAccessBrand(brandId)) {
      setSelectedBrand(brandId)
    } else {
      setSelectedBrand(null)
    }
  }

  const handleStoreChange = (storeId: string | null) => {
    if (storeId && canAccessStore(storeId)) {
      setSelectedStore(storeId)
    } else {
      setSelectedStore(null)
    }
  }

  return {
    selectedBrand,
    selectedStore,
    onBrandChange: handleBrandChange,
    onStoreChange: handleStoreChange,
    accessibleBrands: getAccessibleBrands(),
    accessibleStores: getAccessibleStores(selectedBrand || undefined)
  }
}