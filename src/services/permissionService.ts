import { supabase, permissionCache } from '../lib/supabase';
import type { 
  UserPermissions, 
  DashboardSession, 
  PermissionAuditLog,
  DashboardPermissions,
  HybridPermissions 
} from '../types/database';
import { toast } from 'react-hot-toast';

export class PermissionService {
  private static instance: PermissionService;
  private currentSession: DashboardSession | null = null;

  static getInstance(): PermissionService {
    if (!PermissionService.instance) {
      PermissionService.instance = new PermissionService();
    }
    return PermissionService.instance;
  }

  /**
   * 사용자의 권한 정보를 조회합니다.
   */
  async getUserPermissions(userId: string): Promise<UserPermissions | null> {
    try {
      const cacheKey = `permissions:${userId}`;
      const cached = permissionCache.get(cacheKey);
      if (cached) return cached;

      // Check if user is super_admin first - they get full permissions without database lookup
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userData?.role === 'super_admin') {
        const superAdminPermissions: UserPermissions = {
          userId,
          canAccessCompanyDashboard: true,
          canAccessBrandDashboard: true,
          hybridPermissions: {
            canSwitchBetweenDashboards: true,
            crossPlatformDataAccess: true,
            brandContextSwitching: true,
            globalAdminAccess: true
          },
          companyDashboardPermissions: {
            role: 'super_admin',
            modules: {},
            actions: {}
          },
          brandDashboardPermissions: {
            role: 'super_admin',
            modules: {},
            actions: {}
          },
          crossPlatformAccess: {
            allowedBrands: ['*'],
            allowedStores: ['*'],
            dataSharing: true
          }
        };
        permissionCache.set(cacheKey, superAdminPermissions);
        return superAdminPermissions;
      }

      const { data, error } = await supabase
        .from('dashboard_access_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('권한 조회 오류:', error);
        
        // For admin users without permission entries, provide default admin permissions
        if (userData?.role === 'admin') {
          const adminPermissions: UserPermissions = {
            userId,
            canAccessCompanyDashboard: true,
            canAccessBrandDashboard: false,
            hybridPermissions: {
              canSwitchBetweenDashboards: false,
              crossPlatformDataAccess: false,
              brandContextSwitching: false,
              globalAdminAccess: false
            },
            companyDashboardPermissions: {
              role: 'admin',
              modules: {},
              actions: {}
            },
            brandDashboardPermissions: {
              role: 'viewer',
              modules: {},
              actions: {}
            },
            crossPlatformAccess: {
              allowedBrands: [],
              allowedStores: [],
              dataSharing: false
            }
          };
          permissionCache.set(cacheKey, adminPermissions);
          return adminPermissions;
        }
        
        return null;
      }

      const permissions: UserPermissions = {
        userId: data.user_id || '',
        canAccessCompanyDashboard: data.can_access_company_dashboard ?? false,
        canAccessBrandDashboard: data.can_access_brand_dashboard ?? false,
        hybridPermissions: (data.hybrid_permissions as unknown as HybridPermissions) ?? {
          canSwitchBetweenDashboards: false,
          crossPlatformDataAccess: false,
          brandContextSwitching: false,
          globalAdminAccess: false
        },
        companyDashboardPermissions: (data.company_dashboard_permissions as unknown as DashboardPermissions) ?? {
          role: 'viewer',
          modules: {},
          actions: {}
        },
        brandDashboardPermissions: (data.brand_dashboard_permissions as unknown as DashboardPermissions) ?? {
          role: 'viewer',
          modules: {},
          actions: {}
        },
        crossPlatformAccess: (data.cross_platform_access as unknown as {
          allowedBrands: string[];
          allowedStores: string[];
          dataSharing: boolean;
        }) ?? {
          allowedBrands: [],
          allowedStores: [],
          dataSharing: false
        }
      };

      permissionCache.set(cacheKey, permissions);
      return permissions;
    } catch (error) {
      console.error('권한 조회 중 오류:', error);
      return null;
    }
  }

  /**
   * 대시보드 접근 권한을 확인합니다.
   */
  async canAccessDashboard(
    userId: string, 
    dashboardType: 'company' | 'brand',
    brandId?: string
  ): Promise<boolean> {
    try {
      // Check if user is super admin first
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      // Super admin can access any dashboard
      if (userData?.role === 'super_admin') {
        return true;
      }

      const permissions = await this.getUserPermissions(userId);
      if (!permissions) {
        // For regular admin users, allow company dashboard access even without permission entries
        if (userData?.role === 'admin' && dashboardType === 'company') {
          return true;
        }
        return false;
      }

      if (dashboardType === 'company') {
        return permissions.canAccessCompanyDashboard;
      }

      if (dashboardType === 'brand') {
        if (!permissions.canAccessBrandDashboard) return false;

        // 특정 브랜드 접근 권한 확인
        if (brandId) {
          const allowedBrands = permissions.crossPlatformAccess.allowedBrands;
          return allowedBrands.length === 0 || allowedBrands.includes(brandId) || allowedBrands.includes('*');
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('대시보드 접근 권한 확인 오류:', error);
      return false;
    }
  }

  /**
   * 대시보드 세션을 생성합니다.
   */
  async createDashboardSession(
    userId: string,
    dashboardType: 'company' | 'brand',
    brandContext?: string
  ): Promise<DashboardSession | null> {
    try {
      // Check if user is super admin or admin - they can create sessions without permission checks
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      const isSuperAdmin = userData?.role === 'super_admin';
      const isAdmin = userData?.role === 'admin';

      // For non-admin users, check permissions
      if (!isSuperAdmin && !isAdmin) {
        const canAccess = await this.canAccessDashboard(userId, dashboardType, brandContext);
        if (!canAccess) {
          console.warn(`User ${userId} cannot access ${dashboardType} dashboard`);
          return null;
        }
      }

      // 기존 활성 세션 비활성화
      await this.deactivateUserSessions(userId);

      const sessionToken = this.generateSessionToken();
      
      // Super admin의 경우 매우 긴 세션 timeout 적용
      let sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000');
      if (isSuperAdmin && import.meta.env.VITE_SUPER_ADMIN_NO_TIMEOUT === 'true') {
        sessionTimeout = 86400000; // 24시간
        console.log('[PermissionService] Extended session timeout for super admin:', sessionTimeout);
      }
      
      const expiresAt = new Date(Date.now() + sessionTimeout);

      const { data, error } = await supabase
        .from('dashboard_sessions')
        .insert({
          user_id: userId,
          dashboard_type: dashboardType,
          brand_context: brandContext || null,
          session_token: sessionToken,
          brand_switches: [],
          is_active: true,
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('세션 생성 오류:', error);
        return null;
      }

      const session: DashboardSession = {
        id: data.id,
        userId: data.user_id || '',
        dashboardType: data.dashboard_type,
        brandContext: data.brand_context || undefined,
        sessionToken: data.session_token,
        brandSwitches: (data.brand_switches as any[]) || [],
        isActive: data.is_active || false,
        startedAt: data.started_at || '',
        expiresAt: data.expires_at || undefined,
        createdAt: data.created_at || new Date().toISOString()
      }

      this.currentSession = session;
      return session;
    } catch (error) {
      console.error('세션 생성 중 오류:', error);
      return null;
    }
  }

  /**
   * 브랜드 전환을 수행합니다.
   */
  async switchBrand(
    sessionId: string,
    fromBrand: string | undefined,
    toBrand: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const { data: session, error: fetchError } = await supabase
        .from('dashboard_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('is_active', true)
        .single();

      if (fetchError || !session) {
        toast.error('유효하지 않은 세션입니다.');
        return false;
      }

      // 브랜드 접근 권한 확인
      const canAccess = await this.canAccessDashboard(session.user_id || '', 'brand', toBrand);
      if (!canAccess) {
        toast.error('해당 브랜드에 접근할 권한이 없습니다.');
        return false;
      }

      const brandSwitches = session.brand_switches as any[] || [];
      brandSwitches.push({
        fromBrand: fromBrand || undefined,
        toBrand,
        timestamp: new Date().toISOString(),
        reason: reason || undefined
      });

      const { error: updateError } = await supabase
        .from('dashboard_sessions')
        .update({
          brand_context: toBrand,
          brand_switches: brandSwitches
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('브랜드 전환 오류:', updateError);
        return false;
      }

      // 현재 세션 업데이트
      if (this.currentSession?.id === sessionId) {
        this.currentSession.brandContext = toBrand;
        this.currentSession.brandSwitches = brandSwitches;
      }

      toast.success(`브랜드가 ${toBrand}로 전환되었습니다.`);
      return true;
    } catch (error) {
      console.error('브랜드 전환 중 오류:', error);
      toast.error('브랜드 전환 중 오류가 발생했습니다.');
      return false;
    }
  }

  /**
   * 권한 변경 이력을 기록합니다.
   */
  async logPermissionChange(
    userId: string,
    changedBy: string,
    permissionType: string,
    oldPermissions: any,
    newPermissions: any,
    changeReason?: string,
    dashboardType?: 'company' | 'brand'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('permission_audit_logs')
        .insert({
          user_id: userId,
          action: 'permission_change',
          timestamp: new Date().toISOString(),
          changed_by: changedBy,
          permission_type: permissionType,
          old_permissions: oldPermissions,
          new_permissions: newPermissions,
          change_reason: changeReason || null,
          dashboard_type: dashboardType || null
        });

      if (error) {
        console.error('권한 변경 이력 기록 오류:', error);
      }
    } catch (error) {
      console.error('권한 변경 이력 기록 중 오류:', error);
    }
  }

  /**
   * 사용자의 모든 활성 세션을 비활성화합니다.
   */
  private async deactivateUserSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dashboard_sessions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('세션 비활성화 오류:', error);
      }
    } catch (error) {
      console.error('세션 비활성화 중 오류:', error);
    }
  }

  /**
   * 세션 토큰을 생성합니다.
   */
  private generateSessionToken(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    return `session_${timestamp}_${random}`;
  }

  /**
   * 현재 세션을 반환합니다.
   */
  getCurrentSession(): DashboardSession | null {
    return this.currentSession;
  }

  /**
   * 세션을 종료합니다.
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('dashboard_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) {
        console.error('세션 종료 오류:', error);
      }

      if (this.currentSession?.id === sessionId) {
        this.currentSession = null;
      }
    } catch (error) {
      console.error('세션 종료 중 오류:', error);
    }
  }

  /**
   * 권한 캐시를 무효화합니다.
   */
  invalidatePermissionCache(userId: string): void {
    permissionCache.delete(`permissions:${userId}`);
  }

  /**
   * 모든 권한 캐시를 무효화합니다.
   */
  clearAllPermissionCache(): void {
    permissionCache.clear();
  }

  /**
   * 사용자의 감사 로그를 조회합니다.
   */
  async getAuditLogs(userId: string, limit: number = 50): Promise<PermissionAuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('permission_audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('감사 로그 조회 오류:', error);
        return [];
      }

      // 데이터베이스 스키마를 PermissionAuditLog 타입으로 변환
      const auditLogs: PermissionAuditLog[] = (data || []).map(log => ({
        id: log.id,
        userId: log.user_id || '',
        action: log.action || '',
        timestamp: log.timestamp || '',
        fromDashboard: log.fromDashboard || undefined,
        toDashboard: log.toDashboard || undefined,
        brandContext: log.brandContext || undefined,
        reason: log.reason || undefined,
        ipAddress: log.ipAddress || undefined,
        changedBy: log.changed_by || undefined,
        permissionType: log.permission_type || 'unknown',
        oldPermissions: log.old_permissions || undefined,
        newPermissions: log.new_permissions || undefined,
        changeReason: log.change_reason || undefined,
        dashboardType: log.dashboard_type || undefined,
        createdAt: log.created_at || log.timestamp
      }));

      return auditLogs;
    } catch (error) {
      console.error('감사 로그 조회 중 오류:', error);
      return [];
    }
  }
}

export const permissionService = PermissionService.getInstance();