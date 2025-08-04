import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../domains/user/types';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function DashboardRedirect() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging on render
  useEffect(() => {
    console.log('[DashboardRedirect] Component rendered', {
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      loading,
      isInitializing,
      error,
      timestamp: new Date().toISOString()
    });
  }, [user, loading, isInitializing, error]);

  useEffect(() => {
    if (loading || isInitializing) {
      console.log('[DashboardRedirect] Skipping initialization', {
        loading,
        isInitializing,
        timestamp: new Date().toISOString()
      });
      return;
    }

    const initializeDashboard = async () => {
      console.log('[DashboardRedirect] Starting dashboard initialization', {
        user: user ? { id: user.id, email: user.email, role: user.role } : null,
        timestamp: new Date().toISOString()
      });
      
      setIsInitializing(true);
      setError(null);

      try {
        // 로그인되지 않은 경우
        if (!user) {
          console.log('[DashboardRedirect] No user, redirecting to sign-in', {
            timestamp: new Date().toISOString()
          });
          navigate('/sign-in', { replace: true });
          return;
        }

        // Add 100ms delay to ensure router is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        // 슈퍼어드민인 경우 회사 대시보드로 직접 접근 (권한 체크 우회)
        if (user.role === UserRole.SUPER_ADMIN) {
          console.log('[DashboardRedirect] Super admin detected, navigating to company dashboard', {
            userRole: user.role,
            targetPath: '/company',
            timestamp: new Date().toISOString()
          });
          navigate('/company', { replace: true });
          return;
        }

        // 관리자인 경우 회사 대시보드로 접근
        if (user.role === UserRole.ADMIN) {
          console.log('[DashboardRedirect] Admin detected, navigating to company dashboard', {
            userRole: user.role,
            targetPath: '/company',
            timestamp: new Date().toISOString()
          });
          navigate('/company', { replace: true });
          return;
        }

        // 매니저/직원은 브랜드 대시보드로
        if (user.role === UserRole.MANAGER || user.role === UserRole.EMPLOYEE) {
          console.log('[DashboardRedirect] Manager/Employee detected, navigating to brand dashboard', {
            userRole: user.role,
            targetPath: '/brand',
            timestamp: new Date().toISOString()
          });
          navigate('/brand', { replace: true });
          return;
        }

        // 기타 역할은 접근 권한 없음
        console.log('[DashboardRedirect] Unknown role, access denied', {
          userRole: user.role,
          timestamp: new Date().toISOString()
        });
        setError('이 계정으로는 대시보드에 접근할 수 없습니다.');
        
      } catch (error) {
        console.error('[DashboardRedirect] Dashboard initialization error:', error);
        setError('대시보드 초기화 중 오류가 발생했습니다.');
      } finally {
        setIsInitializing(false);
        console.log('[DashboardRedirect] Dashboard initialization complete', {
          timestamp: new Date().toISOString()
        });
      }
    };

    initializeDashboard();
  }, [user, loading, navigate, isInitializing]);

  // 로딩 중이거나 초기화 중
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">대시보드를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 오류가 있는 경우
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/sign-in')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  // 기본 로딩 상태 (should not reach here normally)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}