import React from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import { useClerkAuth } from '../contexts/ClerkAuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  fallbackPath?: string
}

export const ClerkProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [],
  fallbackPath = '/sign-in'
}) => {
  const { isSignedIn, isLoaded } = useAuth()
  const { userPermissions, isLoading } = useClerkAuth()
  const location = useLocation()

  // 로딩 중일 때
  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 인증되지 않은 경우
  if (!isSignedIn) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // 권한 확인
  if (requiredPermissions.length > 0 && userPermissions) {
    const hasPermission = requiredPermissions.every(permission => {
      switch (permission) {
        case 'manage_brands':
          return userPermissions.can_manage_brands
        case 'manage_stores':
          return userPermissions.can_manage_stores
        case 'view_analytics':
          return userPermissions.can_view_analytics
        case 'manage_inventory':
          return userPermissions.can_manage_inventory
        case 'manage_orders':
          return userPermissions.can_manage_orders
        case 'manage_users':
          return userPermissions.can_manage_users
        case 'super_admin':
          return userPermissions.is_super_admin
        default:
          return false
      }
    })

    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
            <p className="text-gray-600 mb-4">이 페이지에 접근할 권한이 없습니다.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

// 특정 권한을 위한 편의 컴포넌트들
export const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProtectedRoute requiredPermissions={['super_admin']}>
    {children}
  </ClerkProtectedRoute>
)

export const BrandManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProtectedRoute requiredPermissions={['manage_brands']}>
    {children}
  </ClerkProtectedRoute>
)

export const StoreManagerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProtectedRoute requiredPermissions={['manage_stores']}>
    {children}
  </ClerkProtectedRoute>
)

export const AnalyticsRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ClerkProtectedRoute requiredPermissions={['view_analytics']}>
    {children}
  </ClerkProtectedRoute>
)

// 권한 확인 훅
export const useClerkPermissions = () => {
  const { userPermissions } = useClerkAuth()

  const hasPermission = (permission: string): boolean => {
    if (!userPermissions) return false

    switch (permission) {
      case 'manage_brands':
        return userPermissions.can_manage_brands
      case 'manage_stores':
        return userPermissions.can_manage_stores
      case 'view_analytics':
        return userPermissions.can_view_analytics
      case 'manage_inventory':
        return userPermissions.can_manage_inventory
      case 'manage_orders':
        return userPermissions.can_manage_orders
      case 'manage_users':
        return userPermissions.can_manage_users
      case 'super_admin':
        return userPermissions.is_super_admin
      default:
        return false
    }
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin: hasPermission('super_admin'),
    canManageBrands: hasPermission('manage_brands'),
    canManageStores: hasPermission('manage_stores'),
    canViewAnalytics: hasPermission('view_analytics'),
    canManageInventory: hasPermission('manage_inventory'),
    canManageOrders: hasPermission('manage_orders'),
    canManageUsers: hasPermission('manage_users')
  }
}