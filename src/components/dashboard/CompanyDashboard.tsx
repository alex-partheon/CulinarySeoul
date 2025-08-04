import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../services/mockDataService';
import type { MockCompany, MockBrand, MockStore } from '../../data/mockData';
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
import { cn } from '../../lib/utils';
import CategoryManagement from './CategoryManagement';
import MockDashboardAnalytics from './MockDashboardAnalytics';



interface CompanyDashboardProps {
  companyId: string;
  onDataUpdate?: () => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyId, onDataUpdate }) => {
  const [company, setCompany] = useState<MockCompany | null>(null);
  const [brands, setBrands] = useState<MockBrand[]>([]);
  const [stores, setStores] = useState<MockStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBrandDialog, setShowBrandDialog] = useState(false);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');

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
      
      // Mock 데이터 로드
      const companyData = await mockDataService.getCompanyById(companyId);
      setCompany(companyData);

      // 브랜드 목록 로드
      const brandsData = await mockDataService.getBrands(companyId);
      setBrands(brandsData);

      // 모든 매장 로드 (회사의 모든 브랜드)
      const allStores: MockStore[] = [];
      for (const brand of brandsData) {
        const brandStores = await mockDataService.getStoresByBrand(brand.id);
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
      // Mock 데이터에서는 실제 생성하지 않고 알림만 표시
      console.log('브랜드 생성 (Mock):', {
        company_id: companyId,
        ...newBrand,
        business_category: newBrand.business_category as BusinessCategory
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
      // Mock 데이터에서는 실제 생성하지 않고 알림만 표시
      console.log('매장 생성 (Mock):', {
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

  const getCategoryLabel = (category: BusinessCategory | string): string => {
    const labels: Record<BusinessCategory, string> = {
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
    return labels[category as BusinessCategory] || String(category);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Company Header */}
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {company?.name} 관리 대시보드
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
              <div className="text-3xl font-bold text-blue-600 mb-1">{brands.length}</div>
              <div className="text-sm font-medium text-blue-700">브랜드</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
              <div className="text-3xl font-bold text-green-600 mb-1">{stores.length}</div>
              <div className="text-sm font-medium text-green-700">매장</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {stores.filter(s => s.is_active).length}
              </div>
              <div className="text-sm font-medium text-purple-700">활성 매장</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Management Tabs */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted/30 p-1">
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200 font-semibold">
            분석 대시보드
          </TabsTrigger>
          <TabsTrigger value="brands" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200 font-semibold">
            브랜드 관리
          </TabsTrigger>
          <TabsTrigger value="stores" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200 font-semibold">
            매장 관리
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-md transition-all duration-200 font-semibold">
            카테고리 관리
          </TabsTrigger>
        </TabsList>

        {/* 분석 대시보드 탭 */}
        <TabsContent value="analytics" className="space-y-4">
          <MockDashboardAnalytics companyId={companyId} />
        </TabsContent>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => {
              const brandStores = stores.filter(s => s.brand_id === brand.id);
              return (
                <Card key={brand.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-foreground">{brand.name}</CardTitle>
                      <Badge 
                        variant={brand.is_active ? "default" : "secondary"}
                        className={cn(
                          "font-medium",
                          brand.is_active && "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        )}
                      >
                        {brand.is_active ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">코드:</span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{brand.code}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">도메인:</span>
                        <span className="text-xs text-primary">{brand.domain}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">업종:</span>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(brand.business_category)}
                        </Badge>
                      </div>
                      {brand.description && (
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {brand.description}
                        </div>
                      )}
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-border/50">
                        <span className="text-muted-foreground font-medium">매장 수:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {brandStores.length}개
                        </Badge>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const brand = brands.find(b => b.id === store.brand_id);
              return (
                <Card key={store.id} className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-foreground">{store.name}</CardTitle>
                      <Badge 
                        variant={store.is_active ? "default" : "secondary"}
                        className={cn(
                          "font-medium",
                          store.is_active && "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        )}
                      >
                        {store.is_active ? '활성' : '비활성'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">브랜드:</span>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                          {brand?.name}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground font-medium">코드:</span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{store.code}</span>
                      </div>
                      {store.description && (
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {store.description}
                        </div>
                      )}
                      {store.address && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground font-medium text-sm">주소:</span>
                          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
                            {typeof store.address === 'string' ? (
                              <div>{store.address}</div>
                            ) : store.address && typeof store.address === 'object' ? (
                              <>
                                <div>{(store.address as any).street || ''}</div>
                                <div>{(store.address as any).district || ''}, {(store.address as any).city || ''}</div>
                              </>
                            ) : (
                              <div>주소 정보 없음</div>
                            )}
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
           <CategoryManagement brands={brands} onDataUpdate={onDataUpdate || (() => {})} />
         </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;