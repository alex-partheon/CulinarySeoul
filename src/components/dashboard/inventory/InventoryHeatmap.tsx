import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface HeatmapItem {
  id: string
  name: string
  category: string
  location: string
  value: number
  maxValue: number
  unit: string
  details?: string
}

interface InventoryHeatmapProps {
  items: HeatmapItem[]
  title?: string
  onCellClick?: (item: HeatmapItem) => void
  className?: string
}

export function InventoryHeatmap({
  items,
  title = '재고 분포 현황',
  onCellClick,
  className
}: InventoryHeatmapProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Group items by category and location
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = {}
    }
    if (!acc[item.category][item.location]) {
      acc[item.category][item.location] = []
    }
    acc[item.category][item.location].push(item)
    return acc
  }, {} as Record<string, Record<string, HeatmapItem[]>>)

  // Get all unique locations
  const allLocations = Array.from(
    new Set(items.map(item => item.location))
  ).sort()

  // Calculate cell color based on stock level
  const getCellColor = (percentage: number) => {
    if (percentage <= 20) return 'bg-destructive/20 hover:bg-destructive/30'
    if (percentage <= 40) return 'bg-accent/20 hover:bg-accent/30'
    if (percentage <= 60) return 'bg-primary/20 hover:bg-primary/30'
    if (percentage <= 80) return 'bg-secondary/20 hover:bg-secondary/30'
    return 'bg-secondary/40 hover:bg-secondary/50'
  }

  const getTextColor = (percentage: number) => {
    if (percentage <= 20) return 'text-destructive'
    if (percentage <= 40) return 'text-accent'
    return 'text-foreground'
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  const calculatePercentage = (current: number, max: number) => {
    return max > 0 ? (current / max) * 100 : 0
  }

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          카테고리별 재고 분포를 한눈에 확인하세요
        </p>
      </div>

      {/* Category tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            selectedCategory === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          )}
        >
          전체
        </button>
        {Object.keys(grouped).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-[150px_repeat(auto-fit,minmax(100px,1fr))] gap-2">
            {/* Header row */}
            <div className="font-medium text-sm text-muted-foreground p-2">카테고리</div>
            {allLocations.map(location => (
              <div key={location} className="font-medium text-sm text-center p-2 truncate">
                {location}
              </div>
            ))}

            {/* Data rows */}
            {Object.entries(grouped)
              .filter(([category]) => !selectedCategory || category === selectedCategory)
              .map(([category, locations]) => (
                <React.Fragment key={category}>
                  <div className="font-medium text-sm p-2 truncate">{category}</div>
                  {allLocations.map(location => {
                    const items = locations[location] || []
                    const totalValue = items.reduce((sum, item) => sum + item.value, 0)
                    const totalMax = items.reduce((sum, item) => sum + item.maxValue, 0)
                    const percentage = calculatePercentage(totalValue, totalMax)

                    return (
                      <TooltipProvider key={`${category}-${location}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "relative rounded-lg p-3 text-center transition-all cursor-pointer",
                                items.length > 0
                                  ? getCellColor(percentage)
                                  : "bg-muted/30"
                              )}
                              onClick={() => {
                                if (items.length > 0 && onCellClick) {
                                  items.forEach(item => onCellClick(item))
                                }
                              }}
                            >
                              {items.length > 0 ? (
                                <div>
                                  <div className={cn(
                                    "text-lg font-bold",
                                    getTextColor(percentage)
                                  )}>
                                    {percentage.toFixed(0)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {items.length}개 품목
                                  </div>
                                </div>
                              ) : (
                                <div className="text-muted-foreground">-</div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="p-2">
                              <p className="font-medium">{category} - {location}</p>
                              {items.length > 0 ? (
                                <div className="mt-2 space-y-1">
                                  {items.slice(0, 5).map(item => (
                                    <div key={item.id} className="text-sm">
                                      <span className="font-medium">{item.name}:</span>{' '}
                                      {formatNumber(item.value)}/{formatNumber(item.maxValue)} {item.unit}
                                    </div>
                                  ))}
                                  {items.length > 5 && (
                                    <div className="text-sm text-muted-foreground">
                                      외 {items.length - 5}개 품목...
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground mt-1">
                                  재고 없음
                                </p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-destructive/20" />
          <span className="text-muted-foreground">0-20%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-accent/20" />
          <span className="text-muted-foreground">21-40%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-primary/20" />
          <span className="text-muted-foreground">41-60%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-secondary/20" />
          <span className="text-muted-foreground">61-80%</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-4 rounded bg-secondary/40" />
          <span className="text-muted-foreground">81-100%</span>
        </div>
      </div>
    </div>
  )
}