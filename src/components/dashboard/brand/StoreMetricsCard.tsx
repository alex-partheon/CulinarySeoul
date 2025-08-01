import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart,
  Users,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Power,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { Store } from '@/domains/store/types'

interface StoreMetricsCardProps {
  store: Store
  metrics?: {
    todaySales?: number
    salesChange?: number
    inventoryStatus?: 'good' | 'low' | 'critical'
    inventoryLevel?: number
    activeOrders?: number
    staffCount?: number
    isOnline?: boolean
  }
  onViewDetails?: () => void
  onEdit?: () => void
  onToggleStatus?: () => void
  className?: string
}

export function StoreMetricsCard({
  store,
  metrics = {},
  onViewDetails,
  onEdit,
  onToggleStatus,
  className
}: StoreMetricsCardProps) {
  const {
    todaySales = 0,
    salesChange = 0,
    inventoryStatus = 'good',
    inventoryLevel = 75,
    activeOrders = 0,
    staffCount = 0,
    isOnline = true
  } = metrics

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getInventoryColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50'
      case 'low': return 'text-yellow-600 bg-yellow-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getInventoryProgressColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500'
      case 'low': return 'bg-yellow-500'
      case 'critical': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStoreTypeLabel = (type: string) => {
    switch (type) {
      case 'direct': return '직영'
      case 'franchise': return '가맹'
      case 'partner': return '파트너'
      default: return type
    }
  }

  const getCurrentOperatingStatus = () => {
    if (!store.operating_hours) return { isOpen: false, nextChange: '' }
    
    const now = new Date()
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()]
    const currentTime = now.getHours() * 60 + now.getMinutes()
    
    const todaySchedule = store.operating_hours[currentDay as keyof typeof store.operating_hours]
    
    if (!todaySchedule || !todaySchedule.is_open) {
      return { isOpen: false, nextChange: '휴무일' }
    }
    
    const [openHour, openMinute] = (todaySchedule.open_time || '00:00').split(':').map(Number)
    const [closeHour, closeMinute] = (todaySchedule.close_time || '00:00').split(':').map(Number)
    
    const openTime = openHour * 60 + openMinute
    const closeTime = closeHour * 60 + closeMinute
    
    if (currentTime >= openTime && currentTime < closeTime) {
      return { 
        isOpen: true, 
        nextChange: `${String(closeHour).padStart(2, '0')}:${String(closeMinute).padStart(2, '0')} 마감`
      }
    } else if (currentTime < openTime) {
      return { 
        isOpen: false, 
        nextChange: `${String(openHour).padStart(2, '0')}:${String(openMinute).padStart(2, '0')} 오픈`
      }
    } else {
      return { isOpen: false, nextChange: '영업 종료' }
    }
  }

  const operatingStatus = getCurrentOperatingStatus()

  return (
    <Card className={cn("relative overflow-hidden hover:shadow-lg transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{store.name}</h3>
              <Badge variant="outline" className="text-xs">
                {getStoreTypeLabel(store.store_type)}
              </Badge>
              {!store.is_active && (
                <Badge variant="secondary" className="text-xs bg-gray-100">
                  비활성
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {store.address?.city} {store.address?.street}
            </p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onViewDetails}>
                <Eye className="h-4 w-4 mr-2" />
                상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onToggleStatus}>
                <Power className="h-4 w-4 mr-2" />
                {store.is_active ? '비활성화' : '활성화'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Operating Status */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              operatingStatus.isOpen ? "bg-green-500" : "bg-gray-400"
            )} />
            <span className="text-sm font-medium">
              {operatingStatus.isOpen ? '영업중' : '영업종료'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {operatingStatus.nextChange}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Today's Sales */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">오늘 매출</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{formatCurrency(todaySales)}</span>
              {salesChange !== 0 && (
                <div className={cn(
                  "flex items-center gap-0.5 text-xs",
                  salesChange > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {salesChange > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(salesChange)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">재고 상태</span>
            <Badge 
              variant="secondary" 
              className={cn("text-xs", getInventoryColor(inventoryStatus))}
            >
              {inventoryStatus === 'good' ? '양호' : 
               inventoryStatus === 'low' ? '부족' : '위험'}
            </Badge>
          </div>
          <Progress 
            value={inventoryLevel} 
            className={cn("h-1.5", getInventoryProgressColor(inventoryStatus))}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center">
            <ShoppingCart className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{activeOrders}</p>
            <p className="text-xs text-muted-foreground">진행 주문</p>
          </div>
          <div className="text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{staffCount}</p>
            <p className="text-xs text-muted-foreground">근무 직원</p>
          </div>
          <div className="text-center">
            <Package className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-lg font-semibold">{inventoryLevel}%</p>
            <p className="text-xs text-muted-foreground">재고율</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-muted-foreground">연결 상태</span>
          <div className="flex items-center gap-1">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isOnline ? "bg-green-500" : "bg-gray-400"
            )} />
            <span className="text-xs font-medium">
              {isOnline ? '온라인' : '오프라인'}
            </span>
          </div>
        </div>
      </CardContent>

      {/* Alert Indicator */}
      {inventoryStatus === 'critical' && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
        </div>
      )}
    </Card>
  )
}