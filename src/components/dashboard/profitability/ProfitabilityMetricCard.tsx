import React from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight
} from 'lucide-react'

export type MetricType = 'currency' | 'percentage' | 'count' | 'decimal'
export type TrendDirection = 'up' | 'down' | 'neutral'

interface ProfitabilityMetricCardProps {
  title: string
  value: number | string
  metricType?: MetricType
  previousValue?: number | string
  trend?: TrendDirection
  trendValue?: number // 변화량 또는 변화율
  trendLabel?: string // 예: "전월 대비"
  description?: string
  icon?: React.ReactNode
  status?: 'success' | 'warning' | 'danger' | 'neutral'
  loading?: boolean
  onClick?: () => void
  className?: string
}

export function ProfitabilityMetricCard({
  title,
  value,
  metricType = 'count',
  previousValue,
  trend,
  trendValue,
  trendLabel = '전기 대비',
  description,
  icon,
  status,
  loading = false,
  onClick,
  className
}: ProfitabilityMetricCardProps) {
  // 값 포맷팅
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val

    switch (metricType) {
      case 'currency':
        return new Intl.NumberFormat('ko-KR', {
          style: 'currency',
          currency: 'KRW',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'decimal':
        return val.toFixed(2)
      case 'count':
      default:
        return val.toLocaleString('ko-KR')
    }
  }

  // 트렌드 자동 계산
  const calculateTrend = (): { direction: TrendDirection; value: number } | null => {
    if (trend && trendValue !== undefined) {
      return { direction: trend, value: trendValue }
    }

    if (previousValue !== undefined && typeof value === 'number' && typeof previousValue === 'number') {
      const diff = value - previousValue
      const percentage = previousValue !== 0 ? (diff / previousValue) * 100 : 0
      
      return {
        direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
        value: metricType === 'percentage' ? diff : percentage
      }
    }

    return null
  }

  const trendData = calculateTrend()

  // 상태에 따른 색상
  const getStatusColor = () => {
    if (status) {
      switch (status) {
        case 'success':
          return 'text-secondary border-secondary/20 bg-secondary/5'
        case 'warning':
          return 'text-yellow-600 border-yellow-600/20 bg-yellow-50 dark:text-yellow-500 dark:bg-yellow-900/10'
        case 'danger':
          return 'text-destructive border-destructive/20 bg-destructive/5'
        default:
          return ''
      }
    }

    // 트렌드 기반 자동 색상
    if (trendData?.direction === 'up') {
      return metricType === 'currency' || title.includes('매출') || title.includes('이익') 
        ? 'border-secondary/20' 
        : title.includes('비용') || title.includes('원가')
        ? 'border-destructive/20'
        : ''
    } else if (trendData?.direction === 'down') {
      return metricType === 'currency' || title.includes('매출') || title.includes('이익')
        ? 'border-destructive/20'
        : title.includes('비용') || title.includes('원가')
        ? 'border-secondary/20'
        : ''
    }

    return ''
  }

  // 트렌드 아이콘
  const getTrendIcon = () => {
    if (!trendData) return null

    const iconClass = "w-4 h-4"
    
    switch (trendData.direction) {
      case 'up':
        return <TrendingUp className={iconClass} />
      case 'down':
        return <TrendingDown className={iconClass} />
      default:
        return <Minus className={iconClass} />
    }
  }

  // 트렌드 색상
  const getTrendColor = () => {
    if (!trendData) return ''

    const isPositiveMetric = metricType === 'currency' || 
      title.includes('매출') || 
      title.includes('이익') || 
      title.includes('마진')
    
    const isNegativeMetric = title.includes('비용') || 
      title.includes('원가') || 
      title.includes('손실')

    if (trendData.direction === 'up') {
      return isPositiveMetric ? 'text-secondary' : 
             isNegativeMetric ? 'text-destructive' : 
             'text-muted-foreground'
    } else if (trendData.direction === 'down') {
      return isPositiveMetric ? 'text-destructive' : 
             isNegativeMetric ? 'text-secondary' : 
             'text-muted-foreground'
    }

    return 'text-muted-foreground'
  }

  // 화살표 아이콘
  const getArrowIcon = () => {
    if (!trendData) return null

    const iconClass = "w-5 h-5"
    
    switch (trendData.direction) {
      case 'up':
        return <ArrowUpRight className={iconClass} />
      case 'down':
        return <ArrowDownRight className={iconClass} />
      default:
        return <ArrowRight className={iconClass} />
    }
  }

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        getStatusColor(),
        className
      )}
      onClick={onClick}
    >
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs">
                {description}
              </CardDescription>
            )}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-muted rounded animate-pulse" />
            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <div className="space-y-2">
            {/* 현재 값 */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight">
                {formatValue(value)}
              </span>
              {previousValue !== undefined && (
                <span className="text-sm text-muted-foreground">
                  이전: {formatValue(previousValue)}
                </span>
              )}
            </div>

            {/* 트렌드 표시 */}
            {trendData && (
              <div className="flex items-center gap-2">
                <div className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium",
                  getTrendColor()
                )}>
                  {getTrendIcon()}
                  <span>
                    {trendData.direction !== 'neutral' && trendData.value > 0 && '+'}
                    {metricType === 'percentage' 
                      ? `${trendData.value.toFixed(1)}%p`
                      : `${trendData.value.toFixed(1)}%`
                    }
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {trendLabel}
                </span>
              </div>
            )}
          </div>
        )}

        {/* 클릭 가능 표시 */}
        {onClick && !loading && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {getArrowIcon()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}