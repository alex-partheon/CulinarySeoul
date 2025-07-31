import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Building2, Store, ArrowRightLeft, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DashboardSwitcherProps {
  className?: string;
}

export function DashboardSwitcher({ className = '' }: DashboardSwitcherProps) {
  const { userPermissions, currentDashboardSession, switchToDashboard } = useAuth();
  const { switchBrand } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);

  if (!userPermissions) {
    return null;
  }

  const canSwitchDashboards = userPermissions.hybridPermissions?.canSwitchDashboards;
  const currentDashboard = currentDashboardSession?.dashboardType;
  const currentBrand = currentDashboardSession?.brandContext;

  const handleDashboardSwitch = async (dashboardType: 'company' | 'brand') => {
    if (currentDashboard === dashboardType) {
      toast.info(`이미 ${dashboardType === 'company' ? '회사' : '브랜드'} 대시보드에 있습니다.`);
      return;
    }

    setIsLoading(true);
    try {
      const brandContext = dashboardType === 'brand' 
        ? (import.meta.env.VITE_DEFAULT_BRAND || 'millab')
        : undefined;
      
      const success = await switchToDashboard(dashboardType, brandContext);
      if (success) {
        // 페이지 새로고침 또는 라우팅 처리
        window.location.href = dashboardType === 'company' 
          ? import.meta.env.VITE_COMPANY_DASHBOARD_URL || '/company'
          : import.meta.env.VITE_BRAND_DASHBOARD_URL || '/brand';
      }
    } catch (error) {
      console.error('대시보드 전환 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandSwitch = async (brandId: string) => {
    if (!currentDashboardSession) {
      toast.error('활성 세션이 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await switchBrand(brandId, '사용자 요청');
      if (success) {
        setShowBrandSelector(false);
        // 필요시 페이지 새로고침
        window.location.reload();
      }
    } catch (error) {
      console.error('브랜드 전환 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`dashboard-switcher ${className}`}>
      <div className="flex items-center space-x-2">
        {/* 현재 대시보드 표시 */}
        <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
          {currentDashboard === 'company' ? (
            <Building2 className="w-4 h-4 text-blue-600" />
          ) : (
            <Store className="w-4 h-4 text-green-600" />
          )}
          <span className="text-sm font-medium">
            {currentDashboard === 'company' ? '회사 대시보드' : '브랜드 대시보드'}
          </span>
          {currentBrand && (
            <span className="text-xs text-gray-500">({currentBrand})</span>
          )}
        </div>

        {/* 대시보드 전환 버튼 */}
        {canSwitchDashboards && (
          <div className="flex items-center space-x-1">
            {userPermissions.canAccessCompanyDashboard && (
              <button
                onClick={() => handleDashboardSwitch('company')}
                disabled={isLoading || currentDashboard === 'company'}
                className={`
                  flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${currentDashboard === 'company'
                    ? 'bg-blue-100 text-blue-700 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Building2 className="w-4 h-4" />
                <span>회사</span>
              </button>
            )}

            {userPermissions.canAccessBrandDashboard && (
              <button
                onClick={() => handleDashboardSwitch('brand')}
                disabled={isLoading || currentDashboard === 'brand'}
                className={`
                  flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${currentDashboard === 'brand'
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-300'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Store className="w-4 h-4" />
                <span>브랜드</span>
              </button>
            )}

            {/* 브랜드 전환 버튼 (브랜드 대시보드에서만) */}
            {currentDashboard === 'brand' && userPermissions.hybridPermissions?.brandSwitchingEnabled && (
              <button
                onClick={() => setShowBrandSelector(!showBrandSelector)}
                disabled={isLoading}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>브랜드 전환</span>
              </button>
            )}
          </div>
        )}

        {/* 권한 설정 버튼 (관리자만) */}
        {userPermissions.companyDashboardPermissions?.role === 'admin' && (
          <button
            onClick={() => {
              // 권한 관리 페이지로 이동
              window.location.href = '/admin/permissions';
            }}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>권한 관리</span>
          </button>
        )}
      </div>

      {/* 브랜드 선택 드롭다운 */}
      {showBrandSelector && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">브랜드 선택</h3>
            <div className="space-y-1">
              {/* 허용된 브랜드 목록 */}
              {userPermissions.crossPlatformAccess.allowedBrands.map((brandId) => (
                <button
                  key={brandId}
                  onClick={() => handleBrandSwitch(brandId)}
                  disabled={isLoading || currentBrand === brandId}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                    ${currentBrand === brandId
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {brandId === 'millab' ? '밀랍' : brandId}
                  {currentBrand === brandId && (
                    <span className="ml-2 text-xs">(현재)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}

export default DashboardSwitcher;