import React, { useState, useEffect } from 'react';
import { BrandService } from '../../domains/brand/brandService';
import { StoreService } from '../../domains/store/storeService';
import type { Brand, Store } from '../../domains/types';
import { BusinessCategory } from '../../domains/brand/types';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Plus, Store as StoreIcon, Settings, MapPin, Phone, Mail, User } from 'lucide-react';

interface BrandDashboardProps {
  brandId: string;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ brandId }) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showStoreDetailDialog, setShowStoreDetailDialog] = useState(false);

  const brandService = new BrandService();
  const storeService = new StoreService();

  // 새 매장 폼 상태
  const [newStore, setNewStore] = useState({
    name: '',
    code: '',
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
    },
    operating_hours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '22:00', closed: false },
      sunday: { open: '10:00', close: '21:00', closed: false }
    }
  });

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async () => {
    try {
      setLoading(true);
      
      // 브랜드 정보 로드
      const brandData = await brandService.getBrandById(brandId);
      setBrand(brandData);

      // 매장 목록 로드
      const storesData = await storeService.getStoresByBrand(brandId);
      setStores(storesData);
    } catch (error) {
      console.error('브랜드 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async () => {
    try {
      await storeService.createStore({
        ...newStore,
        brand_id: brandId
      });
      
      setShowStoreDialog(false);
      resetNewStoreForm();
      await loadBrandData();
    } catch (error) {
      console.error('매장 생성 실패:', error);
    }
  };

  const resetNewStoreForm = () => {
    setNewStore({
      name: '',
      code: '',
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
      },
      operating_hours: {
        monday: { open: '09:00', close: '22:00', closed: false },
        tuesday: { open: '09:00', close: '22:00', closed: false },
        wednesday: { open: '09:00', close: '22:00', closed: false },
        thursday: { open: '09:00', close: '22:00', closed: false },
        friday: { open: '09:00', close: '22:00', closed: false },
        saturday: { open: '09:00', close: '22:00', closed: false },
        sunday: { open: '10:00', close: '21:00', closed: false }
      }
    });
  };

  const toggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
    try {
      await storeService.toggleStoreStatus(storeId, !currentStatus);
      await loadBrandData();
    } catch (error) {
      console.error('매장 상태 변경 실패:', error);
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

  const formatOperatingHours = (hours: any) => {
    if (!hours) return '정보 없음';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    
    return days.map((day, index) => {
      const dayInfo = hours[day];
      if (!dayInfo) return `${dayNames[index]}: 정보 없음`;
      if (dayInfo.closed) return `${dayNames[index]}: 휴무`;
      return `${dayNames[index]}: ${dayInfo.open} - ${dayInfo.close}`;
    }).join('\n');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">로딩 중...</div>;
  }

  if (!brand) {
    return <div className="flex justify-center items-center h-64">브랜드를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {/* 브랜드 정보 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StoreIcon className="h-5 w-5" />
            {brand.name} 브랜드 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-600">브랜드 코드</div>
              <div className="font-medium">{brand.code}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">업종</div>
              <div className="font-medium">{getCategoryLabel(brand.business_category)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">총 매장 수</div>
              <div className="text-2xl font-bold text-blue-600">{stores.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-gray-600">활성 매장</div>
              <div className="text-2xl font-bold text-green-600">
                {stores.filter(s => s.is_active).length}
              </div>
            </div>
          </div>
          {brand.description && (
            <div className="mt-4">
              <div className="text-sm text-gray-600">브랜드 설명</div>
              <div className="mt-1">{brand.description}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 매장 관리 섹션 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>매장 관리</CardTitle>
            <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  매장 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>새 매장 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* 기본 정보 */}
                  <div className="space-y-4">
                    <h4 className="font-medium">기본 정보</h4>
                    <div className="grid grid-cols-2 gap-4">
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
                  </div>

                  {/* 주소 정보 */}
                  <div className="space-y-4">
                    <h4 className="font-medium">주소 정보</h4>
                    <div>
                      <Label>도로명 주소</Label>
                      <Input
                        placeholder="서울특별시 성동구 아차산로17길 49"
                        value={newStore.address.street}
                        onChange={(e) => setNewStore({
                          ...newStore,
                          address: {...newStore.address, street: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>도시</Label>
                        <Input
                          placeholder="서울특별시"
                          value={newStore.address.city}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            address: {...newStore.address, city: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label>구/군</Label>
                        <Input
                          placeholder="성동구"
                          value={newStore.address.district}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            address: {...newStore.address, district: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label>우편번호</Label>
                        <Input
                          placeholder="04799"
                          value={newStore.address.postal_code}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            address: {...newStore.address, postal_code: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="space-y-4">
                    <h4 className="font-medium">연락처 정보</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>전화번호</Label>
                        <Input
                          placeholder="02-1234-5678"
                          value={newStore.contact_info.phone}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            contact_info: {...newStore.contact_info, phone: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label>이메일</Label>
                        <Input
                          placeholder="seongsu@millab.co.kr"
                          value={newStore.contact_info.email}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            contact_info: {...newStore.contact_info, email: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label>매니저명</Label>
                        <Input
                          placeholder="김매니저"
                          value={newStore.contact_info.manager}
                          onChange={(e) => setNewStore({
                            ...newStore,
                            contact_info: {...newStore.contact_info, manager: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleCreateStore} className="w-full">
                    매장 생성
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {stores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 등록된 매장이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <Card key={store.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedStore(store);
                        setShowStoreDetailDialog(true);
                      }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{store.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={store.is_active ? "default" : "secondary"}>
                          {store.is_active ? '활성' : '비활성'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStoreStatus(store.id, store.is_active);
                          }}
                        >
                          {store.is_active ? '비활성화' : '활성화'}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">코드:</span> {store.code}
                      </div>
                      {store.description && (
                        <div className="text-sm">
                          <span className="font-medium">설명:</span> {store.description}
                        </div>
                      )}
                      {store.address && (
                        <div className="text-sm flex items-start gap-1">
                          <MapPin className="h-3 w-3 mt-0.5 text-gray-500" />
                          <div className="text-xs text-gray-600">
                            {store.address.street}<br/>
                            {store.address.district}, {store.address.city}
                          </div>
                        </div>
                      )}
                      {store.contact_info?.phone && (
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-500" />
                          <span className="text-xs">{store.contact_info.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 매장 상세 정보 다이얼로그 */}
      <Dialog open={showStoreDetailDialog} onOpenChange={setShowStoreDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StoreIcon className="h-5 w-5" />
              {selectedStore?.name} 상세 정보
            </DialogTitle>
          </DialogHeader>
          {selectedStore && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h4 className="font-medium mb-3">기본 정보</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">매장명</div>
                    <div className="font-medium">{selectedStore.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">매장 코드</div>
                    <div className="font-medium">{selectedStore.code}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">상태</div>
                    <Badge variant={selectedStore.is_active ? "default" : "secondary"}>
                      {selectedStore.is_active ? '활성' : '비활성'}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">생성일</div>
                    <div className="font-medium">
                      {new Date(selectedStore.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                </div>
                {selectedStore.description && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600">설명</div>
                    <div className="mt-1">{selectedStore.description}</div>
                  </div>
                )}
              </div>

              {/* 주소 정보 */}
              {selectedStore.address && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    주소 정보
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-gray-600">도로명 주소</div>
                      <div>{selectedStore.address.street}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">도시</div>
                        <div>{selectedStore.address.city}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">구/군</div>
                        <div>{selectedStore.address.district}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">우편번호</div>
                        <div>{selectedStore.address.postal_code}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 연락처 정보 */}
              {selectedStore.contact_info && (
                <div>
                  <h4 className="font-medium mb-3">연락처 정보</h4>
                  <div className="space-y-3">
                    {selectedStore.contact_info.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{selectedStore.contact_info.phone}</span>
                      </div>
                    )}
                    {selectedStore.contact_info.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{selectedStore.contact_info.email}</span>
                      </div>
                    )}
                    {selectedStore.contact_info.manager && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{selectedStore.contact_info.manager}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 운영 시간 */}
              {selectedStore.operating_hours && (
                <div>
                  <h4 className="font-medium mb-3">운영 시간</h4>
                  <div className="text-sm whitespace-pre-line">
                    {formatOperatingHours(selectedStore.operating_hours)}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandDashboard;