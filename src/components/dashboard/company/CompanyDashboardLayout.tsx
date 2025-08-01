import React, { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  BrandSwitcher, 
  GlobalSearch, 
  NotificationCenter, 
  UserProfileMenu 
} from '@/components/dashboard/shared'
import { 
  ChevronLeft,
  ChevronRight,
  Menu,
  Home,
  Building2,
  Package,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Settings,
  Users,
  ShieldCheck,
  FileText,
  AlertCircle,
  Activity,
  Clock,
  Wifi,
  WifiOff,
  Store,
  TrendingUp,
  Boxes,
  ClipboardList,
  UserCog,
  Shield,
  Sliders,
  ScrollText
} from 'lucide-react'

interface CompanyDashboardLayoutProps {
  children?: React.ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
  disabled?: boolean
  subMenu?: {
    name: string
    href: string
    icon?: React.ElementType
  }[]
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

export function CompanyDashboardLayout({ children }: CompanyDashboardLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['company-overview'])
  const [activeUsers, setActiveUsers] = useState(12)
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline'>('online')
  const [lastSync, setLastSync] = useState(new Date())

  // Debug logging on render
  useEffect(() => {
    console.log('[CompanyDashboardLayout] Component rendered', {
      pathname: location.pathname,
      children: !!children,
      hasOutlet: true, // Always true since we use <Outlet />
      timestamp: new Date().toISOString()
    })
  }, [location.pathname, children])

  // Navigation sections with organized structure
  const navigationSections: NavigationSection[] = [
    {
      title: '회사 개요',
      items: [
        {
          name: '대시보드',
          href: '/company',
          icon: Home,
        },
        {
          name: '실시간 현황',
          href: '/company/realtime',
          icon: Activity,
          badge: 'New'
        }
      ]
    },
    {
      title: '브랜드 관리',
      items: [
        {
          name: '브랜드 목록',
          href: '/company/brands',
          icon: Building2,
        },
        {
          name: '매장 관리',
          href: '/company/stores',
          icon: Store,
        },
        {
          name: '성과 분석',
          href: '/company/brands/performance',
          icon: TrendingUp,
        }
      ]
    },
    {
      title: '재고 관리',
      items: [
        {
          name: '통합 재고 현황',
          href: '/company/inventory',
          icon: Package,
        },
        {
          name: '발주 관리',
          href: '/company/inventory/orders',
          icon: ClipboardList,
        },
        {
          name: '재고 이동',
          href: '/company/inventory/transfers',
          icon: Boxes,
        }
      ]
    },
    {
      title: '매출 관리',
      items: [
        {
          name: '매출 현황',
          href: '/company/sales',
          icon: DollarSign,
          badge: '구현중',
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
        }
      ]
    },
    {
      title: '시스템 관리',
      items: [
        {
          name: '사용자 관리',
          href: '/company/system/users',
          icon: UserCog,
        },
        {
          name: '권한 설정',
          href: '/company/system/permissions',
          icon: Shield,
        },
        {
          name: '시스템 설정',
          href: '/company/system/settings',
          icon: Sliders,
        },
        {
          name: '감사 로그',
          href: '/company/system/audit-logs',
          icon: ScrollText,
        }
      ]
    }
  ]

