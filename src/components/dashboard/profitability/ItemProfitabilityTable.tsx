import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Download, 
  Eye,
  AlertCircle 
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ItemProfitability {
  id: string
  name: string
  category?: string
  quantitySold: number
  revenue: number
  cost: number
  margin: number
  marginRate: number // 마진율 (%)
}

interface ItemProfitabilityTableProps {
  items: ItemProfitability[]
  onViewDetails?: (item: ItemProfitability) => void
  onExport?: () => void
  loading?: boolean
  targetMarginRate?: number // 목표 마진율
}

type SortField = 'name' | 'quantitySold' | 'revenue' | 'cost' | 'margin' | 'marginRate'
type SortDirection = 'asc' | 'desc'

export function ItemProfitabilityTable({
  items,
  onViewDetails,
  onExport,
  loading = false,
  targetMarginRate = 30 // 기본 목표 마진율 30%
}: ItemProfitabilityTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('revenue')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category).filter(Boolean))
    return Array.from(uniqueCategories).sort()
  }, [items])

  // 필터링 및 정렬
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      const numA = Number(aValue) || 0
      const numB = Number(bValue) || 0
      
      return sortDirection === 'asc' ? numA - numB : numB - numA
    })

    return sorted
  }, [items, searchQuery, selectedCategory, sortField, sortDirection])

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // 정렬 아이콘 표시
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />
  }

  // 숫자 포맷팅
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // 마진율에 따른 색상 클래스
  const getMarginRateClass = (marginRate: number) => {
    if (marginRate < targetMarginRate * 0.7) { // 목표의 70% 미만
      return 'text-destructive font-medium'
    } else if (marginRate < targetMarginRate * 0.9) { // 목표의 90% 미만
      return 'text-yellow-600 dark:text-yellow-500'
    }
    return 'text-secondary'
  }

  // 통계 계산
  const stats = useMemo(() => {
    const filtered = filteredAndSortedItems
    const totalRevenue = filtered.reduce((sum, item) => sum + item.revenue, 0)
    const totalCost = filtered.reduce((sum, item) => sum + item.cost, 0)
    const totalMargin = totalRevenue - totalCost
    const avgMarginRate = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0

    return {
      totalRevenue,
      totalCost,
      totalMargin,
      avgMarginRate,
      itemCount: filtered.length
    }
  }, [filteredAndSortedItems])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="h-96 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 필터 및 액션 바 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="항목명 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {categories.length > 0 && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 카테고리</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="mr-2 h-4 w-4" />
            내보내기
          </Button>
        )}
      </div>

      {/* 테이블 */}
      <div className="rounded-lg border">
        <Table>
          <TableCaption>
            총 {stats.itemCount}개 항목 | 
            평균 마진율: <span className={cn(getMarginRateClass(stats.avgMarginRate))}>
              {stats.avgMarginRate.toFixed(1)}%
            </span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  항목명
                  <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort('quantitySold')}
              >
                <div className="flex items-center justify-end">
                  판매수량
                  <SortIcon field="quantitySold" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center justify-end">
                  매출액
                  <SortIcon field="revenue" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort('cost')}
              >
                <div className="flex items-center justify-end">
                  원가
                  <SortIcon field="cost" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort('margin')}
              >
                <div className="flex items-center justify-end">
                  마진
                  <SortIcon field="margin" />
                </div>
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer select-none"
                onClick={() => handleSort('marginRate')}
              >
                <div className="flex items-center justify-end">
                  마진율
                  <SortIcon field="marginRate" />
                </div>
              </TableHead>
              <TableHead className="text-center w-[100px]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  검색 결과가 없습니다
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.marginRate < targetMarginRate * 0.7 && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.category && (
                          <div className="text-sm text-muted-foreground">{item.category}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantitySold.toLocaleString()}개
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.cost)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.margin)}
                  </TableCell>
                  <TableCell className={cn("text-right", getMarginRateClass(item.marginRate))}>
                    {item.marginRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-center">
                    {onViewDetails && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">총 매출액</p>
          <p className="text-lg font-semibold">{formatCurrency(stats.totalRevenue)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">총 원가</p>
          <p className="text-lg font-semibold">{formatCurrency(stats.totalCost)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">총 마진</p>
          <p className="text-lg font-semibold">{formatCurrency(stats.totalMargin)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">평균 마진율</p>
          <p className={cn("text-lg font-semibold", getMarginRateClass(stats.avgMarginRate))}>
            {stats.avgMarginRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  )
}