import { ChefHat, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface AuthLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'branded' | 'minimal' | 'dots'
  text?: string
  className?: string
}

/**
 * 인증 페이지용 로딩 스피너
 * - 여러 변형 및 크기 지원
 * - 브랜드 일관성 유지
 * - 접근성 최적화
 */
export function AuthLoadingSpinner({ 
  size = 'md',
  variant = 'default',
  text = "로딩 중...",
  className 
}: AuthLoadingSpinnerProps) {
  const sizes = {
    sm: {
      spinner: 'w-4 h-4',
      text: 'text-sm',
      container: 'gap-2'
    },
    md: {
      spinner: 'w-6 h-6',
      text: 'text-base',
      container: 'gap-3'
    },
    lg: {
      spinner: 'w-8 h-8',
      text: 'text-lg',
      container: 'gap-4'
    }
  }

  const currentSize = sizes[size]

  if (variant === 'branded') {
    return (
      <div className={cn("flex flex-col items-center justify-center", currentSize.container, className)}>
        <div className="relative">
          {/* 외부 회전 링 */}
          <div className={cn(
            "animate-spin rounded-full border-2 border-primary/20 border-t-primary",
            currentSize.spinner
          )} />
          
          {/* 중앙 브랜드 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChefHat className={cn(
              "text-primary animate-pulse",
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            )} />
          </div>
        </div>
        
        {text && (
          <p className={cn("text-muted-foreground font-medium", currentSize.text)}>
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center", currentSize.container, className)}>
        <Loader2 className={cn("animate-spin text-muted-foreground", currentSize.spinner)} />
        {text && (
          <span className={cn("text-muted-foreground", currentSize.text)}>
            {text}
          </span>
        )}
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className={cn("flex items-center justify-center", currentSize.container, className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={cn(
                "rounded-full bg-primary animate-bounce",
                size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
              )}
              style={{
                animationDelay: `${index * 0.15}s`
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn("text-muted-foreground ml-3", currentSize.text)}>
            {text}
          </span>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center justify-center", currentSize.container, className)}>
      <div className="relative">
        {/* 그라데이션 스피너 */}
        <div className={cn(
          "animate-spin rounded-full bg-gradient-conic from-primary via-secondary to-primary",
          currentSize.spinner,
          "p-0.5"
        )}>
          <div className={cn(
            "rounded-full bg-background",
            currentSize.spinner
          )} />
        </div>
      </div>
      
      {text && (
        <p className={cn("text-muted-foreground font-medium", currentSize.text)}>
          {text}
        </p>
      )}
    </div>
  )
}

/**
 * 페이지 전체 로딩 오버레이
 */
interface LoadingOverlayProps {
  isVisible: boolean
  text?: string
  variant?: 'default' | 'branded'
}

export function LoadingOverlay({ 
  isVisible, 
  text = "처리 중입니다...",
  variant = 'default'
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-card/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-xl">
        <AuthLoadingSpinner 
          size="lg" 
          variant={variant}
          text={text}
        />
      </div>
    </div>
  )
}

/**
 * 버튼 내 로딩 스피너
 */
interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function ButtonLoading({ 
  isLoading, 
  children, 
  loadingText,
  className 
}: ButtonLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      <span>
        {isLoading && loadingText ? loadingText : children}
      </span>
    </div>
  )
}

/**
 * 스켈레톤 로더
 */
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ 
  className,
  variant = 'rectangular'
}: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded'
  }

  return (
    <div className={cn(
      "bg-muted animate-pulse",
      variants[variant],
      className
    )} />
  )
}

/**
 * 카드 스켈레톤
 */
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-4/6" />
      </div>
      
      <div className="flex justify-between pt-4">
        <Skeleton variant="rectangular" className="w-20 h-8" />
        <Skeleton variant="rectangular" className="w-16 h-8" />
      </div>
    </div>
  )
}