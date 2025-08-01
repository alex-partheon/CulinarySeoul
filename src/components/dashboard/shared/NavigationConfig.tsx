import React from 'react'
import {
  Home,
  Building2,
  Store,
  Package,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Settings,
  TrendingUp,
  Activity,
  ClipboardList,
  Boxes,
  UserCog,
  Shield,
  ScrollText,
  Bell,
  Users,
  Network,
  Truck,
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw,
  CreditCard,
  BookOpen as MenuBook,
  Tag,
  UserCheck,
  Star,
  Megaphone,
  Zap,
  Share2,
  MessageSquare,
  Calendar,
  Mail,
  LineChart,
  Users2,
  Package2,
  UserCog2,
  Receipt,
  FileBarChart,
  CalendarDays,
  CheckSquare,
  Wrench,
  BookOpen,
  FileCheck,
  Plug,
  Database,
  Heart
} from 'lucide-react'

export interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  badge?: string
  disabled?: boolean
  permission?: 'read' | 'write' | 'manager' | 'admin' | 'super_admin'
  showOnContext?: ('company' | 'brand' | 'store')[]
  description?: string
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
  permission?: 'read' | 'write' | 'manager' | 'admin' | 'super_admin'
  showOnContext?: ('company' | 'brand' | 'store')[]
}

/**
 * Generate unified navigation sections for company, brand, and store dashboards
 * @param context - 'company', 'brand', or 'store'
 * @param options - Additional options for navigation generation
 * @returns NavigationSection[] - Array of navigation sections
 */