  // Update real-time indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 5) + 10)
      setLastSync(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Toggle section expansion
  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ name: '홈', href: '/' }]
    
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      let name = path
      
      // Map path segments to Korean names
      const pathMap: Record<string, string> = {
        'company': '회사 관리',
        'brands': '브랜드 관리',
        'inventory': '재고 관리',
        'sales': '매출 관리',
        'orders': '주문 관리',
        'analytics': '분석 & 리포트',
        'system': '시스템 관리',
        'users': '사용자 관리',
        'permissions': '권한 설정',
        'settings': '시스템 설정',
        'audit-logs': '감사 로그',
        'stores': '매장 관리',
        'performance': '성과 분석',
        'transfers': '재고 이동',
        'realtime': '실시간 현황'
      }
      
      name = pathMap[path] || path
      breadcrumbs.push({ name, href: currentPath })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300 shadow-lg",
        sidebarCollapsed ? "w-[70px]" : "w-72",
        !sidebarOpen && "hidden lg:flex"
      )}
      aria-label="사이드바 네비게이션">
        {/* Sidebar Header with Company Logo */}
        <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-primary/10 to-transparent border-b">
          {!sidebarCollapsed && (
            <Link to="/" className="flex items-center gap-3 group" aria-label="홈으로 이동">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all duration-200">
                CS
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  CulinarySeoul
                </span>
                <span className="text-xs text-muted-foreground">회사 관리 시스템</span>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex rounded-lg hover:bg-primary/10 transition-all duration-200",
              sidebarCollapsed && "mx-auto"
            )}
            aria-label={sidebarCollapsed ? "사이드바 확장" : "사이드바 축소"}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-200",
              sidebarCollapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Real-time Indicators */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b bg-muted/30">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">시스템 상태</span>
                <div className="flex items-center gap-1">
                  {systemStatus === 'online' ? (
                    <>
                      <Wifi className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 font-medium">온라인</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 text-red-500" />
                      <span className="text-red-600 font-medium">오프라인</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">활성 사용자</span>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-blue-500" />
                  <span className="font-medium">{activeUsers}명</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">마지막 동기화</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">
                    {lastSync.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="메인 네비게이션">
          <div className="space-y-4">
            {navigationSections.map((section) => {
              const isExpanded = expandedSections.includes(section.title)
              
              return (
                <div key={section.title}>
                  {!sidebarCollapsed && (
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors duration-200"
                      aria-expanded={isExpanded}
                      aria-controls={`section-${section.title}`}
                    >
                      <span>{section.title}</span>
                      <ChevronRight className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )} />
                    </button>
                  )}
                  
                  <div 
                    id={`section-${section.title}`}
                    className={cn(
                      "space-y-1 mt-1",
                      !sidebarCollapsed && !isExpanded && "hidden"
                    )}
                  >
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = location.pathname === item.href ||
                                     location.pathname.startsWith(item.href + '/')
                      
                      // Debug route matching
                      if (isActive) {
                        console.log('[CompanyDashboardLayout] Active route detected', {
                          itemHref: item.href,
                          pathname: location.pathname,
                          isExactMatch: location.pathname === item.href,
                          isChildMatch: location.pathname.startsWith(item.href + '/'),
                          timestamp: new Date().toISOString()
                        })
                      }
                      
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                            isActive 
                              ? 'bg-primary text-primary-foreground shadow-md' 
                              : 'hover:bg-primary/10 text-sidebar-foreground hover:text-primary',
                            item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                          aria-disabled={item.disabled}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                            isActive 
                              ? "bg-white/20 shadow-sm" 
                              : "bg-primary/10 group-hover:bg-primary/20"
                          )}>
                            <Icon className="h-4 w-4 shrink-0" />
                          </div>
                          {!sidebarCollapsed && (
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
                </div>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>v1.0.0 · 지원센터</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "flex flex-col transition-all duration-300",
        sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-72"
      )}>
        {/* Enhanced Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-sm">
          <div className="flex h-16 items-center gap-4 px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden rounded-lg hover:bg-primary/10"
              aria-label="메뉴 열기"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumb Navigation */}
            <nav className="flex-1" aria-label="브레드크럼">
              <ol className="flex items-center gap-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    {index === breadcrumbs.length - 1 ? (
                      <li className="font-medium text-foreground">{crumb.name}</li>
                    ) : (
                      <li>
                        <Link 
                          to={crumb.href} 
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {crumb.name}
                        </Link>
                      </li>
                    )}
                  </React.Fragment>
                ))}
              </ol>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Brand Switcher */}
              <BrandSwitcher className="hidden md:flex" />
              
              {/* Global Search */}
              <GlobalSearch className="hidden sm:flex" />
              
              {/* Notifications */}
              <NotificationCenter />
              
              {/* User Profile Menu */}
              <UserProfileMenu />
            </div>
          </div>
        </header>

        {/* Main Content with proper spacing */}
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto p-6">
            {(() => {
              console.log('[CompanyDashboardLayout] Rendering main content', {
                hasChildren: !!children,
                willRenderOutlet: !children,
                pathname: location.pathname,
                timestamp: new Date().toISOString()
              })
              return children || <Outlet />
            })()}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-200"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Mobile Sidebar */}
          <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 lg:hidden",
            "animate-in slide-in-from-left duration-200"
          )}>
            {/* Same sidebar content renders here for mobile */}
          </aside>
        </>
      )}
    </div>
  )
}