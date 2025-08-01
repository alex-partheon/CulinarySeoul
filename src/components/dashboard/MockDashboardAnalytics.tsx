// Mock Dashboard Analytics Component for testing Supabase integration

import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../services/mockDataService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import type { MockOrder, MockInventoryItem, MockStore, MockBrand } from '../../data/mockData';

interface MockDashboardAnalyticsProps {
  storeId?: string;
  brandId?: string;
  companyId?: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalCost: number;
  totalOrders: number;
  avgOrderValue: number;
  profitMargin: number;
  orders: MockOrder[];
}

interface TopSellingItem {
  id: string;
  name: string;
  totalQuantity: number;
  totalRevenue: number;
  totalCost: number;
  avgPrice: number;
  profit: number;
  profitMargin: number;
}

export const MockDashboardAnalytics: React.FC<MockDashboardAnalyticsProps> = ({
  storeId,
  brandId,
  companyId
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [topSellingItems, setTopSellingItems] = useState<TopSellingItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<MockInventoryItem[]>([]);
  const [stores, setStores] = useState<MockStore[]>([]);
  const [brands, setBrands] = useState<MockBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [storeId, brandId, companyId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // 분석 데이터 로드
      const analytics = await mockDataService.getDashboardAnalytics(storeId, brandId);
      setAnalyticsData(analytics);

      // 인기 상품 로드
      const topItems = await mockDataService.getTopSellingItems(storeId, brandId, 5);
      setTopSellingItems(topItems);

      // 재고 부족 상품 로드 (매장별로만)
      if (storeId) {
        const lowStock = await mockDataService.getLowStockItems(storeId);
        setLowStockItems(lowStock);
      }

      // 매장 목록 로드
      if (brandId) {
        const storeList = await mockDataService.getStoresByBrand(brandId);
        setStores(storeList);
      } else if (companyId) {
        const brandList = await mockDataService.getBrands(companyId);
        setBrands(brandList);
        
        const allStores: MockStore[] = [];
        for (const brand of brandList) {
          const brandStores = await mockDataService.getStoresByBrand(brand.id);
          allStores.push(...brandStores);
        }
        setStores(allStores);
      }
    } catch (error) {
      console.error('분석 데이터 로드 실패:', error);
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

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">분석 데이터 로딩 중...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">분석 데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">대시보드 분석</h2>
          <p className="text-gray-600">
            {storeId ? '매장별' : brandId ? '브랜드별' : '전체'} 실시간 데이터 (Mock)
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Mock 데이터
        </Badge>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% 전월 대비
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 주문</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% 전월 대비
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 주문액</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analyticsData.avgOrderValue)}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2.1% 전월 대비
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">수익률</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(analyticsData.profitMargin)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1.8% 전월 대비
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 상세 분석 탭 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="products">인기 상품</TabsTrigger>
          {storeId && <TabsTrigger value="inventory">재고 현황</TabsTrigger>}
          <TabsTrigger value="stores">매장 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 수익 분석 */}
            <Card>
              <CardHeader>
                <CardTitle>수익 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 매출</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">총 원가</span>
                    <span className="font-semibold">{formatCurrency(analyticsData.totalCost)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">순이익</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(analyticsData.totalRevenue - analyticsData.totalCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 최근 주문 */}
            <Card>
              <CardHeader>
                <CardTitle>최근 주문</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.orders.slice(0, 5).map((order) => {
                    const store = stores.find(s => s.id === order.store_id);
                    return (
                      <div key={order.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{order.order_number}</div>
                          <div className="text-sm text-gray-600">
                            {store?.name || '알 수 없는 매장'} • {order.order_type}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                          <Badge 
                            variant={order.status === 'completed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>인기 상품 TOP 5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          판매량: {item.totalQuantity}개 • 평균가: {formatCurrency(item.avgPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.totalRevenue)}</div>
                      <div className="text-sm text-green-600">
                        수익률: {formatPercent(item.profitMargin)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {storeId && (
          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>재고 현황</span>
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
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">
                              카테고리: {item.category} • 단위: {item.unit}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-red-600">
                            {item.current_stock} / {item.min_stock}
                          </div>
                          <div className="text-sm text-gray-600">현재 / 최소</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>모든 재고가 충분합니다</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="stores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>매장 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => {
                  const storeOrders = analyticsData.orders.filter(o => o.store_id === store.id);
                  const storeRevenue = storeOrders.reduce((sum, order) => sum + order.total_amount, 0);
                  
                  return (
                    <Card key={store.id} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{store.name}</CardTitle>
                        <Badge variant="outline" className="w-fit">
                          {store.store_type}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">매출</span>
                            <span className="font-semibold">{formatCurrency(storeRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">주문수</span>
                            <span className="font-semibold">{storeOrders.length}건</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">상태</span>
                            <Badge 
                              variant={store.status === 'active' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {store.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 새로고침 버튼 */}
      <div className="flex justify-center">
        <Button onClick={loadAnalyticsData} variant="outline">
          데이터 새로고침
        </Button>
      </div>
    </div>
  );
};

export default MockDashboardAnalytics;