import React, { useState, useMemo } from 'react'
import { Link, useLocation, useParams, Outlet } from 'react-router'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { 
  ChevronLeft, 
  Menu,
  Home,
  Store,
  Package,
  BarChart3,
  Globe,
  Megaphone,
  Settings,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Building2
} from 'lucide-react'
import { 
  NotificationCenter, 
  UserProfileMenu 
} from '@/components/dashboard/shared'
import { CompanyConnectionStatus } from '@/components/dashboard/shared/CompanyConnectionStatus'

interface BrandDashboardLayoutProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
}

// Mock brand data - should come from context/API
const mockBrandData = {
  id: 'brand_1',
  name: '밀랍',
  logo: '/brand-logos/millab.png', // Would be actual logo URL
  primaryColor: '#E97132', // Orange color for 밀랍
  secondaryColor: '#FFF4ED',
  favicon: '/favicons/millab.ico',
  separationReadiness: 85, // percentage
  healthScore: 92,
  isIndependentMode: false
}

export function BrandDashboardLayout({ 
  children, 
  title = "브랜드 관리 대시보드", 
  subtitle = "CulinarySeoul 브랜드 현황" 
}: BrandDashboardLayoutProps) {
  const location = useLocation()
  const { brandId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isIndependentMode, setIsIndependentMode] = useState(mockBrandData.isIndependentMode)

  // Brand-specific navigation
  const brandNavigation = [
    {
      name: '브랜드 개요',
      href: `/brand/${brandId || 'dashboard'}`,
      icon: Home,
    },
    {
      name: '매장 관리',
      href: `/brand/${brandId}/stores`,
      icon: Store,
    },
    {
      name: '재고 관리',
      href: `/brand/${brandId}/inventory`,
      icon: Package,
    },
    {
      name: '매출 분석',
      href: `/brand/${brandId}/analytics`,
      icon: BarChart3,
    },
    {
      name: '웹사이트 관리',
      href: `/brand/${brandId}/website`,
      icon: Globe,
      badge: 'Beta',
    },
    {
      name: '마케팅 도구',
      href: `/brand/${brandId}/marketing`,
      icon: Megaphone,
    },
    {
      name: '브랜드 설정',
      href: `/brand/${brandId}/settings`,
      icon: Settings,
    }
  ]

  // Apply brand theming dynamically
  const brandStyles = useMemo(() => ({
    '--brand-primary': mockBrandData.primaryColor,
    '--brand-secondary': mockBrandData.secondaryColor,
  } as React.CSSProperties), [])

  // Brand health indicator
  const getBrandHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getSeparationReadinessColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 70) return 'text-blue-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-background" style={brandStyles}>
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300 shadow-sm",
        sidebarCollapsed ? "w-[70px]" : "w-64",
        !sidebarOpen && "hidden lg:flex"
      )}>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent">
          {!sidebarCollapsed && (
            <Link to={`/brand/${brandId}`} className="flex items-center gap-2 group">
              <div className="flex items-center gap-2">
                {/* Brand Logo */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-primary)]/60 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
                  {mockBrandData.name.charAt(0)}
                </div>
                <span className="text-lg font-semibold text-foreground">
                  {mockBrandData.name}
                </span>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex rounded-lg hover:bg-[var(--brand-primary)]/10 transition-colors",
              sidebarCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Brand Context Indicators */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b">
            {/* Brand Health Score */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">브랜드 건강도</span>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getBrandHealthColor(mockBrandData.healthScore)
              )}>
                <CheckCircle className="w-3 h-3" />
                {mockBrandData.healthScore}%
              </div>
            </div>

            {/* Separation Readiness */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">분리 준비도</span>
                <span className={cn(
                  "text-xs font-medium",
                  getSeparationReadinessColor(mockBrandData.separationReadiness)
                )}>
                  {mockBrandData.separationReadiness}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    mockBrandData.separationReadiness >= 90 ? 'bg-green-600' :
                    mockBrandData.separationReadiness >= 70 ? 'bg-blue-600' :
                    mockBrandData.separationReadiness >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                  )}
                  style={{ width: `${mockBrandData.separationReadiness}%` }}
                />
              </div>
            </div>

            {/* Independent Operation Mode */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">독립 운영 모드</span>
              <Switch
                checked={isIndependentMode}
                onCheckedChange={setIsIndependentMode}
                className="scale-75"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <BrandSidebarContent 
            navigation={brandNavigation} 
            collapsed={sidebarCollapsed}
            currentPath={location.pathname}
            brandColor={mockBrandData.primaryColor}
          />
        </nav>

        {/* Company Connection Indicator */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-3">
            <Link 
              to="/company" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              본사 대시보드로 이동
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex flex-col transition-all duration-300",
        sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-64"
      )}>
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6 shadow-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden rounded-lg hover:bg-[var(--brand-primary)]/10"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Company Connection Status */}
            <CompanyConnectionStatus 
              brandId={brandId || mockBrandData.id} 
              className="hidden xl:block"
            />
            
            {/* Notifications */}
            <NotificationCenter />
            
            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Independent Mode Banner */}
        {isIndependentMode && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                독립 운영 모드가 활성화되었습니다. 일부 본사 연동 기능이 제한될 수 있습니다.
              </span>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 bg-muted/30">
          {children || <Outlet />}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

function BrandSidebarContent({ 
  navigation, 
  collapsed,
  currentPath,
  brandColor
}: { 
  navigation: any[]
  collapsed: boolean
  currentPath: string
  brandColor: string
}) {
  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
              isActive 
                ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                : 'hover:bg-[var(--brand-primary)]/10 text-sidebar-foreground hover:text-[var(--brand-primary)]',
              item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-white/20" 
                : "bg-[var(--brand-primary)]/10 group-hover:bg-[var(--brand-primary)]/20"
            )}>
              <Icon className="h-4 w-4 shrink-0" />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant={isActive ? "secondary" : "default"} 
                    className={cn(
                      "ml-auto h-5 px-1.5 text-xs",
                      isActive && "bg-white/20 text-white border-white/30"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        )
      })}
    </div>
  )
}