// Store Dashboard Component with Mock Data Integration

import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../services/mockDataService';
import type { MockStore, MockBrand, MockOrder, MockInventoryItem } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Store as StoreIcon, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Clock,
  TrendingUp,
  Package,
  AlertTriangle
} from 'lucide-react';
import MockDashboardAnalytics from './MockDashboardAnalytics';

interface StoreDashboardProps {
  storeId: string;
}

export const StoreDashboard: React.FC<StoreDashboardProps> = ({ storeId }) => {
  const [store, setStore] = useState<MockStore | null>(null);
  const [brand, setBrand] = useState<MockBrand | null>(null);
  const [recentOrders, setRecentOrders] = useState<MockOrder[]>([]);
  const [lowStockItems, setLowStockItems] = useState<MockInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoreData();
  }, [storeId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);

      // 매장 정보 로드
      const storeData = await mockDataService.getStore(storeId);
      setStore(storeData);

      if (storeData) {
        // 브랜드 정보 로드
        const brandData = await mockDataService.getBrand(storeData.brand_id);
        setBrand(brandData);

        // 최근 주문 로드
        const orders = await mockDataService.getOrdersByStore(storeId);
        setRecentOrders(orders.slice(0, 10)); // 최근 10개만

        // 재고 부족 상품 로드
        const lowStock = await mockDataService.getLowStockItems(storeId);
        setLowStockItems(lowStock);
      }
    } catch (error) {
      console.error('매장 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: '운영중' },
      inactive: { variant: 'secondary' as const, label: '휴업' },
      maintenance: { variant: 'destructive' as const, label: '점검중' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getOrderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: '대기중' },
      confirmed: { variant: 'default' as const, label: '확인됨' },
      preparing: { variant: 'default' as const, label: '준비중' },
      ready: { variant: 'default' as const, label: '준비완료' },
      completed: { variant: 'default' as const, label: '완료' },
      cancelled: { variant: 'destructive' as const, label: '취소' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">매장 정보 로딩 중...</div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">매장 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 매장 정보 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StoreIcon className="h-5 w-5" />
              {store.name}
            </div>
            {getStatusBadge(store.status)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 브랜드 정보 */}
            <div className="space-y-1">
              <div className="text-sm text-gray-600">브랜드</div>
              <div className="font-medium">{brand?.name || '알 수 없음'}</div>
            </div>
            
            {/* 매장 유형 */}
            <div className="space-y-1">
              <div className="text-sm text-gray-600">매장 유형</div>
              <Badge variant="outline">{store.store_type}</Badge>
            </div>
            
            {/* 주소 */}
            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                주소
              </div>
              <div className="text-sm">
                {store.address.city} {store.address.district}
              </div>
            </div>
            
            {/* 연락처 */}
            <div className="space-y-1">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                연락처
              </div>
              <div className="text-sm">{store.contact_info.phone}</div>
            </div>
          </div>
          
          {/* 상세 정보 */}
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  이메일
                </div>
                <div className="text-sm">{store.contact_info.email}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  매니저
                </div>
                <div className="text-sm">{store.contact_info.manager}</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  생성일
                </div>
                <div className="text-sm">
                  {new Date(store.created_at).toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 대시보드 탭 */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList>
          <TabsTrigger value="analytics">분석 대시보드</TabsTrigger>
          <TabsTrigger value="orders">최근 주문</TabsTrigger>
          <TabsTrigger value="inventory">재고 현황</TabsTrigger>
        </TabsList>

        {/* 분석 대시보드 탭 */}
        <TabsContent value="analytics">
          <MockDashboardAnalytics storeId={storeId} />
        </TabsContent>

        {/* 최근 주문 탭 */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                최근 주문 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{order.order_number}</div>
                        <div className="text-sm text-gray-600">
                          {order.order_type} • {new Date(order.created_at).toLocaleString('ko-KR')}
                        </div>
                        {order.customer_name && (
                          <div className="text-sm text-gray-500">
                            고객: {order.customer_name}
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                        {getOrderStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  최근 주문이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 재고 현황 탭 */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                재고 현황
                {lowStockItems.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {lowStockItems.length}개 부족
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    재고가 부족한 상품들입니다. 보충이 필요합니다.
                  </div>
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="space-y-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          카테고리: {item.category} • 단위: {item.unit}
                        </div>
                        <div className="text-sm text-gray-500">
                          공급업체: {item.supplier}
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-semibold text-red-600">
                          {item.current_stock} / {item.min_stock}
                        </div>
                        <div className="text-xs text-gray-600">현재 / 최소</div>
                        <div className="text-sm">
                          {formatCurrency(item.unit_cost)} / {item.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-green-600">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <div>모든 재고가 충분합니다!</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 새로고침 버튼 */}
      <div className="flex justify-center">
        <Button onClick={loadStoreData} variant="outline">
          데이터 새로고침
        </Button>
      </div>
    </div>
  );
};

export default StoreDashboard;