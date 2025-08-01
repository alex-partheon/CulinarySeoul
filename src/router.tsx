import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from './components/layouts/RootLayout'
import { CompanyDashboard } from './pages/company/Dashboard'
import { BrandDashboard } from './pages/brand/Dashboard'
import { CompanyDashboardLayout } from './components/dashboard/company/CompanyDashboardLayout'
import { BrandDashboardLayout } from './components/dashboard/brand/BrandDashboardLayout'
import { LoginPage } from './pages/auth/Login'
import { NotFoundPage } from './pages/NotFound'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardRedirect } from './components/auth/DashboardRedirect'
import { AuthProvider } from './contexts/AuthContext'
import ShadcnTest from './pages/ShadcnTest'

// 회사 관리 라우트
const companyRoutes = {
  path: '/company',
  element: <ProtectedRoute><CompanyDashboardLayout /></ProtectedRoute>,
  children: [
    {
      index: true,
      element: <CompanyDashboard />
    },
    {
      path: 'users',
      lazy: () => import('./pages/company/Users').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory',
      lazy: () => import('./pages/company/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: 'orders',
      lazy: () => import('./pages/company/Orders').then(m => ({ Component: m.default }))
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
}

// 브랜드 관리 라우트
const brandRoutes = {
  path: '/brand',
  element: <ProtectedRoute><BrandDashboardLayout /></ProtectedRoute>,
  children: [
    {
      index: true,
      element: <BrandDashboard />
    },
    {
      path: 'menu',
      lazy: () => import('./pages/brand/Menu').then(m => ({ Component: m.default }))
    },
    {
      path: 'orders',
      lazy: () => import('./pages/brand/Orders').then(m => ({ Component: m.default }))
    },
    {
      path: 'customers',
      lazy: () => import('./pages/brand/Customers').then(m => ({ Component: m.default }))
    },
    {
      path: 'analytics',
      lazy: () => import('./pages/brand/Analytics').then(m => ({ Component: m.default }))
    },
    {
      path: 'marketing',
      lazy: () => import('./pages/brand/Marketing').then(m => ({ Component: m.default }))
    },
    {
      path: 'settings',
      lazy: () => import('./pages/brand/Settings').then(m => ({ Component: m.default }))
    },
    {
      path: 'inventory',
      lazy: () => import('./pages/brand/Inventory').then(m => ({ Component: m.default }))
    },
    {
      path: ':brandId/marketing-analytics',
      lazy: () => import('./pages/brand/marketing-analytics').then(m => ({ Component: m.BrandMarketingAnalyticsPage }))
    },
    {
      path: ':brandId/stores',
      lazy: () => import('./pages/brand/StoreManagement').then(m => ({ Component: m.default }))
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
        element: <ProtectedRoute><DashboardRedirect /></ProtectedRoute>
      },
      {
        path: 'login',
        element: <LoginPage />
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