import React from 'react'
import { cn } from '@/lib/utils'
import { Clock, AlertTriangle, X, Tag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ExpiryItem {
  id: string
  productId: string
  productName: string
  lotNumber: string
  quantity: number
  unit: string
  expiryDate: string
  daysUntilExpiry: number
  location: string
  category: string
}

interface ExpiryAlertPanelProps {
  items: ExpiryItem[]
  title?: string
  onAction?: (action: 'use' | 'discount' | 'dispose', item: ExpiryItem) => void
  className?: string
}

export function ExpiryAlertPanel({
  items,
  title = '유통기한 임박 알림',
  onAction,
  className
}: ExpiryAlertPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value)
  }

  const getUrgencyColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 3) return 'destructive'
    if (daysUntilExpiry <= 7) return 'warning'
    return 'default'
  }

  const getUrgencyLabel = (daysUntilExpiry: number) => {
    if (daysUntilExpiry === 0) return '오늘 만료'
    if (daysUntilExpiry === 1) return '내일 만료'
    if (daysUntilExpiry < 0) return '만료됨'
    return `${daysUntilExpiry}일 남음`
  }

  // Sort items by urgency
  const sortedItems = [...items].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  // Group by urgency level
  const urgentItems = sortedItems.filter(item => item.daysUntilExpiry <= 3)
  const warningItems = sortedItems.filter(item => item.daysUntilExpiry > 3 && item.daysUntilExpiry <= 7)
  const upcomingItems = sortedItems.filter(item => item.daysUntilExpiry > 7)

  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-accent" />
          {title}
        </h3>
        <Badge variant="outline" className="text-muted-foreground">
          총 {items.length}개 품목
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Urgent items */}
        {urgentItems.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-destructive flex items-center gap-2">
              <Clock className="h-4 w-4" />
              긴급 처리 필요
            </h4>
            <div className="space-y-2">
              {urgentItems.map((item) => (
                <ExpiryItemCard key={item.id} item={item} onAction={onAction} />
              ))}
            </div>
          </div>
        )}

        {/* Warning items */}
        {warningItems.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-accent flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              주의 필요
            </h4>
            <div className="space-y-2">
              {warningItems.map((item) => (
                <ExpiryItemCard key={item.id} item={item} onAction={onAction} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming items */}
        {upcomingItems.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              예정
            </h4>
            <div className="space-y-2">
              {upcomingItems.map((item) => (
                <ExpiryItemCard key={item.id} item={item} onAction={onAction} />
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            유통기한이 임박한 품목이 없습니다
          </div>
        )}
      </div>
    </div>
  )
}

function ExpiryItemCard({
  item,
  onAction
}: {
  item: ExpiryItem
  onAction?: (action: 'use' | 'discount' | 'dispose', item: ExpiryItem) => void
}) {
  const urgencyColor = getUrgencyColor(item.daysUntilExpiry)
  const urgencyLabel = getUrgencyLabel(item.daysUntilExpiry)

  return (
    <div className="group relative overflow-hidden rounded-lg border p-4 transition-all hover:shadow-sm hover:border-primary/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div>
              <p className="font-medium truncate">{item.productName}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>Lot: {item.lotNumber}</span>
                <span>•</span>
                <span>{formatNumber(item.quantity)} {item.unit}</span>
                <span>•</span>
                <span>{item.location}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={urgencyColor as any} className="text-xs">
                  {urgencyLabel}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.expiryDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {onAction && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAction('use', item)}
              className="h-8 w-8 p-0"
              title="사용"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAction('discount', item)}
              className="h-8 w-8 p-0"
              title="할인"
            >
              <Tag className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAction('dispose', item)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="폐기"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function getUrgencyColor(daysUntilExpiry: number): string {
  if (daysUntilExpiry <= 3) return 'destructive'
  if (daysUntilExpiry <= 7) return 'secondary'
  return 'outline'
}

function getUrgencyLabel(daysUntilExpiry: number): string {
  if (daysUntilExpiry === 0) return '오늘 만료'
  if (daysUntilExpiry === 1) return '내일 만료'
  if (daysUntilExpiry < 0) return '만료됨'
  return `${daysUntilExpiry}일 남음`
}