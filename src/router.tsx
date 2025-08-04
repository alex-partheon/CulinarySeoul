import { createBrowserRouter, RouterProvider, useParams, Navigate } from 'react-router'
import { RootLayout } from './components/layouts/RootLayout'
import { CompanyDashboard } from './pages/company/Dashboard'
import { BrandDashboard } from './pages/brand/Dashboard'
import { CompanyDashboardLayout } from './components/dashboard/company/CompanyDashboardLayout'
import { BrandDashboardLayout } from './components/dashboard/brand/BrandDashboardLayout'
import { StoreDashboardLayout } from './components/dashboard/store/StoreDashboardLayout'
import { LoginPage } from './pages/auth/Login'
import { NotFoundPage } from './pages/NotFound'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardRedirect } from './components/auth/DashboardRedirect'
import { AuthProvider } from './contexts/AuthContext'
import { DataScopeProvider } from './contexts/DataScopeContext'
import ShadcnTest from './pages/ShadcnTest'
import HomePage from './pages/Home'

// Clerk 인증 페이지들
import ClerkSignInPage from './pages/auth/ClerkSignIn'
import ClerkSignUpPage from './pages/auth/ClerkSignUp'
import ClerkProfilePage from './pages/auth/ClerkProfile'
import ClerkOnboardingPage from './pages/auth/ClerkOnboarding'

// 회사 관리 라우트
const companyRoutes = {
  path: '/company',
  element: (
    <ProtectedRoute>
      <DataScopeProvider defaultScope="company">
        <CompanyDashboardLayout />
      </DataScopeProvider>
    </ProtectedRoute>
  ),
  children: [
    {
      index: true,
      element: <CompanyDashboard />
    },
    // 1. 개요 & 모니터링
    {
      path: 'realtime',
      lazy: () => import('./pages/company/Realtime').then(m => ({ Component: m.default }))
    },
    {
      path: 'performance',
      lazy: () => import('./pages/company/Performance').then(m => ({ Component: m.default }))
    },
    {
      path: 'alerts',
      lazy: () => import('./pages/company/Alerts').then(m => ({ Component: m.default }))
    },
    // 2. 조직 관리
    {
      path: 'brands',
      lazy: () => import('./pages/company/Brands').then(m => ({ Component: m.default }))
    },
    {
      path: 'stores',
      lazy: () => import('./pages/company/Stores').then(m => ({ Component: m.default }))
    },
    {
      path: 'staff',
      lazy: () => import('./pages/company/Staff').then(m => ({ Component: m.default }))
    },
    {
      path: 'departments',
      lazy: () => import('./pages/company/Departments').then(m => ({ Component: m.default }))
    },
    // 3. 재고 관리
    {
      path: 'inventory',
      lazy: () => import('./pages/company/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/stock',
      lazy: () => import('./pages/company/inventory/Stock').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/orders',
      lazy: () => import('./pages/company/inventory/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/suppliers',
      lazy: () => import('./pages/company/inventory/Suppliers').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/transfers',
      lazy: () => import('./pages/company/inventory/Transfers').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/alerts',
      lazy: () => import('./pages/company/inventory/Alerts').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/fifo',
      lazy: () => import('./pages/company/inventory/FIFO').then(m => ({ Component: m.default }))
    },
    // 4. 매출 & 주문 관리
    {
      path: 'sales',
      lazy: () => import('./pages/company/Sales').then(m => ({ Component: m.default }))
    },
    {
      path: 'orders',
      lazy: () => import('./pages/company/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'pos',
      lazy: () => import('./pages/company/POS').then(m => ({ Component: m.default }))
    },
    {
      path: 'menu',
      lazy: () => import('./pages/company/Menu').then(m => ({ Component: m.default }))
    },
    {
      path: 'promotions',
      lazy: () => import('./pages/company/Promotions').then(m => ({ Component: m.default }))
    },
    {
      path: 'customers',
      lazy: () => import('./pages/company/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'loyalty',
      lazy: () => import('./pages/company/Loyalty').then(m => ({ Component: m.default }))
    },
    // 5. 마케팅 & 고객 관리
    {
      path: 'marketing',
      lazy: () => import('./pages/company/Marketing').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/campaigns',
      lazy: () => import('./pages/company/marketing/Campaigns').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/social',
      lazy: () => import('./pages/company/marketing/Social').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/reviews',
      lazy: () => import('./pages/company/marketing/Reviews').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/events',
      lazy: () => import('./pages/company/marketing/Events').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/newsletter',
      lazy: () => import('./pages/company/marketing/Newsletter').then(m => ({ Component: m.default }))
    },
    // 6. 분석 & 리포트
    {
      path: 'analytics',
      lazy: () => import('./pages/company/Analytics').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/sales',
      lazy: () => import('./pages/company/analytics/Sales').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/customers',
      lazy: () => import('./pages/company/analytics/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/inventory',
      lazy: () => import('./pages/company/analytics/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/staff',
      lazy: () => import('./pages/company/analytics/Staff').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/financial',
      lazy: () => import('./pages/company/analytics/Financial').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/custom',
      lazy: () => import('./pages/company/analytics/Custom').then(m => ({ Component: m.default }))
    },
    // 7. 운영 관리
    {
      path: 'operations/schedule',
      lazy: () => import('./pages/company/operations/Schedule').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/tasks',
      lazy: () => import('./pages/company/operations/Tasks').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/quality',
      lazy: () => import('./pages/company/operations/Quality').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/maintenance',
      lazy: () => import('./pages/company/operations/Maintenance').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/training',
      lazy: () => import('./pages/company/operations/Training').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/compliance',
      lazy: () => import('./pages/company/operations/Compliance').then(m => ({ Component: m.default }))
    },
    // 8. 시스템 관리
    {
      path: 'system/users',
      lazy: () => import('./pages/company/system/Users').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/permissions',
      lazy: () => import('./pages/company/system/Permissions').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/settings',
      lazy: () => import('./pages/company/system/Settings').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/integrations',
      lazy: () => import('./pages/company/system/Integrations').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/audit-logs',
      lazy: () => import('./pages/company/system/AuditLogs').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/backup',
      lazy: () => import('./pages/company/system/Backup').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/health',
      lazy: () => import('./pages/company/system/Health').then(m => ({ Component: m.default }))
    },
    // Legacy routes for backward compatibility
    {
      path: 'users',
      lazy: () => import('./pages/company/Users').then(m => ({ Component: m.default }))
    },
    {
      path: 'suppliers',
      lazy: () => import('./pages/company/Suppliers').then(m => ({ Component: m.default }))
    },
    {
      path: 'reports',
      lazy: () => import('./pages/company/Reports').then(m => ({ Component: m.default }))
    },
    {
      path: 'settings',
      lazy: () => import('./pages/company/Settings').then(m => ({ Component: m.default }))
    }
  ]
};

// 관리자 라우트
const adminRoutes = {
  path: '/admin',
  element: (
    <ProtectedRoute>
      <DataScopeProvider defaultScope="company">
        <CompanyDashboardLayout />
      </DataScopeProvider>
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'brand-approvals',
      lazy: () => import('./pages/admin/BrandApprovals').then(m => ({ Component: m.default }))
    }
  ]
};

// 브랜드 라우트 래퍼 컴포넌트
const BrandRouteWrapper = () => {
  const { brandId } = useParams()
  return (
    <ProtectedRoute>
      <DataScopeProvider defaultScope="brand" defaultBrand={brandId}>
        <BrandDashboardLayout />
      </DataScopeProvider>
    </ProtectedRoute>
  )
}

// 브랜드 관리 라우트
const brandRoutes = {
  path: '/brand/:brandId',
  element: <BrandRouteWrapper />,
  children: [
    {
      index: true,
      element: <BrandDashboard />
    },
    // 1. 개요 & 모니터링
    {
      path: 'realtime',
      lazy: () => import('./pages/brand/Realtime').then(m => ({ Component: m.default }))
    },
    {
      path: 'performance',
      lazy: () => import('./pages/brand/Performance').then(m => ({ Component: m.default }))
    },
    {
      path: 'alerts',
      lazy: () => import('./pages/brand/Alerts').then(m => ({ Component: m.default }))
    },
    // 2. 조직 관리
    {
      path: 'stores',
      lazy: () => import('./pages/brand/Stores').then(m => ({ Component: m.default }))
    },
    {
      path: 'staff',
      lazy: () => import('./pages/brand/Staff').then(m => ({ Component: m.default }))
    },
    // 3. 재고 관리
    {
      path: 'inventory',
      lazy: () => import('./pages/brand/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/stock',
      lazy: () => import('./pages/brand/inventory/Stock').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/orders',
      lazy: () => import('./pages/brand/inventory/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/suppliers',
      lazy: () => import('./pages/brand/inventory/Suppliers').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/transfers',
      lazy: () => import('./pages/brand/inventory/Transfers').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/alerts',
      lazy: () => import('./pages/brand/inventory/Alerts').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/fifo',
      lazy: () => import('./pages/brand/inventory/FIFO').then(m => ({ Component: m.default }))
    },
    // 4. 매출 & 주문 관리
    {
      path: 'sales',
      lazy: () => import('./pages/brand/Sales').then(m => ({ Component: m.default }))
    },
    {
      path: 'orders',
      lazy: () => import('./pages/brand/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'pos',
      lazy: () => import('./pages/brand/POS').then(m => ({ Component: m.default }))
    },
    {
      path: 'menu',
      lazy: () => import('./pages/brand/Menu').then(m => ({ Component: m.default }))
    },
    {
      path: 'promotions',
      lazy: () => import('./pages/brand/Promotions').then(m => ({ Component: m.default }))
    },
    {
      path: 'customers',
      lazy: () => import('./pages/brand/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'loyalty',
      lazy: () => import('./pages/brand/Loyalty').then(m => ({ Component: m.default }))
    },
    // 5. 마케팅 & 고객 관리
    {
      path: 'marketing',
      lazy: () => import('./pages/brand/Marketing').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/campaigns',
      lazy: () => import('./pages/brand/marketing/Campaigns').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/social',
      lazy: () => import('./pages/brand/marketing/Social').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/reviews',
      lazy: () => import('./pages/brand/marketing/Reviews').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/events',
      lazy: () => import('./pages/brand/marketing/Events').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/newsletter',
      lazy: () => import('./pages/brand/marketing/Newsletter').then(m => ({ Component: m.default }))
    },
    // 6. 분석 & 리포트
    {
      path: 'analytics',
      lazy: () => import('./pages/brand/Analytics').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/sales',
      lazy: () => import('./pages/brand/analytics/Sales').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/customers',
      lazy: () => import('./pages/brand/analytics/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/inventory',
      lazy: () => import('./pages/brand/analytics/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/staff',
      lazy: () => import('./pages/brand/analytics/Staff').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/financial',
      lazy: () => import('./pages/brand/analytics/Financial').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/custom',
      lazy: () => import('./pages/brand/analytics/Custom').then(m => ({ Component: m.default }))
    },
    // 7. 운영 관리
    {
      path: 'operations/schedule',
      lazy: () => import('./pages/brand/operations/Schedule').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/tasks',
      lazy: () => import('./pages/brand/operations/Tasks').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/quality',
      lazy: () => import('./pages/brand/operations/Quality').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/maintenance',
      lazy: () => import('./pages/brand/operations/Maintenance').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/training',
      lazy: () => import('./pages/brand/operations/Training').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/compliance',
      lazy: () => import('./pages/brand/operations/Compliance').then(m => ({ Component: m.default }))
    },
    // 8. 시스템 관리
    {
      path: 'system/users',
      lazy: () => import('./pages/brand/system/Users').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/permissions',
      lazy: () => import('./pages/brand/system/Permissions').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/settings',
      lazy: () => import('./pages/brand/system/Settings').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/integrations',
      lazy: () => import('./pages/brand/system/Integrations').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/audit-logs',
      lazy: () => import('./pages/brand/system/AuditLogs').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/backup',
      lazy: () => import('./pages/brand/system/Backup').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/health',
      lazy: () => import('./pages/brand/system/Health').then(m => ({ Component: m.default }))
    },
    // Legacy routes for backward compatibility
    {
      path: 'settings',
      lazy: () => import('./pages/brand/Settings').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing-analytics',
      lazy: () => import('./pages/brand/marketing-analytics').then(m => ({ Component: m.BrandMarketingAnalyticsPage }))
    }
  ]
}

// 매장 라우트 래퍼 컴포넌트
const StoreRouteWrapper = () => {
  const { storeId } = useParams()
  return (
    <ProtectedRoute>
      <DataScopeProvider defaultScope="store" defaultStore={storeId}>
        <StoreDashboardLayout />
      </DataScopeProvider>
    </ProtectedRoute>
  )
}

// 매장 관리 라우트
const storeRoutes = {
  path: '/store/:storeId',
  element: <StoreRouteWrapper />,
  children: [
    {
      index: true,
      lazy: () => import('./pages/store/Dashboard').then(m => ({ Component: m.default }))
    },
    // 1. 개요 & 모니터링
    {
      path: 'realtime',
      lazy: () => import('./pages/store/Realtime').then(m => ({ Component: m.default }))
    },
    {
      path: 'performance',
      lazy: () => import('./pages/store/Performance').then(m => ({ Component: m.default }))
    },
    {
      path: 'alerts',
      lazy: () => import('./pages/store/Alerts').then(m => ({ Component: m.default }))
    },
    // 2. 조직 관리
    {
      path: 'staff',
      lazy: () => import('./pages/store/Staff').then(m => ({ Component: m.default }))
    },
    // 3. 재고 관리
    {
      path: 'inventory',
      lazy: () => import('./pages/store/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/stock',
      lazy: () => import('./pages/store/inventory/Status').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/orders',
      lazy: () => import('./pages/store/inventory/Purchasing').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/suppliers',
      lazy: () => import('./pages/store/inventory/Suppliers').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/transfers',
      lazy: () => import('./pages/store/inventory/Movement').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/alerts',
      lazy: () => import('./pages/store/inventory/Shortage').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory/fifo',
      lazy: () => import('./pages/store/inventory/FIFO').then(m => ({ Component: m.default }))
    },
    // 4. 매출 & 주문 관리
    {
      path: 'sales',
      lazy: () => import('./pages/store/Sales').then(m => ({ Component: m.default }))
    },
    {
      path: 'orders',
      lazy: () => import('./pages/store/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'pos',
      lazy: () => import('./pages/store/POS').then(m => ({ Component: m.default }))
    },
    {
      path: 'menu',
      lazy: () => import('./pages/store/Menu').then(m => ({ Component: m.default }))
    },
    {
      path: 'promotions',
      lazy: () => import('./pages/store/Promotions').then(m => ({ Component: m.default }))
    },
    {
      path: 'customers',
      lazy: () => import('./pages/store/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'loyalty',
      lazy: () => import('./pages/store/Loyalty').then(m => ({ Component: m.default }))
    },
    // 5. 마케팅 & 고객 관리
    {
      path: 'marketing',
      lazy: () => import('./pages/store/Marketing').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/campaigns',
      lazy: () => import('./pages/store/marketing/Campaigns').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/social',
      lazy: () => import('./pages/store/marketing/SNS').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/reviews',
      lazy: () => import('./pages/store/marketing/Reviews').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/events',
      lazy: () => import('./pages/store/marketing/Events').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing/newsletter',
      lazy: () => import('./pages/store/marketing/Newsletter').then(m => ({ Component: m.default }))
    },
    // 6. 분석 & 리포트
    {
      path: 'analytics',
      lazy: () => import('./pages/store/Analytics').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/sales',
      lazy: () => import('./pages/store/analytics/SalesReport').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/customers',
      lazy: () => import('./pages/store/analytics/CustomerAnalysis').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/inventory',
      lazy: () => import('./pages/store/analytics/InventoryReport').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/staff',
      lazy: () => import('./pages/store/analytics/Performance').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/financial',
      lazy: () => import('./pages/store/analytics/Financial').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics/custom',
      lazy: () => import('./pages/store/analytics/Custom').then(m => ({ Component: m.default }))
    },
    // 7. 운영 관리
    {
      path: 'operations/schedule',
      lazy: () => import('./pages/store/operations/Schedule').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/tasks',
      lazy: () => import('./pages/store/operations/Tasks').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/quality',
      lazy: () => import('./pages/store/operations/Quality').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/maintenance',
      lazy: () => import('./pages/store/operations/Facilities').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/training',
      lazy: () => import('./pages/store/operations/Training').then(m => ({ Component: m.default }))
    },
    {
      path: 'operations/compliance',
      lazy: () => import('./pages/store/operations/Compliance').then(m => ({ Component: m.default }))
    },
    // 8. 시스템 관리
    {
      path: 'system/users',
      lazy: () => import('./pages/store/system/Users').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/permissions',
      lazy: () => import('./pages/store/system/Permissions').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/settings',
      lazy: () => import('./pages/store/system/Settings').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/integrations',
      lazy: () => import('./pages/store/system/Integrations').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/audit-logs',
      lazy: () => import('./pages/store/system/AuditLog').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/backup',
      lazy: () => import('./pages/store/system/Backup').then(m => ({ Component: m.default }))
    },
    {
      path: 'system/health',
      lazy: () => import('./pages/store/system/Status').then(m => ({ Component: m.default }))
    },
    // Legacy routes for backward compatibility
    {
      path: 'settings',
      lazy: () => import('./pages/store/Settings').then(m => ({ Component: m.default }))
    }
  ]
}

// 메인 라우터 설정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />, // ErrorBoundary 대신 errorElement 사용
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      // Clerk 인증 라우트
      {
        path: 'signin',
        element: <Navigate to="/sign-in" replace />
      },
      {
        path: 'sign-in',
        element: <ClerkSignInPage />
      },
      {
        path: 'signup',
        element: <Navigate to="/sign-up" replace />
      },
      {
        path: 'sign-up',
        element: <ClerkSignUpPage />
      },
      {
        path: 'profile',
        element: <ClerkProfilePage />
      },
      {
        path: 'onboarding',
        element: <ClerkOnboardingPage />
      },
      {
        path: 'shadcn-test',
        element: <ShadcnTest />
      },
      {
        path: 'style-guide',
        lazy: () => import('./pages/StyleGuide').then(m => ({ Component: m.StyleGuide }))
      },
      {
        path: 'theme-demo',
        lazy: () => import('./components/theme/ThemeDemo').then(m => ({ Component: m.ThemeDemo }))
      },
      companyRoutes,
      brandRoutes,
      storeRoutes,
      adminRoutes,
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
])

// 라우터 프로바이더 컴포넌트
export function AppRouter() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}