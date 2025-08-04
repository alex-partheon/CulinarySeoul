import { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface AuthCardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'minimal'
}

/**
 * 인증 페이지용 카드 컴포넌트
 * - Glassmorphism 디자인
 * - 여러 변형 지원
 * - 반응형 및 접근성 최적화
 */
export function AuthCard({ 
  children, 
  className,
  variant = 'default'
}: AuthCardProps) {
  const variants = {
    default: [
      "relative",
      "bg-gradient-to-br from-card/90 to-card/70",
      "backdrop-blur-xl",
      "border border-border/50",
      "rounded-2xl",
      "shadow-xl shadow-primary/5",
      "p-8"
    ],
    elevated: [
      "relative",
      "bg-gradient-to-br from-card/95 to-card/80",
      "backdrop-blur-xl",
      "border border-border/60",
      "rounded-2xl",
      "shadow-2xl shadow-primary/10",
      "p-8",
      "before:absolute before:inset-0",
      "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
      "before:rounded-2xl before:pointer-events-none"
    ],
    minimal: [
      "relative",
      "bg-card/60",
      "backdrop-blur-md",
      "border border-border/30",
      "rounded-xl",
      "shadow-lg shadow-primary/3",
      "p-6"
    ]
  }

  return (
    <div className={cn(variants[variant], className)}>
      {/* 반사 효과 (elevated variant용) */}
      {variant === 'elevated' && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />
      )}
      
      {/* 내용 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

/**
 * 인증 카드 헤더
 */
interface AuthCardHeaderProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export function AuthCardHeader({ 
  title, 
  subtitle, 
  icon,
  className 
}: AuthCardHeaderProps) {
  return (
    <div className={cn("text-center mb-8", className)}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/**
 * 인증 카드 푸터
 */
interface AuthCardFooterProps {
  children: ReactNode
  className?: string
}

export function AuthCardFooter({ 
  children, 
  className 
}: AuthCardFooterProps) {
  return (
    <div className={cn("mt-6 pt-6 border-t border-border/50", className)}>
      {children}
    </div>
  )
}