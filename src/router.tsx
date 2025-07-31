import { createBrowserRouter, RouterProvider } from 'react-router'
import { RootLayout } from './components/layouts/RootLayout'
import { CompanyDashboard } from './pages/company/Dashboard'
import { BrandDashboard } from './pages/brand/Dashboard'
import { LoginPage } from './pages/auth/Login'
import { NotFoundPage } from './pages/NotFound'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import ShadcnTest from './pages/ShadcnTest'

// 회사 관리 라우트
const companyRoutes = {
  path: '/company',
  element: <ProtectedRoute><CompanyDashboard /></ProtectedRoute>,
  children: [
    {
      index: true,
      element: <CompanyDashboard />
    },
    {
      path: 'users',
      lazy: () => import('./pages/company/Users')
    },
    {
      path: 'inventory',
      lazy: () => import('./pages/company/Inventory')
    },
    {
      path: 'orders',
      lazy: () => import('./pages/company/Orders')
    },
    {
      path: 'suppliers',
      lazy: () => import('./pages/company/Suppliers')
    },
    {
      path: 'reports',
      lazy: () => import('./pages/company/Reports')
    },
    {
      path: 'settings',
      lazy: () => import('./pages/company/Settings')
    }
  ]
}

// 브랜드 관리 라우트
const brandRoutes = {
  path: '/brand',
  element: <ProtectedRoute><BrandDashboard /></ProtectedRoute>,
  children: [
    {
      index: true,
      element: <BrandDashboard />
    },
    {
      path: 'menu',
      lazy: () => import('./pages/brand/Menu')
    },
    {
      path: 'orders',
      lazy: () => import('./pages/brand/Orders')
    },
    {
      path: 'customers',
      lazy: () => import('./pages/brand/Customers')
    },
    {
      path: 'analytics',
      lazy: () => import('./pages/brand/Analytics')
    },
    {
      path: 'marketing',
      lazy: () => import('./pages/brand/Marketing')
    },
    {
      path: 'settings',
      lazy: () => import('./pages/brand/Settings')
    }
  ]
}

// 메인 라우터 설정
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorBoundary: NotFoundPage,
    children: [
      {
        index: true,
        element: <ProtectedRoute><CompanyDashboard /></ProtectedRoute>
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'shadcn-test',
        element: <ShadcnTest />
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