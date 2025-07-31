import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string;
  dashboardType?: 'company' | 'brand';
  brandId?: string;
  fallback?: React.ReactNode;
  redirectTo?: string;
  showError?: boolean;
}

export function PermissionGuard({
  children,
  requiredPermissions = [],
  requiredRole,
  dashboardType,
  brandId,
  fallback,
  redirectTo,
  showError = true
}: PermissionGuardProps) {
  const { user, userPermissions, currentDashboardSession, canAccessDashboard } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkPermissions = async () => {
      setIsChecking(true);
      setErrorMessage('');

      try {
        // 사용자가 로그인되어 있는지 확인
        if (!user) {
          setErrorMessage('로그인이 필요합니다.');
          setHasAccess(false);
          return;
        }

        // 권한 정보가 로드되었는지 확인
        if (!userPermissions) {
          setErrorMessage('권한 정보를 로드하는 중입니다...');
          setHasAccess(false);
          return;
        }

        // 대시보드 접근 권한 확인
        if (dashboardType) {
          const canAccess = await canAccessDashboard(dashboardType, brandId);
          if (!canAccess) {
            setErrorMessage(`${dashboardType === 'company' ? '회사' : '브랜드'} 대시보드에 접근할 권한이 없습니다.`);
            setHasAccess(false);
            return;
          }

          // 현재 세션이 요구되는 대시보드 타입과 일치하는지 확인
          if (currentDashboardSession?.dashboardType !== dashboardType) {
            setErrorMessage(`${dashboardType === 'company' ? '회사' : '브랜드'} 대시보드로 전환이 필요합니다.`);
            setHasAccess(false);
            return;
          }

          // 브랜드 컨텍스트 확인
          if (dashboardType === 'brand' && brandId && currentDashboardSession?.brandContext !== brandId) {
            setErrorMessage(`${brandId} 브랜드로 전환이 필요합니다.`);
            setHasAccess(false);
            return;
          }
        }

        // 역할 권한 확인
        if (requiredRole && !hasRole(requiredRole)) {
          setErrorMessage(`${requiredRole} 역할이 필요합니다.`);
          setHasAccess(false);
          return;
        }

        // 개별 권한 확인
        for (const permission of requiredPermissions) {
          if (!hasPermission(permission)) {
            setErrorMessage(`'${permission}' 권한이 필요합니다.`);
            setHasAccess(false);
            return;
          }
        }

        setHasAccess(true);
      } catch (error) {
        console.error('권한 확인 중 오류:', error);
        setErrorMessage('권한 확인 중 오류가 발생했습니다.');
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkPermissions();
  }, [user, userPermissions, currentDashboardSession, dashboardType, brandId, requiredRole, requiredPermissions]);

  // 리다이렉트 처리
  useEffect(() => {
    if (!isChecking && !hasAccess && redirectTo) {
      if (showError && errorMessage) {
        toast.error(errorMessage);
      }
      window.location.href = redirectTo;
    }
  }, [isChecking, hasAccess, redirectTo, showError, errorMessage]);

  // 로딩 중
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>권한을 확인하는 중...</span>
        </div>
      </div>
    );
  }

  // 권한이 없는 경우
  if (!hasAccess) {
    // 커스텀 fallback이 있으면 사용
    if (fallback) {
      return <>{fallback}</>;
    }

    // 기본 오류 화면
    if (showError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              접근 권한이 없습니다
            </h2>
            <p className="text-gray-600 mb-4">
              {errorMessage || '이 페이지에 접근할 권한이 없습니다.'}
            </p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                이전 페이지로 돌아가기
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 오류 표시 없이 빈 화면
    return null;
  }

  // 권한이 있는 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}

// 권한 기반 조건부 렌더링을 위한 간단한 컴포넌트
interface PermissionWrapperProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  dashboardType?: 'company' | 'brand';
  brandId?: string;
  fallback?: React.ReactNode;
}

export function PermissionWrapper({
  children,
  permission,
  role,
  dashboardType,
  brandId,
  fallback = null
}: PermissionWrapperProps) {
  const { userPermissions, currentDashboardSession } = useAuth();
  const { hasPermission, hasRole } = usePermissions();

  // 권한 정보가 없으면 로딩 중
  if (!userPermissions) {
    return null;
  }

  // 대시보드 타입 확인
  if (dashboardType && currentDashboardSession?.dashboardType !== dashboardType) {
    return <>{fallback}</>;
  }

  // 브랜드 컨텍스트 확인
  if (dashboardType === 'brand' && brandId && currentDashboardSession?.brandContext !== brandId) {
    return <>{fallback}</>;
  }

  // 권한 확인
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // 역할 확인
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// 권한 부족 경고 컴포넌트
interface PermissionAlertProps {
  message?: string;
  type?: 'warning' | 'error' | 'info';
  showIcon?: boolean;
}

export function PermissionAlert({
  message = '이 기능을 사용할 권한이 없습니다.',
  type = 'warning',
  showIcon = true
}: PermissionAlertProps) {
  const iconColors = {
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600'
  };

  const bgColors = {
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const textColors = {
    warning: 'text-yellow-800',
    error: 'text-red-800',
    info: 'text-blue-800'
  };

  return (
    <div className={`flex items-center p-3 border rounded-lg ${bgColors[type]}`}>
      {showIcon && (
        <AlertTriangle className={`w-5 h-5 mr-2 ${iconColors[type]}`} />
      )}
      <span className={`text-sm ${textColors[type]}`}>
        {message}
      </span>
    </div>
  );
}

export default PermissionGuard;