import React from 'react'
import { cn } from '@/lib/utils'
import { 
  Plus,
  Package,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Download,
  Settings,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface QuickAction {
  id: string
  title: string
  description?: string
  icon: LucideIcon
  onClick: () => void
  color?: 'primary' | 'secondary' | 'destructive' | 'warning'
  disabled?: boolean
  badge?: string | number
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  className?: string
  columns?: 2 | 3 | 4
  variant?: 'card' | 'button'
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary hover:bg-primary/20',
  secondary: 'bg-secondary/10 text-secondary hover:bg-secondary/20',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
  warning: 'bg-accent/10 text-accent hover:bg-accent/20'
}

export function QuickActions({
  actions,
  title = '빠른 작업',
  className,
  columns = 3,
  variant = 'card'
}: QuickActionsProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  }

  if (variant === 'button') {
    return (
      <div className={cn("space-y-4", className)}>
        {title && (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                onClick={action.onClick}
                disabled={action.disabled}
                variant="outline"
                className={cn(
                  "gap-2 relative",
                  colorClasses[action.color || 'primary']
                )}
              >
                <Icon className="w-4 h-4" />
                {action.title}
                {action.badge && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
                    {action.badge}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      <div className={cn(
        "grid gap-4",
        gridCols[columns]
      )}>
        {actions.map((action) => {
          const Icon = action.icon
          const colorClass = colorClasses[action.color || 'primary']
          
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "group relative p-6 rounded-xl border bg-card text-left",
                "transition-all duration-200 hover:shadow-md hover:border-primary/20",
                "hover:-translate-y-0.5",
                action.disabled && "opacity-50 cursor-not-allowed",
                !action.disabled && "cursor-pointer"
              )}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              
              <div className="relative space-y-3">
                <div className={cn(
                  "inline-flex p-3 rounded-lg",
                  colorClass
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {action.title}
                    {action.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {action.badge}
                      </span>
                    )}
                  </h4>
                  {action.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Hover Indicator */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Pre-configured quick action sets for common use cases
export const inventoryQuickActions: QuickAction[] = [
  {
    id: 'add-stock',
    title: '재고 추가',
    description: '새로운 재고 입고 등록',
    icon: Plus,
    onClick: () => console.log('Add stock'),
    color: 'primary'
  },
  {
    id: 'stock-adjustment',
    title: '재고 조정',
    description: '재고 수량 수정',
    icon: Package,
    onClick: () => console.log('Stock adjustment'),
    color: 'secondary'
  },
  {
    id: 'low-stock-alert',
    title: '재고 부족 알림',
    description: '부족한 재고 확인',
    icon: AlertTriangle,
    onClick: () => console.log('Low stock alert'),
    color: 'warning',
    badge: 5
  },
  {
    id: 'inventory-report',
    title: '재고 리포트',
    description: '재고 현황 보고서',
    icon: FileText,
    onClick: () => console.log('Inventory report'),
    color: 'primary'
  }
]

export const orderQuickActions: QuickAction[] = [
  {
    id: 'new-order',
    title: '새 주문',
    description: '주문 생성',
    icon: Plus,
    onClick: () => console.log('New order'),
    color: 'primary'
  },
  {
    id: 'pending-orders',
    title: '대기 중인 주문',
    description: '처리 대기 주문',
    icon: ShoppingCart,
    onClick: () => console.log('Pending orders'),
    color: 'warning',
    badge: 12
  },
  {
    id: 'order-history',
    title: '주문 내역',
    description: '과거 주문 조회',
    icon: FileText,
    onClick: () => console.log('Order history'),
    color: 'secondary'
  },
  {
    id: 'export-orders',
    title: '주문 내보내기',
    description: 'Excel 다운로드',
    icon: Download,
    onClick: () => console.log('Export orders'),
    color: 'primary'
  }
]