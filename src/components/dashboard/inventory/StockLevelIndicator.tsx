import React from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

interface StockItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
}

interface StockLevelIndicatorProps {
  items: StockItem[]
  title?: string
  onItemClick?: (item: StockItem) => void
  className?: string
}

export function StockLevelIndicator({
  items,
  title,
  onItemClick,
  className
}: StockLevelIndicatorProps) {
  const getStockPercentage = (item: StockItem) => {
    return ((item.currentStock - item.minStock) / (item.maxStock - item.minStock)) * 100
  }

  const getStockStatus = (percentage: number) => {
    if (percentage <= 20) return { status: 'danger', icon: AlertCircle, color: 'bg-destructive' }
    if (percentage <= 40) return { status: 'warning', icon: AlertTriangle, color: 'bg-accent' }
    return { status: 'success', icon: CheckCircle, color: 'bg-secondary' }
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, StockItem[]>)

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      {title && (
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      )}

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">{category}</h4>
            <div className="space-y-3">
              {categoryItems.map((item) => {
                const percentage = getStockPercentage(item)
                const { status, icon: StatusIcon, color } = getStockStatus(percentage)

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative overflow-hidden rounded-lg border p-4 transition-all",
                      "hover:shadow-sm hover:border-primary/20",
                      onItemClick && "cursor-pointer"
                    )}
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(item.currentStock)} / {formatNumber(item.maxStock)} {item.unit}
                        </p>
                      </div>
                      <StatusIcon className={cn(
                        "h-5 w-5",
                        status === 'danger' && "text-destructive",
                        status === 'warning' && "text-accent",
                        status === 'success' && "text-secondary"
                      )} />
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "absolute left-0 top-0 h-full transition-all duration-500",
                          color
                        )}
                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                      />
                      
                      {/* Min stock indicator */}
                      <div
                        className="absolute top-0 h-full w-0.5 bg-border"
                        style={{ 
                          left: `${((item.minStock) / (item.maxStock - item.minStock)) * 100}%` 
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>최소: {formatNumber(item.minStock)} {item.unit}</span>
                      <span className={cn(
                        "font-medium",
                        percentage <= 20 && "text-destructive",
                        percentage > 20 && percentage <= 40 && "text-accent",
                        percentage > 40 && "text-secondary"
                      )}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}