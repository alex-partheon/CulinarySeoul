import { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '../../lib/utils'

interface AuthLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
}

/**
 * 인증 페이지용 레이아웃 (로그인, 회원가입 등)
 * - 중앙 정렬된 카드 형태
 * - 배경 그라데이션 효과
 * - 반응형 디자인
 * 
 * @example
 * ```tsx
 * <AuthLayout 
 *   title="로그인" 
 *   subtitle="계정에 로그인하세요"
 * >
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
export function AuthLayout({ 
  children, 
  title, 
  subtitle,
  className 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.08),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.08),transparent)] pointer-events-none" />
      
      {/* 헤더 */}
      <header className="relative z-10 p-6">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="font-medium">홈으로</span>
        </Link>
      </header>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className={cn(
          "w-full max-w-md",
          className
        )}>
          {/* 로고 및 타이틀 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              CulinarySeoul
            </h1>
            {title && (
              <h2 className="text-2xl font-semibold text-foreground mt-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground mt-2">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* 카드 컨테이너 */}
          <div className="bg-card/80 backdrop-blur-md rounded-2xl shadow-xl border border-border p-8">
            {children}
          </div>
          
          {/* 추가 링크 */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              문제가 있으신가요?{' '}
              <Link 
                to="/support" 
                className="text-primary hover:underline"
              >
                도움말 센터
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* 푸터 */}
      <footer className="relative z-10 p-6 text-center text-sm text-muted-foreground">
        <p>© 2024 CulinarySeoul. All rights reserved.</p>
      </footer>
    </div>
  )
}

/**
 * 인증 카드 헤더
 * 카드 내부의 제목 섹션
 */
export function AuthCardHeader({ 
  title, 
  subtitle 
}: { 
  title: string
  subtitle?: string 
}) {
  return (
    <div className="space-y-2 text-center mb-6">
      <h3 className="text-xl font-semibold text-foreground">
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
 * 인증 페이지 푸터 링크
 * 로그인/회원가입 전환 링크 등
 */
export function AuthFooterLink({ 
  text, 
  linkText, 
  href 
}: { 
  text: string
  linkText: string
  href: string 
}) {
  return (
    <div className="mt-6 text-center text-sm">
      <span className="text-muted-foreground">{text} </span>
      <Link 
        to={href} 
        className="text-primary hover:underline font-medium"
      >
        {linkText}
      </Link>
    </div>
  )
}