export function generateUnifiedNavigationSections(
  context: 'company' | 'brand' | 'store',
  options: {
    brandId?: string;
    storeId?: string;
    userPermissions?: string[];
    userRole?: string;
  } = {}
): NavigationSection[] {
  const { brandId, storeId, userPermissions = [], userRole = 'read' } = options;
  
  // Determine base URL based on context
  let baseUrl = '';
  if (context === 'company') {
    baseUrl = '/company';
  } else if (context === 'brand' && brandId) {
    baseUrl = `/brand/${brandId}`;
  } else if (context === 'brand') {
    baseUrl = '/brand';
  } else if (context === 'store' && storeId) {
    baseUrl = `/store/${storeId}`;
  } else if (context === 'store') {
    baseUrl = '/store';
  }

  // Create the unified navigation structure
  const allSections: NavigationSection[] = [
    // 1. 현황 관리 (Overview & Monitoring)
    {
      title: '현황 관리',
      permission: 'read',
      items: [
        {
          name: '대시보드',
          href: baseUrl,
          icon: Home,
          permission: 'read',
          description: '종합 현황 대시보드'
        },
        {
          name: '실시간 현황',
          href: `${baseUrl}/realtime`,
          icon: Activity,
          badge: 'Live',
          permission: 'read',
          description: '실시간 운영 상황'
        },
        {
          name: '성과 분석',
          href: `${baseUrl}/performance`,
          icon: TrendingUp,
          permission: 'read',
          description: '매출 및 성과 지표'
        },
        {
          name: '알림 센터',
          href: `${baseUrl}/alerts`,
          icon: Bell,
          badge: '3',
          permission: 'read',
          description: '시스템 알림 및 경고'
        }
      ]
    },

    // 2. 조직 관리 (Organization)
    {
      title: '조직 관리',
      permission: 'read',
      items: [
        {
          name: '브랜드 관리',
          href: `${baseUrl}/brands`,
          icon: Building2,
          permission: 'admin',
          showOnContext: ['company'],
          description: '브랜드 등록 및 관리'
        },
        {
          name: '매장 관리',
          href: `${baseUrl}/stores`,
          icon: Store,
          permission: 'manager',
          showOnContext: ['company', 'brand'],
          description: '매장 등록 및 관리'
        },
        {
          name: '직원 관리',
          href: `${baseUrl}/staff`,
          icon: Users,
          permission: 'manager',
          description: '직원 등록 및 관리'
        },
        {
          name: '부서 관리',
          href: `${baseUrl}/departments`,
          icon: Network,
          permission: 'admin',
          showOnContext: ['company'],
          description: '부서 구조 관리'
        }
      ]
    },

    // 3. 재고 관리
    {
      title: '재고 관리',
      permission: 'read',
      items: [
        {
          name: '재고 현황',
          href: `${baseUrl}/inventory`,
          icon: Package,
          permission: 'read',
          description: '실시간 재고 현황'
        },
        {
          name: '재고 관리',
          href: `${baseUrl}/inventory/stock`,
          icon: Boxes,
          permission: 'write',
          description: '입출고 관리'
        },
        {
          name: '발주 관리',
          href: `${baseUrl}/inventory/orders`,
          icon: ClipboardList,
          permission: 'write',
          description: '발주서 작성 및 승인'
        },
        {
          name: '거래처 관리',
          href: `${baseUrl}/inventory/suppliers`,
          icon: Truck,
          permission: 'manager',
          description: '공급업체 관리'
        },
        {
          name: '재고 이동',
          href: `${baseUrl}/inventory/transfers`,
          icon: ArrowRightLeft,
          permission: 'write',
          showOnContext: ['company', 'brand'],
          description: '매장 간 재고 이동'
        },
        {
          name: '재고 부족 알림',
          href: `${baseUrl}/inventory/alerts`,
          icon: AlertTriangle,
          badge: '긴급',
          permission: 'read',
          description: '재고 부족 모니터링'
        },
        {
          name: '선입선출 추적',
          href: `${baseUrl}/inventory/fifo`,
          icon: RotateCcw,
          badge: 'New',
          permission: 'read',
          description: '유통기한 관리'
        }
      ]
    },

    // 4. 매출 관리 (Sales & Orders)
    {
      title: '매출 관리',
      permission: 'read',
      items: [
        {
          name: '매출 현황',
          href: `${baseUrl}/sales`,
          icon: DollarSign,
          permission: 'read',
          badge: '구현중',
          disabled: true,
          description: '일/월/년 매출 현황'
        },
        {
          name: '주문 관리',
          href: `${baseUrl}/orders`,
          icon: ShoppingBag,
          permission: 'write',
          description: '온/오프라인 주문 관리'
        },
        {
          name: 'POS 연동',
          href: `${baseUrl}/pos`,
          icon: CreditCard,
          permission: 'write',
          description: 'POS 시스템 연동'
        },
        {
          name: '메뉴 관리',
          href: `${baseUrl}/menu`,
          icon: MenuBook,
          permission: 'manager',
          showOnContext: ['company', 'brand'],
          description: '메뉴 및 가격 관리'
        },
        {
          name: '프로모션 관리',
          href: `${baseUrl}/promotions`,
          icon: Tag,
          permission: 'manager',
          description: '할인 및 쿠폰 관리'
        },
        {
          name: '고객 관리',
          href: `${baseUrl}/customers`,
          icon: UserCheck,
          permission: 'write',
          description: '고객 정보 및 이력'
        },
        {
          name: '적립금 관리',
          href: `${baseUrl}/loyalty`,
          icon: Star,
          permission: 'write',
          description: '포인트 및 멤버십'
        }
      ]
    },

    // 5. 마케팅 (Marketing)
    {
      title: '마케팅',
      permission: 'read',
      items: [
        {
          name: '마케팅 현황',
          href: `${baseUrl}/marketing`,
          icon: Megaphone,
          permission: 'read',
          description: '마케팅 성과 대시보드'
        },
        {
          name: '캠페인 관리',
          href: `${baseUrl}/marketing/campaigns`,
          icon: Zap,
          permission: 'manager',
          description: '마케팅 캠페인'
        },
        {
          name: 'SNS 관리',
          href: `${baseUrl}/marketing/social`,
          icon: Share2,
          permission: 'write',
          description: '인스타그램/블로그'
        },
        {
          name: '리뷰 관리',
          href: `${baseUrl}/marketing/reviews`,
          icon: MessageSquare,
          permission: 'write',
          description: '네이버/구글 리뷰'
        },
        {
          name: '이벤트 관리',
          href: `${baseUrl}/marketing/events`,
          icon: Calendar,
          permission: 'manager',
          description: '매장 이벤트'
        },
        {
          name: '뉴스레터',
          href: `${baseUrl}/marketing/newsletter`,
          icon: Mail,
          permission: 'write',
          description: '이메일 마케팅'
        }
      ]
    },

    // 6. 분석 & 리포트
    {
      title: '분석 & 리포트',
      permission: 'read',
      items: [
        {
          name: '경영 분석',
          href: `${baseUrl}/analytics`,
          icon: BarChart3,
          permission: 'read',
          description: '종합 경영 지표'
        },
        {
          name: '매출 리포트',
          href: `${baseUrl}/analytics/sales`,
          icon: LineChart,
          permission: 'read',
          description: '매출 분석 리포트'
        },
        {
          name: '고객 분석',
          href: `${baseUrl}/analytics/customers`,
          icon: Users2,
          permission: 'manager',
          description: '고객 행동 분석'
        },
        {
          name: '재고 리포트',
          href: `${baseUrl}/analytics/inventory`,
          icon: Package2,
          permission: 'read',
          description: '재고 현황 분석'
        },
        {
          name: '직원 성과',
          href: `${baseUrl}/analytics/staff`,
          icon: UserCog2,
          permission: 'manager',
          description: '직원 성과 분석'
        },
        {
          name: '재무 리포트',
          href: `${baseUrl}/analytics/financial`,
          icon: Receipt,
          permission: 'admin',
          description: '손익 및 현금흐름'
        },
        {
          name: '맞춤 리포트',
          href: `${baseUrl}/analytics/custom`,
          icon: FileBarChart,
          permission: 'manager',
          description: '사용자 정의 리포트'
        }
      ]
    },

    // 7. 운영 관리 (Operations)
    {
      title: '운영 관리',
      permission: 'read',
      items: [
        {
          name: '근무 스케줄',
          href: `${baseUrl}/operations/schedule`,
          icon: CalendarDays,
          permission: 'manager',
          description: '직원 근무표'
        },
        {
          name: '업무 관리',
          href: `${baseUrl}/operations/tasks`,
          icon: CheckSquare,
          permission: 'write',
          description: '업무 배정 및 진행'
        },
        {
          name: '품질 관리',
          href: `${baseUrl}/operations/quality`,
          icon: Shield,
          permission: 'manager',
          description: '위생 및 품질 점검'
        },
        {
          name: '시설 관리',
          href: `${baseUrl}/operations/maintenance`,
          icon: Wrench,
          permission: 'write',
          description: '장비 및 시설 관리'
        },
        {
          name: '교육 관리',
          href: `${baseUrl}/operations/training`,
          icon: BookOpen,
          permission: 'manager',
          description: '직원 교육 프로그램'
        },
        {
          name: '컴플라이언스',
          href: `${baseUrl}/operations/compliance`,
          icon: FileCheck,
          permission: 'admin',
          description: '규정 준수 관리'
        }
      ]
    },

    // 8. 시스템 관리
    {
      title: '시스템 관리',
      permission: 'admin',
      items: [
        {
          name: '사용자 관리',
          href: `${baseUrl}/system/users`,
          icon: UserCog,
          permission: 'admin',
          description: '사용자 계정 관리'
        },
        {
          name: '권한 설정',
          href: `${baseUrl}/system/permissions`,
          icon: Shield,
          permission: 'super_admin',
          description: '권한 및 역할 관리'
        },
        {
          name: '시스템 설정',
          href: `${baseUrl}/system/settings`,
          icon: Settings,
          permission: 'admin',
          description: '시스템 환경 설정'
        },
        {
          name: '연동 관리',
          href: `${baseUrl}/system/integrations`,
          icon: Plug,
          permission: 'admin',
          description: 'API 및 서비스 연동'
        },
        {
          name: '감사 로그',
          href: `${baseUrl}/system/audit-logs`,
          icon: ScrollText,
          permission: 'admin',
          description: '시스템 로그'
        },
        {
          name: '백업 관리',
          href: `${baseUrl}/system/backup`,
          icon: Database,
          permission: 'super_admin',
          description: '데이터 백업'
        },
        {
          name: '시스템 상태',
          href: `${baseUrl}/system/health`,
          icon: Heart,
          badge: '정상',
          permission: 'admin',
          description: '시스템 모니터링'
        }
      ]
    }
  ];
  
  // Apply context-based filtering
  return allSections
    .map(section => filterSectionByContext(section, context))
    .filter(section => section !== null && section.items.length > 0) as NavigationSection[];
}

