import React, { useState, useEffect } from 'react';
import { CompanyDashboard, BrandDashboard } from '../components/dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { companyService } from '../domains/company/companyService';
import { brandService } from '../domains/brand/brandService';
import { storeService } from '../domains/store/storeService';
import type { Company, Brand, Store } from '../domains/types';

interface DashboardProps {
  userRole: 'super_admin' | 'company_admin' | 'brand_admin' | 'store_admin';
  userId: string;
  companyId?: string;
  brandId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, 
  userId, 
  companyId, 
  brandId 
}) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [userRole, companyId, brandId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load company data for super_admin and company_admin
      if ((userRole === 'super_admin' || userRole === 'company_admin') && companyId) {
        const companyData = await companyService.getCompany(companyId);
        setCompany(companyData);

        // Load all brands for the company
        const brandsData = await brandService.getBrandsByCompany(companyId);
        setBrands(brandsData);

        // Load all stores for the company
        const storesData = await storeService.getStoresByCompany(companyId);
        setStores(storesData);
      }

      // Load brand data for brand_admin
      if (userRole === 'brand_admin' && brandId) {
        const brandData = await brandService.getBrand(brandId);
        setSelectedBrand(brandData);

        // Load stores for the brand
        const storesData = await storeService.getStoresByBrand(brandId);
        setStores(storesData);

        // Also load company data
        if (brandData.company_id) {
          const companyData = await companyService.getCompany(brandData.company_id);
          setCompany(companyData);
        }
      }

      // Load store data for store_admin
      if (userRole === 'store_admin') {
        // Store admin logic would go here
        // For now, we'll focus on company and brand management
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    // Reload data when changes are made
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-600">오류</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render based on user role
  if (userRole === 'super_admin' || userRole === 'company_admin') {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">회사 관리 대시보드</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {userRole === 'super_admin' ? '슈퍼 관리자' : '회사 관리자'}
            </Badge>
            {company && (
              <Badge variant="secondary">{company.name}</Badge>
            )}
          </div>
        </div>

        {company && (
          <CompanyDashboard
            company={company}
            brands={brands}
            stores={stores}
            onDataUpdate={handleDataUpdate}
          />
        )}
      </div>
    );
  }

  if (userRole === 'brand_admin' && selectedBrand) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">브랜드 관리 대시보드</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">브랜드 관리자</Badge>
            <Badge variant="secondary">{selectedBrand.name}</Badge>
            {company && (
              <Badge variant="outline">{company.name}</Badge>
            )}
          </div>
        </div>

        <BrandDashboard
          brand={selectedBrand}
          stores={stores}
          onDataUpdate={handleDataUpdate}
        />
      </div>
    );
  }

  // Default view for unauthorized or incomplete data
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>접근 권한 없음</CardTitle>
          <CardDescription>
            이 대시보드에 접근할 권한이 없거나 필요한 데이터가 부족합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>관리자에게 문의하세요.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
export type { DashboardProps };