import { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Navigation } from '../ui/navigation'
import { UserMenu } from '../ui/user-menu'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * 일반 페이지용 메인 레이아웃
 * - 상단 고정 네비게이션
 * - 사용자 메뉴
 * - 반응형 디자인
 * 
 * @example
 * ```tsx
 * <MainLayout>
 *   <div>페이지 콘텐츠</div>
 * </MainLayout>
 * ```
 */
export function MainLayout({ children, className }: MainLayoutProps) {
  const location = useLocation()
  const { user, signOut } = useAuth()
  
  // 네비게이션 아이템 정의
  const navItems = [
    { id: 'home', name: '홈', href: '/' },
    { id: 'style-guide', name: '스타일가이드', href: '/style-guide' },
    { id: 'company', name: '회사 대시보드', href: '/company' },
    { id: 'brand', name: '브랜드 대시보드', href: '/brand' }
  ]
  
  // 현재 활성화된 네비게이션 아이템 찾기
  const activeItem = navItems.find(item => item.href === location.pathname)?.id || 'home'
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 상단 네비게이션 */}
      <header className="relative z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <nav className="relative bg-card/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* 로고 및 네비게이션 */}
              <div className="flex items-center flex-1">
                <Navigation
                  title="CulinarySeoul"
                  items={navItems}
                  activeItem={activeItem}
                  sticky={false}
                  className="border-0 bg-transparent"
                />
              </div>
              
              {/* 사용자 메뉴 */}
              {user && (
                <div className="flex items-center ml-4">
                  <UserMenu 
                    user={{
                      email: user.email || '',
                      name: user.email?.split('@')[0]
                    }}
                    onSignOut={signOut}
                  />
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
      
      {/* 메인 콘텐츠 */}
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      {/* 푸터 (옵션) */}
      <footer className="bg-card/50 border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            © 2024 CulinarySeoul. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * 콘텐츠 컨테이너 컴포넌트
 * MainLayout 내에서 콘텐츠를 감싸는 용도
 */
export function ContentContainer({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={cn("container mx-auto px-4 py-8", className)}>
      {children}
    </div>
  )
}

/**
 * 페이지 헤더 컴포넌트
 * 페이지 제목과 설명을 표시
 */
export function PageHeader({ 
  title, 
  subtitle,
  children
}: { 
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-4">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}