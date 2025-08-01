import React from 'react'
import { cn } from '@/lib/utils'
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingUp,
  UserPlus,
  Clock
} from 'lucide-react'

export interface ActivityItem {
  id: string
  type: 'inventory' | 'order' | 'alert' | 'metric' | 'user'
  title: string
  description?: string
  timestamp: Date
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'destructive' | 'warning'
  metadata?: Record<string, any>
}

interface ActivityFeedProps {
  items: ActivityItem[]
  title?: string
  className?: string
  onItemClick?: (item: ActivityItem) => void
  loading?: boolean
  emptyMessage?: string
}

const iconMap = {
  inventory: Package,
  order: ShoppingCart,
  alert: AlertTriangle,
  metric: TrendingUp,
  user: UserPlus
}

const colorMap = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-accent/10 text-accent border-accent/20'
}

export function ActivityFeed({
  items,
  title = '실시간 활동',
  className,
  onItemClick,
  loading = false,
  emptyMessage = '최근 활동이 없습니다'
}: ActivityFeedProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  return (
    <div className={cn("rounded-xl bg-card border shadow-sm", className)}>
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-border/50">
        {loading ? (
          // Loading state
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty state
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : (
          // Activity items
          <>
            {items.map((item) => {
              const Icon = item.icon || iconMap[item.type]
              const colorClass = colorMap[item.color || 'primary']

              return (
                <div
                  key={item.id}
                  className={cn(
                    "px-6 py-4 flex gap-4 hover:bg-muted/50 transition-colors",
                    onItemClick && "cursor-pointer"
                  )}
                  onClick={() => onItemClick?.(item)}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center border",
                    colorClass
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(item.timestamp)}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* View All Link */}
      {!loading && items.length > 0 && (
        <div className="px-6 py-3 border-t">
          <button className="text-sm text-primary hover:underline">
            모든 활동 보기
          </button>
        </div>
      )}
    </div>
  )
}