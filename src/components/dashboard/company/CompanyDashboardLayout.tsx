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
import { BrandStoreSelector } from '@/components/dashboard/shared/BrandStoreSelector'
import { DataScopeSelector } from '@/components/shared/DataScopeSelector'
import { generateUnifiedNavigationSections, generateBreadcrumbs, NavigationSection } from '@/components/dashboard/shared/NavigationConfig'
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
  ScrollText,
  Sparkles,
  BarChart2,
  TrendingDown,
  Users2,
  Building,
  MapPin,
  CalendarDays,
  FileText as FileTextIcon,
  Bell,
  Settings2,
  Zap,
  TrendingUpIcon,
  PieChart,
  ActivityIcon
} from 'lucide-react'

interface CompanyDashboardLayoutProps {
  children?: React.ReactNode
}

// Navigation interfaces moved to shared config

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

  // Generate unified navigation sections
  const navigationSections = generateUnifiedNavigationSections('company', {
    userRole: 'admin' // TODO: Get from AuthContext
  })

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

  // Generate breadcrumbs using shared utility
  const breadcrumbs = generateBreadcrumbs(location.pathname, 'company')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-card/95 backdrop-blur-sm border-r transition-all duration-300 shadow-xl",
        sidebarCollapsed ? "w-[70px]" : "w-80",
        !sidebarOpen && "hidden lg:flex"
      )}
      aria-label="사이드바 네비게이션">
        {/* Sidebar Header with Enhanced Branding */}
        <div className="flex h-20 items-center justify-between px-6 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/50">
          {!sidebarCollapsed ? (
            <Link to="/" className="flex items-center gap-4 group" aria-label="홈으로 이동">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary via-primary/80 to-primary/60 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300">
                  CS
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  CulinarySeoul
                </span>
                <span className="text-xs text-muted-foreground font-medium">통합 관리 시스템</span>
              </div>
            </Link>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary via-primary/80 to-primary/60 flex items-center justify-center text-white font-bold shadow-lg mx-auto">
              CS
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={cn(
              "hidden lg:flex rounded-xl hover:bg-primary/10 transition-all duration-200 hover:scale-110",
              sidebarCollapsed && "mx-auto"
            )}
            aria-label={sidebarCollapsed ? "사이드바 확장" : "사이드바 축소"}
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform duration-300",
              sidebarCollapsed && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Enhanced Real-time Status Panel */}
        {!sidebarCollapsed && (
          <div className="px-4 py-4 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    systemStatus === 'online' ? "bg-green-500 animate-pulse" : "bg-red-500"
                  )}></div>
                  <span className="text-muted-foreground font-medium">시스템</span>
                </div>
                <span className={cn(
                  "font-semibold text-xs",
                  systemStatus === 'online' ? "text-green-600" : "text-red-600"
                )}>
                  {systemStatus === 'online' ? '정상 작동' : '연결 끊김'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground font-medium">활성 사용자</span>
                </div>
                <span className="font-semibold text-blue-600">{activeUsers}명</span>
              </div>
              
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">동기화</span>
                </div>
                <span className="font-medium text-xs">
                  {lastSync.toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Navigation Sections */}
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
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative",
                            isActive 
                              ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-md shadow-primary/10' 
                              : 'hover:bg-primary/10 text-sidebar-foreground hover:text-primary hover:translate-x-1',
                            item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                          )}
                          aria-current={isActive ? 'page' : undefined}
                          aria-disabled={item.disabled}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 relative",
                            isActive 
                              ? "bg-primary/20 shadow-sm" 
                              : "bg-primary/5 group-hover:bg-primary/10"
                          )}>
                            <Icon className="h-4 w-4 shrink-0" />
                            {isActive && (
                              <div className="absolute -inset-1 bg-primary/10 rounded-full animate-ping"></div>
                            )}
                          </div>
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1 font-medium">{item.name}</span>
                              {item.badge && (
                                <Badge 
                                  variant={item.disabled ? "secondary" : isActive ? "secondary" : "default"} 
                                  className={cn(
                                    "ml-auto h-5 px-2 text-xs font-medium",
                                    isActive && "bg-primary/20 text-primary border-primary/30"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                              {isActive && (
                                <div className="w-1 h-4 bg-primary rounded-full"></div>
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

        {/* Enhanced Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-border/50 bg-gradient-to-t from-muted/30 to-transparent">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              <span>v1.0.0 · 지원센터</span>
            </div>
          </div>
        )}
      </aside>

      {/* Enhanced Main Content Area */}
        <div className={cn(
          "flex flex-col transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[70px]" : "lg:pl-80"
        )}>
          {/* Enhanced Header */}
          <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
            <div className="flex h-20 items-center gap-6 px-6 lg:px-8">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden rounded-xl hover:bg-muted/50 transition-all duration-200"
                aria-label="메뉴 열기"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* Enhanced Breadcrumb Navigation */}
              <nav className="flex-1" aria-label="브레드크럼">
                <ol className="flex items-center gap-2 text-sm">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                      {index > 0 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {index === breadcrumbs.length - 1 ? (
                        <li className="font-bold text-foreground text-base">{crumb.name}</li>
                      ) : (
                        <li>
                          <Link 
                            to={crumb.href} 
                            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                          >
                            {crumb.name}
                          </Link>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ol>
              </nav>

              {/* Enhanced Header Actions */}
              <div className="flex items-center gap-4">
                {/* Enhanced Data Scope Selector */}
                <DataScopeSelector
                  dashboardType="company"
                  variant="compact"
                  size="sm"
                  className="hidden lg:flex"
                />
                
                <Separator orientation="vertical" className="h-8 hidden lg:block" />
                
                {/* Global Search */}
                <GlobalSearch className="hidden sm:flex" />
                
                {/* Notifications */}
                <NotificationCenter />
                
                {/* User Profile Menu */}
                <UserProfileMenu />
              </div>
            </div>
          </header>

        {/* Data Scope Panel - More prominent display */}
        <div className="bg-muted/50 border-b px-6 py-4">
          <DataScopeSelector
            dashboardType="company"
            variant="default"
            size="md"
            className="max-w-4xl"
          />
        </div>

        {/* Enhanced Main Content with proper spacing */}
        <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="container mx-auto p-6 lg:p-8">
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