import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label?: string
  }
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  description?: string
  onClick?: () => void
  className?: string
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
  onClick,
  className,
  loading = false
}: MetricCardProps) {
  // Auto-detect trend from change value
  const displayTrend = trend || (change?.value ? (change.value > 0 ? 'up' : 'down') : 'neutral')
  
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-card border border-border/50",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "hover:border-primary/20 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="space-y-2">
          {loading ? (
            <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
          ) : (
            <p className="text-3xl font-bold tracking-tight metric-update">
              {value}
            </p>
          )}

          {/* Change Indicator */}
          {change && (
            <div className="flex items-center gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 text-sm font-medium rounded-full px-2.5 py-0.5",
                displayTrend === 'up' && "bg-secondary/10 text-secondary",
                displayTrend === 'down' && "bg-destructive/10 text-destructive"
              )}>
                {displayTrend === 'up' ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {change.value > 0 ? '+' : ''}{change.value}%
              </span>
              {change.label && (
                <span className="text-xs text-muted-foreground">
                  {change.label}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>

        {/* Hover Action Indicator */}
        {onClick && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>
    </div>
  )
}