import React from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface MarginVarianceIndicatorProps {
  targetMargin: number // 목표 마진율 (%)
  actualMargin: number // 실제 마진율 (%)
  showRecommendations?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MarginVarianceIndicator({
  targetMargin,
  actualMargin,
  showRecommendations = true,
  size = 'md',
  className
}: MarginVarianceIndicatorProps) {
  // 목표 대비 차이 계산
  const variance = actualMargin - targetMargin
  const variancePercentage = targetMargin > 0 
    ? ((actualMargin - targetMargin) / targetMargin) * 100
    : 0

  // 상태 결정
  const getStatus = () => {
    if (variance >= 0) return 'above'
    if (variance >= -targetMargin * 0.1) return 'near' // 목표의 90% 이상
    return 'below'
  }

  const status = getStatus()

  // 색상 클래스
  const getColorClasses = () => {
    switch (status) {
      case 'above':
        return {
          text: 'text-secondary',
          bg: 'bg-secondary/10',
          progress: 'bg-secondary',
          icon: 'text-secondary'
        }
      case 'near':
        return {
          text: 'text-yellow-600 dark:text-yellow-500',
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          progress: 'bg-yellow-500',
          icon: 'text-yellow-600 dark:text-yellow-500'
        }
      case 'below':
        return {
          text: 'text-destructive',
          bg: 'bg-destructive/10',
          progress: 'bg-destructive',
          icon: 'text-destructive'
        }
    }
  }

  const colors = getColorClasses()

  // 크기별 스타일
  const sizeClasses = {
    sm: {
      container: 'p-3',
      title: 'text-xs',
      value: 'text-lg',
      variance: 'text-sm',
      progress: 'h-1.5',
      icon: 'w-4 h-4'
    },
    md: {
      container: 'p-4',
      title: 'text-sm',
      value: 'text-2xl',
      variance: 'text-base',
      progress: 'h-2',
      icon: 'w-5 h-5'
    },
    lg: {
      container: 'p-6',
      title: 'text-base',
      value: 'text-3xl',
      variance: 'text-lg',
      progress: 'h-3',
      icon: 'w-6 h-6'
    }
  }

  const sizes = sizeClasses[size]

  // 아이콘 선택
  const getIcon = () => {
    if (variance > 0) return <TrendingUp className={sizes.icon} />
    if (variance < 0) return <TrendingDown className={sizes.icon} />
    return <Minus className={sizes.icon} />
  }

  // 상태 아이콘
  const getStatusIcon = () => {
    switch (status) {
      case 'above':
        return <CheckCircle className={cn(sizes.icon, colors.icon)} />
      case 'near':
        return <Info className={cn(sizes.icon, colors.icon)} />
      case 'below':
        return <AlertTriangle className={cn(sizes.icon, colors.icon)} />
    }
  }

  // 추천사항
  const getRecommendations = () => {
    if (status === 'above') {
      return [
        '목표 마진율을 달성했습니다!',
        '현재 가격 정책을 유지하세요',
        '원가 관리를 지속적으로 모니터링하세요'
      ]
    } else if (status === 'near') {
      return [
        '목표 마진율에 근접했습니다',
        '저수익 메뉴의 가격 조정을 검토하세요',
        '재료 공급처 협상을 통해 원가를 절감하세요'
      ]
    } else {
      return [
        '긴급한 개선이 필요합니다',
        '메뉴 가격을 재검토하세요',
        '원가 절감 방안을 즉시 실행하세요',
        '저수익 메뉴의 판매 중단을 고려하세요'
      ]
    }
  }

  // Progress 값 계산 (0-100)
  const progressValue = Math.min(100, Math.max(0, (actualMargin / targetMargin) * 100))

  return (
    <div className={cn("space-y-4", className)}>
      {/* 메인 인디케이터 */}
      <div className={cn(
        "rounded-lg border",
        colors.bg,
        sizes.container
      )}>
        <div className="space-y-3">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={cn("font-medium", sizes.title)}>
                마진율 목표 대비 현황
              </span>
            </div>
            {getIcon()}
          </div>

          {/* 값 표시 */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className={cn("font-bold", sizes.value, colors.text)}>
                {actualMargin.toFixed(1)}%
              </span>
              <span className={cn("text-muted-foreground", sizes.title)}>
                / 목표 {targetMargin}%
              </span>
            </div>

            {/* 차이 표시 */}
            <div className={cn("flex items-center gap-1", sizes.variance)}>
              <span className={colors.text}>
                {variance > 0 ? '+' : ''}{variance.toFixed(1)}%p
              </span>
              <span className="text-muted-foreground">
                ({variancePercentage > 0 ? '+' : ''}{variancePercentage.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="relative">
              <Progress 
                value={progressValue} 
                className={cn(sizes.progress, "bg-muted")}
              />
              {/* 목표선 표시 */}
              <div 
                className="absolute top-0 w-0.5 bg-foreground/50"
                style={{ 
                  left: '100%',
                  height: size === 'sm' ? '6px' : size === 'md' ? '8px' : '12px'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>목표 {targetMargin}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 추천사항 */}
      {showRecommendations && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            개선 권장사항
          </h4>
          <ul className="space-y-1">
            {getRecommendations().map((recommendation, index) => (
              <li 
                key={index} 
                className="text-sm text-muted-foreground flex items-start gap-2"
              >
                <span className="text-primary mt-1">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 간단한 통계 */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">실제</p>
          <p className={cn("font-semibold", sizes.variance)}>
            {actualMargin.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-lg border bg-card p-3">
          <p className="text-xs text-muted-foreground">목표</p>
          <p className={cn("font-semibold", sizes.variance)}>
            {targetMargin.toFixed(1)}%
          </p>
        </div>
        <div className={cn("rounded-lg border p-3", colors.bg)}>
          <p className="text-xs text-muted-foreground">차이</p>
          <p className={cn("font-semibold", sizes.variance, colors.text)}>
            {variance > 0 ? '+' : ''}{variance.toFixed(1)}%p
          </p>
        </div>
      </div>
    </div>
  )
}