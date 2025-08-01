import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'
import { Button } from '@/components/ui/button'
import { 
  ChevronLeft, 
  Menu,
  Home,
  Building2,
  Package,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Settings,
  Utensils,
  Users,
  Megaphone
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { 
  BrandSwitcher, 
  GlobalSearch, 
  NotificationCenter, 
  UserProfileMenu 
} from '@/components/dashboard/shared'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isCompanyDashboard = location.pathname.startsWith('/company')
  const isBrandDashboard = location.pathname.startsWith('/brand')

  const companyNavigation = [
    {
      name: '대시보드',
      href: '/company',
      icon: Home,
    },
    {
      name: '브랜드 관리',
      href: '/company/brands',
      icon: Building2,
    },
    {
      name: '재고 관리',
      href: '/company/inventory',
      icon: Package,
    },
    {
      name: '매출관리',
      href: '/company/sales',
      icon: DollarSign,
      badge: '준비중',
      disabled: true
    },
    {
      name: '주문 관리',
      href: '/company/orders',
      icon: ShoppingBag,
    },
    {
      name: '분석 & 리포트',
      href: '/company/analytics',
      icon: BarChart3,
    },
    {
      name: '시스템 관리',
      href: '/company/system',
      icon: Settings,
      subMenu: [
        { name: '사용자 관리', href: '/company/system/users' },
        { name: '권한 설정', href: '/company/system/permissions' },
        { name: '시스템 설정', href: '/company/system/settings' },
        { name: '감사 로그', href: '/company/system/audit-logs' },
      ]
    }
  ]

  const brandNavigation = [
    {
      name: '대시보드',
      href: '/brand',
      icon: Home,
    },
    {
      name: '메뉴 관리',
      href: '/brand/menu',
      icon: Utensils,
    },
    {
      name: '재고 현황',
      href: '/brand/inventory',
      icon: Package,
    },
    {
      name: '주문 현황',
      href: '/brand/orders',
      icon: ShoppingBag,
      badge: '12',
    },
    {
      name: '고객 관리',
      href: '/brand/customers',
      icon: Users,
    },
    {
      name: '마케팅',
      href: '/brand/marketing',
      icon: Megaphone,
    },
    {
      name: '매출관리',
      href: '/brand/sales',
      icon: DollarSign,
      badge: '준비중',
      disabled: true
    },
    {
      name: '매출 분석',
      href: '/brand/analytics',
      icon: BarChart3,
    }
  ]

  const navigation = isCompanyDashboard ? companyNavigation : brandNavigation

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300 shadow-sm",
        sidebarCollapsed ? "w-[70px]" : "w-64",
        !sidebarOpen && "hidden lg:flex"
      )}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-primary/5 to-transparent">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
                  C
                </div>
                <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  CulinarySeoul
                </span>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex rounded-lg hover:bg-primary/10 transition-colors",
              sidebarCollapsed && "mx-auto"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform",
              sidebarCollapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <SidebarContent 
            navigation={navigation} 
            collapsed={sidebarCollapsed}
            currentPath={location.pathname}
          />
        </nav>

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
            className="lg:hidden rounded-lg hover:bg-primary/10"
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
            {/* Brand Switcher - Only show on company dashboard */}
            {isCompanyDashboard && (
              <BrandSwitcher className="hidden md:flex" />
            )}
            
            {/* Global Search */}
            <GlobalSearch className="hidden sm:flex" />
            
            {/* Notifications */}
            <NotificationCenter />
            
            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-muted/30">
          {children}
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

function SidebarContent({ 
  navigation, 
  collapsed,
  currentPath 
}: { 
  navigation: any[]
  collapsed: boolean
  currentPath: string
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  
  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }
  
  return (
    <div className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = currentPath === item.href || 
                       (item.subMenu && item.subMenu.some((sub: any) => currentPath === sub.href))
        const isExpanded = expandedItems.includes(item.name)
        
        if (item.subMenu) {
          return (
            <div key={item.name}>
              <button
                onClick={() => toggleExpanded(item.name)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-primary/10 text-sidebar-foreground hover:text-primary',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                disabled={item.disabled}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-white/20" 
                    : "bg-primary/10 group-hover:bg-primary/20"
                )}>
                  <Icon className="h-4 w-4 shrink-0" />
                </div>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronLeft className={cn(
                      "h-4 w-4 transition-transform opacity-60",
                      isExpanded && "-rotate-90"
                    )} />
                  </>
                )}
              </button>
              {!collapsed && isExpanded && (
                <div className="ml-5 mt-1 space-y-1 border-l border-primary/20 pl-4">
                  {item.subMenu.map((subItem: any) => {
                    const isSubActive = currentPath === subItem.href
                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isSubActive
                            ? 'bg-primary/10 font-medium text-primary'
                            : 'hover:bg-primary/5 hover:text-primary text-muted-foreground'
                        )}
                      >
                        {subItem.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        }
        
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
              isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'hover:bg-primary/10 text-sidebar-foreground hover:text-primary',
              item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-white/20" 
                : "bg-primary/10 group-hover:bg-primary/20"
            )}>
              <Icon className="h-4 w-4 shrink-0" />
            </div>
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <Badge 
                    variant={item.disabled ? "secondary" : isActive ? "secondary" : "default"} 
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