import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface InventoryMetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  status?: 'success' | 'warning' | 'danger' | 'info'
  description?: string
  onClick?: () => void
}

export function InventoryMetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  status = 'info',
  description,
  onClick
}: InventoryMetricCardProps) {
  // Determine trend based on change if not explicitly provided
  const displayTrend = trend || (change ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') : 'neutral')
  
  // Status colors
  const statusColors = {
    success: 'text-secondary',
    warning: 'text-accent',
    danger: 'text-destructive',
    info: 'text-muted-foreground'
  }
  
  const trendColors = {
    up: 'text-secondary',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  }
  
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />
  }
  
  const backgroundColors = {
    success: 'bg-secondary/10',
    warning: 'bg-accent/10',
    danger: 'bg-destructive/10',
    info: 'bg-muted/10'
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-primary/10" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
            
            {(change !== undefined || changeLabel) && (
              <div className="mt-4 flex items-center gap-2">
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  backgroundColors[status]
                )}>
                  {displayTrend && (
                    <span className={trendColors[displayTrend]}>
                      {trendIcons[displayTrend]}
                    </span>
                  )}
                  {change !== undefined && (
                    <span className={cn("font-semibold", trendColors[displayTrend])}>
                      {change > 0 ? '+' : ''}{change}%
                    </span>
                  )}
                </div>
                {changeLabel && (
                  <span className="text-xs text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              backgroundColors[status]
            )}>
              <div className={statusColors[status]}>{icon}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}