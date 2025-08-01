import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InventoryChartProps {
  data?: {
    date: string
    value: number
  }[]
  loading?: boolean
  className?: string
}

export function InventoryChart({ data = [], loading, className }: InventoryChartProps) {
  // Simple bar chart visualization
  const maxValue = Math.max(...data.map(d => d.value), 100)
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            재고 추이
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse space-y-2 w-full">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-32 bg-muted rounded mt-4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Generate sample data if no data provided
  const chartData = data.length > 0 ? data : Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    value: Math.floor(Math.random() * 100) + 50
  }))

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          재고 추이
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>최근 7일</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-muted-foreground">
            <span>{maxValue}</span>
            <span>{Math.floor(maxValue * 0.75)}</span>
            <span>{Math.floor(maxValue * 0.5)}</span>
            <span>{Math.floor(maxValue * 0.25)}</span>
            <span>0</span>
          </div>
          
          {/* Chart area */}
          <div className="ml-14 h-full pr-4">
            <div className="h-full flex items-end justify-between gap-2">
              {chartData.map((item, index) => {
                const height = (item.value / maxValue) * 100
                const isIncreasing = index > 0 && item.value > chartData[index - 1].value
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative h-48 flex items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-md transition-all duration-500 hover:opacity-80",
                          "bg-gradient-to-t from-primary to-primary/80"
                        )}
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {item.date}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">평균 재고량: </span>
            <span className="font-medium">
              {Math.floor(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {chartData[chartData.length - 1]?.value > chartData[0]?.value ? (
              <>
                <TrendingUp className="w-4 h-4 text-secondary" />
                <span className="text-secondary font-medium">증가 추세</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-destructive font-medium">감소 추세</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}