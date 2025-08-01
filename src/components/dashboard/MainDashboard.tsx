// Main Dashboard Component - Routes to appropriate dashboard based on user role

import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../services/mockDataService';
import type { MockUser } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { 
  Building2, 
  Store as StoreIcon, 
  Crown, 
  Users, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import CompanyDashboard from './CompanyDashboard';
import { BrandDashboard } from './BrandDashboard';
import StoreDashboard from './StoreDashboard';

interface MainDashboardProps {
  userId: string;
}

type DashboardView = 'company' | 'brand' | 'store';

export const MainDashboard: React.FC<MainDashboardProps> = ({ userId }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [currentView, setCurrentView] = useState<DashboardView>('company');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [availableCompanies, setAvailableCompanies] = useState<any[]>([]);
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [availableStores, setAvailableStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  useEffect(() => {
    if (selectedCompanyId) {
      loadBrands();
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedBrandId) {
      loadStores();
    }
  }, [selectedBrandId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // 사용자 정보 로드
      const userData = await mockDataService.getUser(userId);
      setUser(userData);

      if (userData) {
        // 사용자 역할에 따른 데이터 로드
        const userRole = userData.role;
        
        if (userRole === 'super_admin') {
          // 슈퍼 관리자: 모든 회사 접근 가능
          const companies = await mockDataService.getCompanies();
          setAvailableCompanies(companies);
          if (companies.length > 0) {
            setSelectedCompanyId(companies[0].id);
            setCurrentView('company');
          }
        } else if (userRole === 'company_admin') {
          // 회사 관리자: 특정 회사만 접근
          if (userData.company_id) {
            const company = await mockDataService.getCompany(userData.company_id);
            if (company) {
              setAvailableCompanies([company]);
              setSelectedCompanyId(company.id);
              setCurrentView('company');
            }
          }
        } else if (userRole === 'brand_manager') {
          // 브랜드 매니저: 특정 브랜드만 접근
          if (userData.brand_id) {
            const brand = await mockDataService.getBrand(userData.brand_id);
            if (brand) {
              setAvailableBrands([brand]);
              setSelectedBrandId(brand.id);
              setCurrentView('brand');
              
              // 회사 정보도 로드
              const company = await mockDataService.getCompany(brand.company_id);
              if (company) {
                setAvailableCompanies([company]);
                setSelectedCompanyId(company.id);
              }
            }
          }
        } else if (userRole === 'store_manager') {
          // 매장 매니저: 특정 매장만 접근
          if (userData.store_id) {
            const store = await mockDataService.getStore(userData.store_id);
            if (store) {
              setAvailableStores([store]);
              setSelectedStoreId(store.id);
              setCurrentView('store');
              
              // 브랜드 및 회사 정보도 로드
              const brand = await mockDataService.getBrand(store.brand_id);
              if (brand) {
                setAvailableBrands([brand]);
                setSelectedBrandId(brand.id);
                
                const company = await mockDataService.getCompany(brand.company_id);
                if (company) {
                  setAvailableCompanies([company]);
                  setSelectedCompanyId(company.id);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('사용자 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    if (!selectedCompanyId) return;
    
    try {
      const brands = await mockDataService.getBrands(selectedCompanyId);
      setAvailableBrands(brands);
      
      // 브랜드 매니저가 아닌 경우에만 첫 번째 브랜드 자동 선택
      if (user?.role !== 'brand_manager' && brands.length > 0 && !selectedBrandId) {
        setSelectedBrandId(brands[0].id);
      }
    } catch (error) {
      console.error('브랜드 데이터 로드 실패:', error);
    }
  };

  const loadStores = async () => {
    if (!selectedBrandId) return;
    
    try {
      const stores = await mockDataService.getStoresByBrand(selectedBrandId);
      setAvailableStores(stores);
      
      // 매장 매니저가 아닌 경우에만 첫 번째 매장 자동 선택
      if (user?.role !== 'store_manager' && stores.length > 0 && !selectedStoreId) {
        setSelectedStoreId(stores[0].id);
      }
    } catch (error) {
      console.error('매장 데이터 로드 실패:', error);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      super_admin: '슈퍼 관리자',
      company_admin: '회사 관리자',
      brand_manager: '브랜드 매니저',
      store_manager: '매장 매니저'
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4" />;
      case 'company_admin':
        return <Building2 className="h-4 w-4" />;
      case 'brand_manager':
        return <Users className="h-4 w-4" />;
      case 'store_manager':
        return <StoreIcon className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const canAccessView = (view: DashboardView): boolean => {
    if (!user) return false;
    
    switch (user.role) {
      case 'super_admin':
      case 'company_admin':
        return true; // 모든 뷰 접근 가능
      case 'brand_manager':
        return view !== 'company'; // 회사 뷰 제외
      case 'store_manager':
        return view === 'store'; // 매장 뷰만 접근 가능
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-lg">대시보드 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 사용자 정보 및 네비게이션 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getRoleIcon(user.role)}
              <div>
                <div className="text-xl font-bold">{user.name}님의 대시보드</div>
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                  <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                  <span>•</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              Mock 데이터 모드
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* 뷰 선택 버튼 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">보기:</span>
              <div className="flex space-x-1">
                {canAccessView('company') && (
                  <Button
                    variant={currentView === 'company' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('company')}
                    disabled={!selectedCompanyId}
                  >
                    <Building2 className="h-3 w-3 mr-1" />
                    회사
                  </Button>
                )}
                {canAccessView('brand') && (
                  <Button
                    variant={currentView === 'brand' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('brand')}
                    disabled={!selectedBrandId}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    브랜드
                  </Button>
                )}
                {canAccessView('store') && (
                  <Button
                    variant={currentView === 'store' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentView('store')}
                    disabled={!selectedStoreId}
                  >
                    <StoreIcon className="h-3 w-3 mr-1" />
                    매장
                  </Button>
                )}
              </div>
            </div>

            {/* 선택 드롭다운들 */}
            <div className="flex items-center space-x-3">
              {/* 회사 선택 */}
              {availableCompanies.length > 1 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">회사:</span>
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="회사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 브랜드 선택 */}
              {availableBrands.length > 1 && canAccessView('brand') && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">브랜드:</span>
                  <Select value={selectedBrandId} onValueChange={setSelectedBrandId}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="브랜드 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBrands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* 매장 선택 */}
              {availableStores.length > 1 && canAccessView('store') && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">매장:</span>
                  <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="매장 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStores.map((store) => (
                        <SelectItem key={store.id} value={store.id}>
                          {store.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 선택된 대시보드 렌더링 */}
      <div>
        {currentView === 'company' && selectedCompanyId && (
          <CompanyDashboard companyId={selectedCompanyId} />
        )}
        
        {currentView === 'brand' && selectedBrandId && (
          <BrandDashboard brandId={selectedBrandId} />
        )}
        
        {currentView === 'store' && selectedStoreId && (
          <StoreDashboard storeId={selectedStoreId} />
        )}
        
        {/* 선택된 항목이 없는 경우 */}
        {((currentView === 'company' && !selectedCompanyId) ||
          (currentView === 'brand' && !selectedBrandId) ||
          (currentView === 'store' && !selectedStoreId)) && (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center space-y-2">
                <ChevronDown className="h-8 w-8 mx-auto text-gray-400" />
                <div className="text-lg text-gray-500">
                  {currentView === 'company' && '회사를 선택해주세요'}
                  {currentView === 'brand' && '브랜드를 선택해주세요'}
                  {currentView === 'store' && '매장을 선택해주세요'}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;