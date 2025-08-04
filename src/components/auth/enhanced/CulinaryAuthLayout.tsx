import { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../../lib/utils'
import { ArrowLeft, ChefHat } from 'lucide-react'

interface CulinaryAuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
}

/**
 * CulinarySeoul ERP 전용 인증 레이아웃
 * - 현대적인 glassmorphism 디자인
 * - 브랜드 그라데이션 및 패턴
 * - 완전한 반응형 지원
 * - 접근성 최적화
 */
export function CulinaryAuthLayout({ 
  children, 
  title, 
  subtitle,
  className,
  showBackButton = true,
  backButtonText = "홈으로",
  backButtonHref = "/"
}: CulinaryAuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      
      {/* 고급 배경 패턴 - Glassmorphism 효과 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 메인 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/8" />
        
        {/* 애니메이션 오브 */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-radial from-accent/8 to-transparent rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        
        {/* 기하학적 패턴 */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      {/* Skip to content link - 접근성 */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium"
      >
        메인 콘텐츠로 건너뛰기
      </a>
      
      {/* 헤더 */}
      <header className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          {showBackButton && (
            <Link 
              to={backButtonHref}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">{backButtonText}</span>
            </Link>
          )}
          
          {/* 로고 */}
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ChefHat className="w-5 h-5" />
              <span className="text-sm font-medium">CulinarySeoul ERP</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* 메인 콘텐츠 */}
      <main 
        id="main-content"
        className="flex-1 flex items-center justify-center p-6 relative z-10"
      >
        <div className={cn(
          "w-full max-w-md",
          className
        )}>
          {/* 브랜드 헤더 */}
          <div className="text-center mb-10">
            {/* 메인 로고 */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-0.5 mb-4">
                <div className="flex items-center justify-center w-full h-full rounded-2xl bg-background">
                  <ChefHat className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
            
            {/* 브랜드 타이틀 */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              CulinarySeoul
            </h1>
            <p className="text-sm text-muted-foreground mb-8">
              스마트 레스토랑 통합 관리 시스템
            </p>
            
            {/* 페이지 타이틀 */}
            {title && (
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* 메인 카드 - Glassmorphism */}
          <div className="relative">
            {/* 카드 배경 */}
            <div className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl" />
            
            {/* 반사 효과 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
            
            {/* 카드 내용 */}
            <div className="relative p-8">
              {children}
            </div>
          </div>
          
          {/* 하단 링크 */}
          <div className="mt-8 text-center">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                도움이 필요하신가요?{' '}
                <Link 
                  to="/help" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  도움말 센터
                </Link>
              </p>
              <p>
                또는{' '}
                <Link 
                  to="/contact" 
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  문의하기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <footer className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 CulinarySeoul. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link 
                to="/privacy" 
                className="hover:text-foreground transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link 
                to="/terms" 
                className="hover:text-foreground transition-colors"
              >
                이용약관
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * 인증 카드 헤더
 * 카드 내부의 제목 및 설명 섹션
 */
export function AuthCardHeader({ 
  title, 
  subtitle,
  icon
}: { 
  title: string
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="text-center mb-8">
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/**
 * 인증 페이지 하단 링크
 * 로그인/회원가입 전환 등
 */
export function AuthFooterLink({ 
  text, 
  linkText, 
  href,
  className
}: { 
  text: string
  linkText: string
  href: string
  className?: string
}) {
  return (
    <div className={cn("mt-6 text-center", className)}>
      <p className="text-sm text-muted-foreground">
        {text}{' '}
        <Link 
          to={href} 
          className="text-primary hover:text-primary/80 font-medium transition-colors underline-offset-4 hover:underline"
        >
          {linkText}
        </Link>
      </p>
    </div>
  )
}