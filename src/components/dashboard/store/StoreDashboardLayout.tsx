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
  ChevronRight,
  Menu,
  Home,
  Store as StoreIcon,
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
  Building2,
  Activity,
  ClipboardList,
  Boxes,
  ShoppingBag,
  UserCog,
  Shield,
  ScrollText,
  MapPin,
  Clock,
  Phone,
  Star,
  Wifi,
  WifiOff
} from 'lucide-react'
import { 
  NotificationCenter, 
  UserProfileMenu 
} from '@/components/dashboard/shared'
import { BrandStoreSelector } from '@/components/dashboard/shared/BrandStoreSelector'
import { CompanyConnectionStatus } from '@/components/dashboard/shared/CompanyConnectionStatus'
import { generateUnifiedNavigationSections, generateBreadcrumbs } from '@/components/dashboard/shared/NavigationConfig'

interface StoreDashboardLayoutProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
}

// Mock store data - should come from context/API
const mockStoreData = {
  id: 'store_1',
  name: '성수점',
  brandId: 'brand_1',
  brandName: '밀랍',
  brandColor: '#E97132',
  address: '서울특별시 성동구 성수동 1가 656-1',
  phone: '02-1234-5678',
  openingHours: '10:00 - 22:00',
  status: 'active' as const,
  operatingScore: 88,
  customerRating: 4.7,
  isOnline: true,
  departments: [
    { id: 'kitchen', name: '주방', status: 'active' },
    { id: 'hall', name: '홀', status: 'active' },
    { id: 'delivery', name: '배달', status: 'busy' }
  ]
}

