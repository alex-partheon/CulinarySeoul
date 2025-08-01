import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { permissionService } from '../services/permissionService';
import type { UserPermissions, DashboardSession } from '../types/database';
import { toast } from 'react-hot-toast';

export interface UsePermissionsReturn {
  permissions: UserPermissions | null;
  currentSession: DashboardSession | null;
  loading: boolean;
  error: string | null;
  canAccessDashboard: (dashboardType: 'company' | 'brand', brandId?: string) => Promise<boolean>;
  switchToDashboard: (dashboardType: 'company' | 'brand', brandContext?: string) => Promise<boolean>;
  switchBrand: (toBrand: string, reason?: string) => Promise<boolean>;
  refreshPermissions: () => Promise<void>;
  hasPermission: (module: string, action: string, dashboardType?: 'company' | 'brand') => boolean;
  canSwitchDashboards: boolean;
  defaultDashboard: 'company' | 'brand' | null;
}

export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [currentSession, setCurrentSession] = useState<DashboardSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 권한 정보 로드
  const loadPermissions = useCallback(async () => {
    if (!user?.id) {
      setPermissions(null);
      setCurrentSession(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userPermissions = await permissionService.getUserPermissions(user.id);
      setPermissions(userPermissions);

      // 현재 세션 확인
      const session = permissionService.getCurrentSession();
      setCurrentSession(session);
    } catch (err) {
      console.error('권한 로드 오류:', err);
      setError('권한 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 대시보드 접근 권한 확인
  const canAccessDashboard = useCallback(async (
    dashboardType: 'company' | 'brand',
    brandId?: string
  ): Promise<boolean> => {
    if (!user?.id) return false;
    return await permissionService.canAccessDashboard(user.id, dashboardType, brandId);
  }, [user?.id]);

  // 대시보드 전환
  const switchToDashboard = useCallback(async (
    dashboardType: 'company' | 'brand',
    brandContext?: string
  ): Promise<boolean> => {
    if (!user?.id) {
      toast.error('로그인이 필요합니다.');
      return false;
    }

    try {
      // 접근 권한 확인
      const hasAccess = await canAccessDashboard(dashboardType, brandContext);
      if (!hasAccess) {
        toast.error('해당 대시보드에 접근할 권한이 없습니다.');
        return false;
      }

      // 새 세션 생성
      const session = await permissionService.createDashboardSession(
        user.id,
        dashboardType,
        brandContext
      );

      if (session) {
        setCurrentSession(session);
        toast.success(`${dashboardType === 'company' ? '회사' : '브랜드'} 대시보드로 전환되었습니다.`);
        return true;
      } else {
        toast.error('대시보드 전환에 실패했습니다.');
        return false;
      }
    } catch (err) {
      console.error('대시보드 전환 오류:', err);
      toast.error('대시보드 전환 중 오류가 발생했습니다.');
      return false;
    }
  }, [user?.id, canAccessDashboard]);

  // 브랜드 전환
  const switchBrand = useCallback(async (
    toBrand: string,
    reason?: string
  ): Promise<boolean> => {
    if (!currentSession) {
      toast.error('활성 세션이 없습니다.');
      return false;
    }

    try {
      const success = await permissionService.switchBrand(
        currentSession.id,
        currentSession.brandContext,
        toBrand,
        reason
      );

      if (success) {
        // 세션 상태 업데이트
        setCurrentSession(prev => prev ? {
          ...prev,
          brandContext: toBrand
        } : null);
      }

      return success;
    } catch (err) {
      console.error('브랜드 전환 오류:', err);
      toast.error('브랜드 전환 중 오류가 발생했습니다.');
      return false;
    }
  }, [currentSession]);

  // 권한 새로고침
  const refreshPermissions = useCallback(async () => {
    if (user?.id) {
      permissionService.invalidatePermissionCache(user.id);
      await loadPermissions();
    }
  }, [user?.id, loadPermissions]);

  // 특정 모듈/액션에 대한 권한 확인
  const hasPermission = useCallback((
    module: string,
    action: string,
    dashboardType?: 'company' | 'brand'
  ): boolean => {
    if (!permissions) return false;

    const targetPermissions = dashboardType === 'brand' 
      ? permissions.brandDashboardPermissions
      : permissions.companyDashboardPermissions;

    if (!targetPermissions) return false;

    // 관리자는 모든 권한 보유
    if (targetPermissions.role === 'admin') return true;

    // 모듈 접근 권한 확인
    if (!targetPermissions.modules.includes(module)) return false;

    // 액션 권한 확인
    return targetPermissions.actions.includes(action);
  }, [permissions]);

  // 대시보드 전환 가능 여부
  const canSwitchDashboards = permissions?.hybridPermissions?.canSwitchDashboards ?? false;

  // 기본 대시보드
  const defaultDashboard = permissions?.hybridPermissions?.defaultDashboard ?? null;

  // 컴포넌트 마운트 시 권한 로드
  useEffect(() => {
    loadPermissions();
  }, [loadPermissions]);

  // 세션 만료 체크 (super admin의 경우 스킵)
  useEffect(() => {
    if (!currentSession?.expiresAt) return;

    // Super admin timeout 비활성화 체크
    const noTimeoutEnabled = import.meta.env.VITE_SUPER_ADMIN_NO_TIMEOUT === 'true';
    const isSuperAdmin = user?.role === 'super_admin';
    
    if (noTimeoutEnabled && isSuperAdmin) {
      console.log('[usePermissions] Session timeout disabled for super admin');
      return;
    }

    const checkExpiration = () => {
      const now = new Date();
      const expiresAt = new Date(currentSession.expiresAt!);
      
      if (now >= expiresAt) {
        console.log('[usePermissions] Session expired, ending session');
        toast.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        permissionService.endSession(currentSession.id);
        setCurrentSession(null);
      }
    };

    const interval = setInterval(checkExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, [currentSession, user?.role]);

  return {
    permissions,
    currentSession,
    loading,
    error,
    canAccessDashboard,
    switchToDashboard,
    switchBrand,
    refreshPermissions,
    hasPermission,
    canSwitchDashboards,
    defaultDashboard
  };
}

// 권한 기반 컴포넌트 렌더링을 위한 헬퍼 훅
export function usePermissionGuard(
  module: string,
  action: string,
  dashboardType?: 'company' | 'brand'
) {
  const { hasPermission, loading } = usePermissions();
  
  return {
    hasAccess: hasPermission(module, action, dashboardType),
    loading
  };
}

// 대시보드 타입별 권한 확인 훅
export function useDashboardAccess() {
  const { permissions, canAccessDashboard, loading } = usePermissions();
  
  return {
    canAccessCompany: permissions?.canAccessCompanyDashboard ?? false,
    canAccessBrand: permissions?.canAccessBrandDashboard ?? false,
    canAccessDashboard,
    loading
  };
}