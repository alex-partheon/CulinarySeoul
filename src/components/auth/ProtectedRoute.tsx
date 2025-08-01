import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../../contexts/AuthContext'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { supabase } from '../../lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermission?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  requiredPermission 
}: ProtectedRouteProps) {
  const { user, loading, hasRole, hasPermission } = useAuth()
  const location = useLocation()
  const [superAdminBypass, setSuperAdminBypass] = useState<boolean | null>(null)

  // Check for super admin bypass on component mount
  useEffect(() => {
    const checkSuperAdminBypass = async () => {
      const bypass = import.meta.env.VITE_SUPER_ADMIN_BYPASS === 'true';
      const superAdminEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL;
      
      if (bypass && superAdminEmail) {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          const isSuperAdmin = authUser?.email === superAdminEmail;
          console.log('[ProtectedRoute] Super admin bypass check:', {
            authUser: authUser?.email,
            superAdminEmail,
            isSuperAdmin,
            bypass
          });
          setSuperAdminBypass(isSuperAdmin);
        } catch (error) {
          console.error('[ProtectedRoute] Error checking super admin bypass:', error);
          setSuperAdminBypass(false);
        }
      } else {
        setSuperAdminBypass(false);
      }
    };
    
    checkSuperAdminBypass();
  }, []);

  // Debug logging on render
  useEffect(() => {
    console.log('[ProtectedRoute] Component rendered with:', {
      pathname: location.pathname,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      loading,
      superAdminBypass,
      requiredRole,
      requiredPermission,
      timestamp: new Date().toISOString()
    })
  }, [location.pathname, user, loading, superAdminBypass, requiredRole, requiredPermission])

  // Super admin bypass - allow access regardless of user state
  if (superAdminBypass === true) {
    console.log('[ProtectedRoute] Super admin bypass activated, allowing access to:', location.pathname);
    return <>{children}</>;
  }

  if (loading || superAdminBypass === null) {
    console.log('[ProtectedRoute] Loading state or checking super admin bypass', {
      pathname: location.pathname,
      loading,
      superAdminBypass,
      timestamp: new Date().toISOString()
    })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            {superAdminBypass === null ? '관리자 권한을 확인하고 있습니다...' : '로딩 중...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    console.log('[ProtectedRoute] No user found, redirecting to login', {
      from: location.pathname,
      timestamp: new Date().toISOString()
    })
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && !hasRole(requiredRole as any)) {
    // 필요한 역할이 없는 경우 접근 거부
    console.log('[ProtectedRoute] Role check failed', {
      userRole: user.role,
      requiredRole,
      hasRole: hasRole(requiredRole as any),
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">이 페이지에 접근할 권한이 없습니다.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // 필요한 권한이 없는 경우 접근 거부
    console.log('[ProtectedRoute] Permission check failed', {
      userPermissions: user.permissions,
      requiredPermission,
      hasPermission: hasPermission(requiredPermission),
      pathname: location.pathname,
      timestamp: new Date().toISOString()
    })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">권한이 부족합니다</h1>
          <p className="text-gray-600 mb-4">이 기능을 사용할 권한이 없습니다.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  console.log('[ProtectedRoute] All checks passed, rendering children', {
    pathname: location.pathname,
    userRole: user.role,
    requiredRole,
    requiredPermission,
    timestamp: new Date().toISOString()
  })

  return <>{children}</>
}