export function StoreDashboardLayout({ 
  children, 
  title = "매장 관리 대시보드", 
  subtitle = "매장 운영 현황" 
}: StoreDashboardLayoutProps) {
  const location = useLocation()
  const { storeId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(!mockStoreData.isOnline)
  
  // Data scope state for department selection
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  // Generate unified navigation sections using shared config
  const storeNavigationSections = generateUnifiedNavigationSections('store', { 
    storeId,
    userRole: 'manager' // TODO: Get from AuthContext
  })

  // Generate breadcrumb navigation
  const breadcrumbs = generateBreadcrumbs(location.pathname, 'store')

  // Apply brand theming dynamically
  const brandStyles = useMemo(() => ({
    '--brand-primary': mockStoreData.brandColor,
    '--brand-secondary': `${mockStoreData.brandColor}20`,
  } as React.CSSProperties), [])

  // Store health indicator
  const getOperatingScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-blue-600 bg-blue-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getDepartmentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'busy': return 'bg-yellow-100 text-yellow-700'
      case 'inactive': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-background" style={brandStyles}>
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r transition-all duration-300 shadow-sm",
        sidebarCollapsed ? "w-[70px]" : "w-64",
        !sidebarOpen && "hidden lg:flex"
      )}>
        {/* Store Header */}
        <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-[var(--brand-primary)]/10 to-transparent">
          {!sidebarCollapsed && (
            <Link to={`/store/${storeId}`} className="flex items-center gap-2 group">
              <div className="flex items-center gap-2">
                {/* Store Icon with Brand Color */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--brand-primary)] to-[var(--brand-primary)]/60 flex items-center justify-center text-white font-bold shadow-sm group-hover:shadow-md transition-shadow">
                  <StoreIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-foreground">
                    {mockStoreData.name}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    {mockStoreData.brandName}
                  </span>
                </div>
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

        {/* Store Context Indicators */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 border-b space-y-3">
            {/* Operating Score */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">운영 점수</span>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getOperatingScoreColor(mockStoreData.operatingScore)
              )}>
                <Activity className="w-3 h-3" />
                {mockStoreData.operatingScore}점
              </div>
            </div>

            {/* Customer Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">고객 평점</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-medium">{mockStoreData.customerRating}</span>
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">연결 상태</span>
              <div className="flex items-center gap-2">
                {isOfflineMode ? (
                  <div className="flex items-center gap-1 text-yellow-600">
                    <WifiOff className="w-3 h-3" />
                    <span className="text-xs">오프라인</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-600">
                    <Wifi className="w-3 h-3" />
                    <span className="text-xs">온라인</span>
                  </div>
                )}
                <Switch
                  checked={!isOfflineMode}
                  onCheckedChange={(checked) => setIsOfflineMode(!checked)}
                  className="scale-75"
                />
              </div>
            </div>

            {/* Store Info */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-start gap-2">
                <MapPin className="w-3 h-3 text-muted-foreground mt-0.5" />
                <span className="text-xs text-muted-foreground leading-tight">
                  {mockStoreData.address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {mockStoreData.openingHours}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {mockStoreData.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="메인 네비게이션">
          <StoreSidebarContent 
            navigationSections={storeNavigationSections}
            collapsed={sidebarCollapsed}
            currentPath={location.pathname}
            brandColor={mockStoreData.brandColor}
          />
        </nav>

        {/* Dashboard Links */}
        {!sidebarCollapsed && (
          <div className="px-3 pb-3 space-y-1">
            <Link 
              to={`/brand/${mockStoreData.brandId}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              브랜드 대시보드로 이동
            </Link>
            <Link 
              to="/company" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
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
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-1" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <span className="text-muted-foreground/50">/</span>}
                  <Link
                    to={crumb.href}
                    className={cn(
                      "hover:text-foreground transition-colors",
                      index === breadcrumbs.length - 1 && "text-foreground font-medium"
                    )}
                  >
                    {crumb.name}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Department Selector */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">부서:</span>
              <select
                value={selectedDepartment || 'all'}
                onChange={(e) => setSelectedDepartment(e.target.value === 'all' ? null : e.target.value)}
                className="h-8 px-3 text-sm border rounded-md bg-background"
              >
                <option value="all">전체 부서</option>
                {mockStoreData.departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {selectedDepartment && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    getDepartmentStatusColor(
                      mockStoreData.departments.find(d => d.id === selectedDepartment)?.status || ''
                    )
                  )}
                >
                  {mockStoreData.departments.find(d => d.id === selectedDepartment)?.status === 'active' ? '운영중' :
                   mockStoreData.departments.find(d => d.id === selectedDepartment)?.status === 'busy' ? '혼잡' : '휴무'}
                </Badge>
              )}
            </div>
            
            {/* Company Connection Status */}
            <CompanyConnectionStatus 
              brandId={mockStoreData.brandId}
              storeId={storeId || mockStoreData.id}
              className="hidden xl:block"
            />
            
            {/* Notifications */}
            <NotificationCenter />
            
            {/* User Profile Menu */}
            <UserProfileMenu />
          </div>
        </header>

        {/* Offline Mode Banner */}
        {isOfflineMode && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">
                오프라인 모드가 활성화되었습니다. 일부 실시간 기능이 제한될 수 있습니다.
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

function StoreSidebarContent({ 
  navigationSections, 
  collapsed,
  currentPath,
  brandColor
}: { 
  navigationSections: any[]
  collapsed: boolean
  currentPath: string
  brandColor: string
}) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['현황 관리'])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    )
  }

  return (
    <div className="space-y-4">
      {navigationSections.map((section) => {
        const isExpanded = expandedSections.includes(section.title)
        
        return (
          <div key={section.title}>
            {!collapsed && (
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
                !collapsed && !isExpanded && "hidden"
              )}
            >
              {section.items.map((item: any) => {
                const Icon = item.icon
                const isActive = currentPath === item.href ||
                               currentPath.startsWith(item.href + '/')
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                      isActive 
                        ? 'bg-[var(--brand-primary)] text-white shadow-sm' 
                        : 'hover:bg-[var(--brand-primary)]/10 text-sidebar-foreground hover:text-[var(--brand-primary)]',
                      item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                    aria-disabled={item.disabled}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-white/20 shadow-sm" 
                        : "bg-[var(--brand-primary)]/10 group-hover:bg-[var(--brand-primary)]/20"
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
          </div>
        )
      })}
    </div>
  )
}