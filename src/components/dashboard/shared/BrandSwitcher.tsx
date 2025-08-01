import React from 'react'
import { useBrandSwitcher } from '@/hooks/useBrandSwitcher'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandSwitcherProps {
  className?: string
  size?: 'sm' | 'default'
}

export function BrandSwitcher({ className, size = 'default' }: BrandSwitcherProps) {
  const { brands, selectedBrand, loading, error, switchBrand } = useBrandSwitcher()

  if (loading) {
    return <Skeleton className={cn('h-9 w-[200px]', size === 'sm' && 'h-8')} />
  }

  if (error) {
    return (
      <div className={cn(
        'flex items-center gap-2 text-destructive text-sm',
        className
      )}>
        <AlertCircle className="h-4 w-4" />
        <span>브랜드 로드 실패</span>
      </div>
    )
  }

  if (brands.length === 0) {
    return (
      <div className={cn(
        'flex items-center gap-2 text-muted-foreground text-sm',
        className
      )}>
        <Building2 className="h-4 w-4" />
        <span>브랜드가 없습니다</span>
      </div>
    )
  }

  return (
    <Select
      value={selectedBrand?.id}
      onValueChange={switchBrand}
    >
      <SelectTrigger size={size} className={cn('w-[200px]', className)}>
        <SelectValue placeholder="브랜드를 선택하세요">
          {selectedBrand && (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
                {selectedBrand.name.charAt(0)}
              </div>
              <span className="font-medium">{selectedBrand.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>브랜드 선택</SelectLabel>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={brand.id}>
              <div className="flex items-center gap-2 w-full">
                <div className="w-5 h-5 rounded bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {brand.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{brand.name}</div>
                  {brand.description && (
                    <div className="text-xs text-muted-foreground truncate">
                      {brand.description}
                    </div>
                  )}
                </div>
                {!brand.is_active && (
                  <span className="text-xs text-muted-foreground">(비활성)</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}