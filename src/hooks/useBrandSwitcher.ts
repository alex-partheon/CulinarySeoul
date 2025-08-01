import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Brand } from '@/domains/brand/types'
import { BrandService } from '@/domains/brand/brandService'
import { toast } from 'react-hot-toast'

interface UseBrandSwitcherReturn {
  brands: Brand[]
  selectedBrand: Brand | null
  loading: boolean
  error: Error | null
  switchBrand: (brandId: string) => void
  refreshBrands: () => Promise<void>
}

const SELECTED_BRAND_KEY = 'culinaryseoul.selectedBrandId'

export function useBrandSwitcher(): UseBrandSwitcherReturn {
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Load brands
  const loadBrands = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const brandList = await BrandService.getBrands()
      setBrands(brandList)

      // Load selected brand from localStorage
      const savedBrandId = localStorage.getItem(SELECTED_BRAND_KEY)
      if (savedBrandId) {
        const saved = brandList.find(b => b.id === savedBrandId)
        if (saved) {
          setSelectedBrand(saved)
        } else if (brandList.length > 0) {
          // If saved brand not found, select first available
          setSelectedBrand(brandList[0])
          localStorage.setItem(SELECTED_BRAND_KEY, brandList[0].id)
        }
      } else if (brandList.length > 0) {
        // No saved brand, select first
        setSelectedBrand(brandList[0])
        localStorage.setItem(SELECTED_BRAND_KEY, brandList[0].id)
      }
    } catch (err) {
      setError(err as Error)
      toast.error('브랜드 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Switch brand
  const switchBrand = useCallback((brandId: string) => {
    const brand = brands.find(b => b.id === brandId)
    if (!brand) {
      toast.error('선택한 브랜드를 찾을 수 없습니다.')
      return
    }

    setSelectedBrand(brand)
    localStorage.setItem(SELECTED_BRAND_KEY, brandId)
    
    // Navigate to brand-specific page if on a brand route
    if (location.pathname.startsWith('/company/brands/')) {
      navigate(`/company/brands/${brandId}`)
    } else if (location.pathname.includes('/inventory')) {
      // Refresh inventory view with new brand context
      navigate(location.pathname, { replace: true })
    }
    
    toast.success(`${brand.name} 브랜드로 전환했습니다.`)
  }, [brands, location.pathname, navigate])

  // Refresh brands
  const refreshBrands = useCallback(async () => {
    await loadBrands()
  }, [loadBrands])

  // Initial load
  useEffect(() => {
    loadBrands()
  }, [loadBrands])

  return {
    brands,
    selectedBrand,
    loading,
    error,
    switchBrand,
    refreshBrands
  }
}