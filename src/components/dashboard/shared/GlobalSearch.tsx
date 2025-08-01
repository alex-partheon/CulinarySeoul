import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Search, 
  Building2, 
  Store as StoreIcon,
  Package,
  ShoppingBag,
  Utensils,
  Clock,
  ArrowRight,
  Command
} from 'lucide-react'
import { cn, debounce } from '@/lib/utils'
import { BrandService } from '@/domains/brand/brandService'
import { StoreService } from '@/domains/store/storeService'
import { Brand } from '@/domains/brand/types'
import { Store } from '@/domains/store/types'
import { toast } from 'react-hot-toast'

interface SearchResult {
  id: string
  type: 'brand' | 'store' | 'menu' | 'order' | 'inventory'
  title: string
  subtitle?: string
  url: string
  icon: React.ElementType
  category: string
}

interface GlobalSearchProps {
  className?: string
}

const RECENT_SEARCHES_KEY = 'culinaryseoul.recentSearches'
const MAX_RECENT_SEARCHES = 5

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse recent searches:', error)
      }
    }
  }, [])

  // Save to recent searches
  const saveToRecent = useCallback((result: SearchResult) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.id !== result.id)
      const updated = [result, ...filtered].slice(0, MAX_RECENT_SEARCHES)
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults: SearchResult[] = []

    try {
      // Search brands
      const brands = await BrandService.getBrands()
      const matchingBrands = brands.filter(brand => 
        brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      matchingBrands.forEach(brand => {
        searchResults.push({
          id: brand.id,
          type: 'brand',
          title: brand.name,
          subtitle: brand.description,
          url: `/company/brands/${brand.id}`,
          icon: Building2,
          category: '브랜드'
        })
      })

      // Search stores
      const stores = await StoreService.getStores()
      const matchingStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.address?.street?.toLowerCase().includes(searchQuery.toLowerCase())
      )

      matchingStores.forEach(store => {
        searchResults.push({
          id: store.id,
          type: 'store',
          title: store.name,
          subtitle: store.address?.street,
          url: `/company/stores/${store.id}`,
          icon: StoreIcon,
          category: '매장'
        })
      })

      // Mock menu items (would be real API call)
      if ('메뉴'.includes(searchQuery) || 'menu'.includes(searchQuery.toLowerCase())) {
        searchResults.push({
          id: 'menu-1',
          type: 'menu',
          title: '메뉴 관리',
          subtitle: '메뉴 아이템 관리',
          url: '/company/menu',
          icon: Utensils,
          category: '메뉴'
        })
      }

      // Mock orders (would be real API call)
      if ('주문'.includes(searchQuery) || 'order'.includes(searchQuery.toLowerCase())) {
        searchResults.push({
          id: 'order-1',
          type: 'order',
          title: '주문 관리',
          subtitle: '주문 현황 및 처리',
          url: '/company/orders',
          icon: ShoppingBag,
          category: '주문'
        })
      }

      // Mock inventory (would be real API call)
      if ('재고'.includes(searchQuery) || 'inventory'.includes(searchQuery.toLowerCase())) {
        searchResults.push({
          id: 'inventory-1',
          type: 'inventory',
          title: '재고 관리',
          subtitle: '재고 현황 및 관리',
          url: '/company/inventory',
          icon: Package,
          category: '재고'
        })
      }

      setResults(searchResults)
      setSelectedIndex(0)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('검색 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => performSearch(value), 300),
    [performSearch]
  )

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value)
    debouncedSearch(value)
  }

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    saveToRecent(result)
    navigate(result.url)
    setOpen(false)
    setQuery('')
    setResults([])
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      const items = query ? results : recentSearches
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % Math.max(1, items.length))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + items.length) % Math.max(1, items.length))
          break
        case 'Enter':
          e.preventDefault()
          if (items[selectedIndex]) {
            handleSelect(items[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, query, results, recentSearches, selectedIndex])

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const displayItems = query ? results : recentSearches

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground',
          'bg-muted/50 hover:bg-muted rounded-lg transition-colors',
          'border border-border/50',
          className
        )}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">검색...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0">
          <DialogHeader className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder="브랜드, 매장, 메뉴, 주문 검색..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && (
              <div className="p-4 space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            )}

            {!loading && !query && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  최근 검색
                </div>
                {recentSearches.map((item, index) => (
                  <SearchResultItem
                    key={item.id}
                    result={item}
                    isSelected={index === selectedIndex}
                    onSelect={() => handleSelect(item)}
                  />
                ))}
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>"{query}"에 대한 검색 결과가 없습니다.</p>
              </div>
            )}

            {!loading && query && results.length > 0 && (
              <div>
                {/* Group results by category */}
                {Object.entries(
                  results.reduce((acc, result) => {
                    if (!acc[result.category]) acc[result.category] = []
                    acc[result.category].push(result)
                    return acc
                  }, {} as Record<string, SearchResult[]>)
                ).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                      {category}
                    </div>
                    {items.map((item, index) => (
                      <SearchResultItem
                        key={item.id}
                        result={item}
                        isSelected={results.indexOf(item) === selectedIndex}
                        onSelect={() => handleSelect(item)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↑↓</kbd>
                이동
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">↵</kbd>
                선택
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-muted rounded text-xs">ESC</kbd>
                닫기
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface SearchResultItemProps {
  result: SearchResult
  isSelected: boolean
  onSelect: () => void
}

function SearchResultItem({ result, isSelected, onSelect }: SearchResultItemProps) {
  const Icon = result.icon

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors',
        isSelected && 'bg-muted/50'
      )}
    >
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium">{result.title}</div>
        {result.subtitle && (
          <div className="text-sm text-muted-foreground">{result.subtitle}</div>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  )
}