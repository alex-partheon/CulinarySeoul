import React, { useState, useEffect } from 'react';
import { CompanyService } from '../../domains/company/companyService';
import { BrandService } from '../../domains/brand/brandService';
import { StoreService } from '../../domains/store/storeService';
import type { Company, Brand, Store } from '../../domains/types';
import { BusinessCategory } from '../../domains/brand/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Plus, Building2, Store, Settings } from 'lucide-react';
import CategoryManagement from './CategoryManagement';

interface CompanyDashboardProps {
  companyId: string;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyId }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrandDialog, setShowBrandDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

  const companyService = new CompanyService();
  const brandService = new BrandService();
  const storeService = new StoreService();

  // 새 브랜드 폼 상태
  const [newBrand, setNewBrand] = useState({
    name: '',
    code: '',
    domain: '',
    business_category: BusinessCategory.CAFE,
    description: ''
  });

  // 새 매장 폼 상태
  const [newStore, setNewStore] = useState({
    name: '',
    code: '',
    brand_id: '',
    description: '',
    address: {
      street: '',
      city: '',
      district: '',
      postal_code: '',
      country: 'South Korea'
    },
    contact_info: {
      phone: '',
      email: '',
      manager: ''
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, [companyId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 회사 정보 로드
      const companyData = await companyService.getCompanyById(companyId);
      setCompany(companyData);

      // 브랜드 목록 로드
      const brandsData = await brandService.getBrandsByCompany(companyId);
      setBrands(brandsData);

      // 모든 매장 로드 (회사의 모든 브랜드)
      const allStores: Store[] = [];
      for (const brand of brandsData) {
        const brandStores = await storeService.getStoresByBrand(brand.id);
        allStores.push(...brandStores);
      }
      setStores(allStores);
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBrand = async () => {
    try {
      await brandService.createBrand({
        company_id: companyId,
        ...newBrand
      });
      
      setShowBrandDialog(false);
      setNewBrand({
        name: '',
        code: '',
        domain: '',
        business_category: BusinessCategory.CAFE,
        description: ''
      });
      
      await loadDashboardData();
    } catch (error) {
      console.error('브랜드 생성 실패:', error);
    }
  };

  const handleCreateStore = async () => {
    try {
      await storeService.createStore({
        ...newStore,
        brand_id: selectedBrandId
      });
      
      setShowStoreDialog(false);
      setNewStore({
        name: '',
        code: '',
        brand_id: '',
        description: '',
        address: {
          street: '',
          city: '',
          district: '',
          postal_code: '',
          country: 'South Korea'
        },
        contact_info: {
          phone: '',
          email: '',
          manager: ''
        }
      });
      
      await loadDashboardData();
    } catch (error) {
      console.error('매장 생성 실패:', error);
    }
  };

  const getCategoryLabel = (category: BusinessCategory): string => {
    const labels = {
      [BusinessCategory.CAFE]: '카페',
      [BusinessCategory.RESTAURANT]: '레스토랑',
      [BusinessCategory.BAKERY]: '베이커리',
      [BusinessCategory.FAST_FOOD]: '패스트푸드',
      [BusinessCategory.FINE_DINING]: '파인다이닝',
      [BusinessCategory.BAR]: '바',
      [BusinessCategory.DESSERT]: '디저트',
      [BusinessCategory.FOOD_TRUCK]: '푸드트럭',
      [BusinessCategory.CATERING]: '케이터링',
      [BusinessCategory.OTHER]: '기타'
    };
    return labels[category] || category;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 회사 정보 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {company?.name} 관리 대시보드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{brands.length}</div>
              <div className="text-sm text-gray-600">브랜드</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stores.length}</div>
              <div className="text-sm text-gray-600">매장</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stores.filter(s => s.is_active).length}
              </div>
              <div className="text-sm text-gray-600">활성 매장</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 관리 탭 */}
      <Tabs defaultValue="brands" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="brands">브랜드 관리</TabsTrigger>
          <TabsTrigger value="stores">매장 관리</TabsTrigger>
          <TabsTrigger value="categories">카테고리 관리</TabsTrigger>
        </TabsList>

        {/* 브랜드 관리 탭 */}
        <TabsContent value="brands" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">브랜드 목록</h3>
            <Dialog open={showBrandDialog} onOpenChange={setShowBrandDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  브랜드 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>새 브랜드 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="brand-name">브랜드명</Label>
                    <Input
                      id="brand-name"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                      placeholder="예: 밀랍"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand-code">브랜드 코드</Label>
                    <Input
                      id="brand-code"
                      value={newBrand.code}
                      onChange={(e) => setNewBrand({...newBrand, code: e.target.value})}
                      placeholder="예: millab"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand-domain">도메인</Label>
                    <Input
                      id="brand-domain"
                      value={newBrand.domain}
                      onChange={(e) => setNewBrand({...newBrand, domain: e.target.value})}
                      placeholder="예: cafe-millab.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-category">업종 카테고리</Label>
                    <Select
                      value={newBrand.business_category}
                      onValueChange={(value) => setNewBrand({...newBrand, business_category: value as BusinessCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BusinessCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="brand-description">설명</Label>
                    <Textarea
                      id="brand-description"
                      value={newBrand.description}
                      onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                      placeholder="브랜드 설명을 입력하세요"
                    />
                  </div>
                  <Button onClick={handleCreateBrand} className="w-full">
                    브랜드 생성
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => {
              const brandStores = stores.filter(s => s.brand_id === brand.id);
              return (
                <Card key={brand.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{brand.name}</span>
                      <Badge variant={brand.is_active ? "default" : "secondary"}>
                        {brand.is_active ? '활성' : '비활성'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">코드:</span> {brand.code}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">도메인:</span> {brand.domain}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">업종:</span> {getCategoryLabel(brand.business_category)}
                      </div>
                      {brand.description && (
                        <div className="text-sm">
                          <span className="font-medium">설명:</span> {brand.description}
                        </div>
                      )}
                      <div className="text-sm">
                        <span className="font-medium">매장 수:</span> {brandStores.length}개
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 매장 관리 탭 */}
        <TabsContent value="stores" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">매장 목록</h3>
            <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  매장 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>새 매장 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="store-brand">브랜드 선택</Label>
                    <Select
                      value={selectedBrandId}
                      onValueChange={setSelectedBrandId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="브랜드를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name} ({getCategoryLabel(brand.business_category)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="store-name">매장명</Label>
                    <Input
                      id="store-name"
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                      placeholder="예: 성수점"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-code">매장 코드</Label>
                    <Input
                      id="store-code"
                      value={newStore.code}
                      onChange={(e) => setNewStore({...newStore, code: e.target.value})}
                      placeholder="예: SeongSu"
                    />
                  </div>
                  <div>
                    <Label htmlFor="store-description">설명</Label>
                    <Textarea
                      id="store-description"
                      value={newStore.description}
                      onChange={(e) => setNewStore({...newStore, description: e.target.value})}
                      placeholder="매장 설명을 입력하세요"
                    />
                  </div>
                  
                  {/* 주소 정보 */}
                  <div className="space-y-2">
                    <Label>주소 정보</Label>
                    <Input
                      placeholder="도로명 주소"
                      value={newStore.address.street}
                      onChange={(e) => setNewStore({
                        ...newStore,
                        address: {...newStore.address, street: e.target.value}
                      })}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="도시"
                        value={newStore.address.city}
                        onChange={(e) => setNewStore({
                          ...newStore,
                          address: {...newStore.address, city: e.target.value}
                        })}
                      />
                      <Input
                        placeholder="구/군"
                        value={newStore.address.district}
                        onChange={(e) => setNewStore({
                          ...newStore,
                          address: {...newStore.address, district: e.target.value}
                        })}
                      />
                    </div>
                    <Input
                      placeholder="우편번호"
                      value={newStore.address.postal_code}
                      onChange={(e) => setNewStore({
                        ...newStore,
                        address: {...newStore.address, postal_code: e.target.value}
                      })}
                    />
                  </div>

                  {/* 연락처 정보 */}
                  <div className="space-y-2">
                    <Label>연락처 정보</Label>
                    <Input
                      placeholder="전화번호"
                      value={newStore.contact_info.phone}
                      onChange={(e) => setNewStore({
                        ...newStore,
                        contact_info: {...newStore.contact_info, phone: e.target.value}
                      })}
                    />
                    <Input
                      placeholder="이메일"
                      value={newStore.contact_info.email}
                      onChange={(e) => setNewStore({
                        ...newStore,
                        contact_info: {...newStore.contact_info, email: e.target.value}
                      })}
                    />
                    <Input
                      placeholder="매니저명"
                      value={newStore.contact_info.manager}
                      onChange={(e) => setNewStore({
                        ...newStore,
                        contact_info: {...newStore.contact_info, manager: e.target.value}
                      })}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateStore} 
                    className="w-full"
                    disabled={!selectedBrandId}
                  >
                    매장 생성
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores.map((store) => {
              const brand = brands.find(b => b.id === store.brand_id);
              return (
                <Card key={store.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{store.name}</span>
                      <Badge variant={store.is_active ? "default" : "secondary"}>
                        {store.is_active ? '활성' : '비활성'}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">브랜드:</span> {brand?.name}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">코드:</span> {store.code}
                      </div>
                      {store.description && (
                        <div className="text-sm">
                          <span className="font-medium">설명:</span> {store.description}
                        </div>
                      )}
                      {store.address && (
                        <div className="text-sm">
                          <span className="font-medium">주소:</span> 
                          <div className="text-xs text-gray-600 mt-1">
                            {store.address.street}, {store.address.district}, {store.address.city}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* 카테고리 관리 탭 */}
         <TabsContent value="categories">
           <CategoryManagement brands={brands} onDataUpdate={onDataUpdate} />
         </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;