/**
 * Filter sections based on context (company/brand/store)
 */
function filterSectionByContext(
  section: NavigationSection, 
  context: 'company' | 'brand' | 'store'
): NavigationSection | null {
  // If section has context restrictions, check them
  if (section.showOnContext && !section.showOnContext.includes(context)) {
    return null;
  }
  
  // Filter items within the section based on context
  const filteredItems = section.items.filter(item => {
    // If item has no context restrictions, it's available to all
    if (!item.showOnContext) {
      return true;
    }
    // Otherwise, check if current context is allowed
    return item.showOnContext.includes(context);
  });
  
  // Return null if no items remain after filtering
  if (filteredItems.length === 0) {
    return null;
  }
  
  // Return section with filtered items
  return {
    ...section,
    items: filteredItems
  };
}

/**
 * Check if user has required permission level
 */
function hasPermissionLevel(
  userRole: string, 
  requiredPermission: 'read' | 'write' | 'manager' | 'admin' | 'super_admin'
): boolean {
  const permissionHierarchy = {
    'read': 0,
    'write': 1,
    'manager': 2,
    'admin': 3,
    'super_admin': 4
  };

  const userLevel = permissionHierarchy[userRole as keyof typeof permissionHierarchy] ?? 0;
  const requiredLevel = permissionHierarchy[requiredPermission];

  return userLevel >= requiredLevel;
}

/**
 * Filter navigation items based on user permissions and data scope
 * @param sections - Navigation sections to filter
 * @param userRole - Current user role
 * @param hasAccess - Function to check if user has access to specific item
 * @returns NavigationSection[] - Filtered navigation sections
 */
export function filterNavigationByPermissions(
  sections: NavigationSection[],
  userRole: string = 'read',
  hasAccess?: (href: string) => boolean
): NavigationSection[] {
  return sections
    .map(section => {
      // Check section-level permissions
      if (section.permission && !hasPermissionLevel(userRole, section.permission)) {
        return null;
      }

      // Filter items based on permissions
      const filteredItems = section.items.filter(item => {
        // Skip disabled items
        if (item.disabled) return false;
        
        // Check item-level permissions
        if (item.permission && !hasPermissionLevel(userRole, item.permission)) {
          return false;
        }
        
        // Additional access check function
        if (hasAccess && !hasAccess(item.href)) {
          return false;
        }
        
        return true;
      });

      return {
        ...section,
        items: filteredItems
      };
    })
    .filter((section): section is NavigationSection => 
      section !== null && section.items.length > 0
    );
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use generateUnifiedNavigationSections instead
 */
export function generateNavigationSections(
  context: 'company' | 'brand', 
  brandId?: string
): NavigationSection[] {
  return generateUnifiedNavigationSections(context, { brandId });
}

/**
 * Generate breadcrumb navigation based on current path
 * @param pathname - Current pathname
 * @param context - Dashboard context (company, brand, or store)
 * @returns Array of breadcrumb items
 */
export function generateBreadcrumbs(pathname: string, context: 'company' | 'brand' | 'store') {
  const paths = pathname.split('/').filter(Boolean)
  const breadcrumbs = [{ name: '홈', href: '/' }]
  
  let currentPath = ''
  paths.forEach((path, index) => {
    currentPath += `/${path}`
    let name = path
    
    // Comprehensive path mapping for all menu items
    const pathMap: Record<string, string> = {
      // Context
      'company': '회사 관리',
      'brand': '브랜드',
      'store': '매장',
      
      // Core navigation
      'dashboard': '대시보드',
      'realtime': '실시간 현황',
      'performance': '성과 분석',
      'alerts': '알림 센터',
      
      // Organization
      'brands': '브랜드 관리',
      'stores': '매장 관리',
      'staff': '직원 관리',
      'departments': '부서 관리',
      
      // Inventory
      'inventory': '재고 관리',
      'stock': '재고 관리',
      'orders': '발주 관리',
      'suppliers': '거래처 관리',
      'transfers': '재고 이동',
      'fifo': '선입선출 추적',
      
      // Sales & Orders
      'sales': '매출 관리',
      'pos': 'POS 연동',
      'menu': '메뉴 관리',
      'promotions': '프로모션 관리',
      'customers': '고객 관리',
      'loyalty': '적립금 관리',
      
      // Marketing
      'marketing': '마케팅',
      'campaigns': '캠페인 관리',
      'social': 'SNS 관리',
      'reviews': '리뷰 관리',
      'events': '이벤트 관리',
      'newsletter': '뉴스레터',
      
      // Analytics
      'analytics': '분석 & 리포트',
      'financial': '재무 리포트',
      'custom': '맞춤 리포트',
      
      // Operations
      'operations': '운영 관리',
      'schedule': '근무 스케줄',
      'tasks': '업무 관리',
      'quality': '품질 관리',
      'maintenance': '시설 관리',
      'training': '교육 관리',
      'compliance': '컴플라이언스',
      
      // System
      'system': '시스템 관리',
      'users': '사용자 관리',
      'permissions': '권한 설정',
      'settings': '시스템 설정',
      'integrations': '연동 관리',
      'audit-logs': '감사 로그',
      'backup': '백업 관리',
      'health': '시스템 상태'
    }
    
    name = pathMap[path] || path
    breadcrumbs.push({ name, href: currentPath })
  })
  
  return breadcrumbs
}