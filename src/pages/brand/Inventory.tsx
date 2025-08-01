import React, { useState } from 'react'
import { 
  Package, 
  TrendingUp, 
  Clock, 
  ShoppingCart,
  Download,
  Plus,
  RefreshCw,
  Store
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  InventoryMetricCard,
  InventoryChart,
  StockLevelIndicator,
  ExpiryAlertPanel,
  InventoryHeatmap
} from '@/components/dashboard/inventory'
import { useRealtimeInventory } from '@/hooks/inventory/useRealtimeInventory'
import { toast } from 'react-hot-toast'

// Mock data - brand specific
const mockBrandChartData = [
  { date: '07-25', stockLevel: 28000, usage: 4000, projected: 27000 },
  { date: '07-26', stockLevel: 27000, usage: 4500, projected: 26000 },
  { date: '07-27', stockLevel: 26000, usage: 3500, projected: 25500 },
  { date: '07-28', stockLevel: 25500, usage: 4800, projected: 24000 },
  { date: '07-29', stockLevel: 24000, usage: 4200, projected: 23000 },
  { date: '07-30', stockLevel: 23000, usage: 4300, projected: 22000 },
  { date: '07-31', stockLevel: 22000, usage: 3800, projected: 21500 },
]

const mockBrandStockItems = [
  {
    id: '1',
    name: '밀랍 떡볶이 떡',
    category: '주재료',
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    unit: 'kg'
  },
  {
    id: '2',
    name: '밀랍 특제 소스',
    category: '소스',
    currentStock: 40,
    minStock: 30,
    maxStock: 100,
    unit: 'L'
  },
  {
    id: '3',
    name: '어묵',
    category: '부재료',
    currentStock: 80,
    minStock: 40,
    maxStock: 150,
    unit: 'kg'
  },
  {
    id: '4',
    name: '모짜렐라 치즈',
    category: '토핑',
    currentStock: 25,
    minStock: 20,
    maxStock: 60,
    unit: 'kg'
  },
  {
    id: '5',
    name: '포장 용기',
    category: '포장재',
    currentStock: 500,
    minStock: 300,
    maxStock: 1000,
    unit: '개'
  }
]

const mockBrandExpiryItems = [
  {
    id: '1',
    productId: 'p1',
    productName: '밀랍 특제 소스',
    lotNumber: 'MR-LOT-2025-001',
    quantity: 10,
    unit: 'L',
    expiryDate: '2025-08-03',
    daysUntilExpiry: 3,
    location: '성수점 창고',
    category: '소스'
  },
  {
    id: '2',
    productId: 'p2',
    productName: '모짜렐라 치즈',
    lotNumber: 'MR-LOT-2025-002',
    quantity: 5,
    unit: 'kg',
    expiryDate: '2025-08-07',
    daysUntilExpiry: 7,
    location: '강남점 냉장고',
    category: '토핑'
  }
]

const mockBrandHeatmapItems = [
  // 성수점
  { id: '1', name: '떡볶이 떡', category: '주재료', location: '성수점', value: 60, maxValue: 100, unit: 'kg' },
  { id: '2', name: '특제 소스', category: '소스', location: '성수점', value: 20, maxValue: 50, unit: 'L' },
  { id: '3', name: '어묵', category: '부재료', location: '성수점', value: 40, maxValue: 75, unit: 'kg' },
  { id: '4', name: '치즈', category: '토핑', location: '성수점', value: 12, maxValue: 30, unit: 'kg' },
  { id: '5', name: '포장용기', category: '포장재', location: '성수점', value: 250, maxValue: 500, unit: '개' },
  
  // 강남점
  { id: '6', name: '떡볶이 떡', category: '주재료', location: '강남점', value: 60, maxValue: 100, unit: 'kg' },
  { id: '7', name: '특제 소스', category: '소스', location: '강남점', value: 20, maxValue: 50, unit: 'L' },
  { id: '8', name: '어묵', category: '부재료', location: '강남점', value: 40, maxValue: 75, unit: 'kg' },
  { id: '9', name: '치즈', category: '토핑', location: '강남점', value: 13, maxValue: 30, unit: 'kg' },
  { id: '10', name: '포장용기', category: '포장재', location: '강남점', value: 250, maxValue: 500, unit: '개' },
]

export default function BrandInventory() {
  const [activeTab, setActiveTab] = useState('store-overview')
  const [selectedStore, setSelectedStore] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Use realtime inventory hook
  const { isConnected, lastUpdate, refresh } = useRealtimeInventory({
    brandId: 'brand-1', // This would come from auth context
    onUpdate: (update) => {
      console.log('Brand inventory update:', update)
    }
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success('재고 데이터가 업데이트되었습니다')
    }, 1000)
  }

  const handleExpiryAction = (action: string, item: any) => {
    toast.success(`${item.productName} - ${action} 처리 중...`)
  }

  const handleStockItemClick = (item: any) => {
    toast.success(`${item.name} 상세 정보 보기`)
  }

  const handleHeatmapCellClick = (item: any) => {
    toast.success(`${item.category} - ${item.location} 상세 보기`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">브랜드 재고 관리</h1>
          <p className="text-muted-foreground mt-1">
            밀랍 브랜드 재고 현황
            {isConnected && (
              <span className="ml-2 text-xs text-secondary">● 실시간 연결됨</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="매장 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 매장</SelectItem>
              <SelectItem value="seongsu">성수점</SelectItem>
              <SelectItem value="gangnam">강남점</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            새로고침
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            보고서
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            재고 추가
          </Button>
        </div>
      </div>

      {/* Metric Cards - Brand specific metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InventoryMetricCard
          title="브랜드 재고 가치"
          value="₩42,150,000"
          change={8.2}
          changeLabel="지난 달 대비"
          icon={<Package className="h-5 w-5" />}
          status="success"
          description="밀랍 전체 매장"
        />
        <InventoryMetricCard
          title="일평균 판매량"
          value="320개"
          change={15}
          changeLabel="지난 주 대비"
          icon={<TrendingUp className="h-5 w-5" />}
          status="success"
          trend="up"
        />
        <InventoryMetricCard
          title="재고 소진 예상"
          value="7.2일"
          change={-10}
          changeLabel="평균 대비"
          icon={<Clock className="h-5 w-5" />}
          status="warning"
        />
        <InventoryMetricCard
          title="매장 간 이동 대기"
          value="5건"
          icon={<Store className="h-5 w-5" />}
          status="info"
          description="승인 대기 중"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="store-overview">매장별 현황</TabsTrigger>
          <TabsTrigger value="ingredients">원재료 관리</TabsTrigger>
          <TabsTrigger value="products">완제품 재고</TabsTrigger>
          <TabsTrigger value="transfers">재고 이동</TabsTrigger>
        </TabsList>

        <TabsContent value="store-overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InventoryChart
              data={mockBrandChartData}
              title="브랜드 재고 추이"
              description="밀랍 전체 매장 재고 변화"
              height={350}
              series={[
                { dataKey: 'stockLevel', name: '재고량', color: 'hsl(243 76% 59%)' },
                { dataKey: 'usage', name: '일 사용량', color: 'hsl(173 80% 40%)' },
                { dataKey: 'projected', name: '예상 재고', color: 'hsl(38 92% 50%)' }
              ]}
            />
            <InventoryHeatmap
              items={mockBrandHeatmapItems}
              title="매장별 재고 현황"
              onCellClick={handleHeatmapCellClick}
            />
          </div>
          <StockLevelIndicator
            items={mockBrandStockItems}
            title="주요 품목 재고 수준"
            onItemClick={handleStockItemClick}
          />
        </TabsContent>

        <TabsContent value="ingredients" className="space-y-4">
          <StockLevelIndicator
            items={mockBrandStockItems.filter(item => 
              ['주재료', '부재료', '소스', '토핑'].includes(item.category)
            )}
            title="원재료 재고 현황"
            onItemClick={handleStockItemClick}
          />
          <ExpiryAlertPanel
            items={mockBrandExpiryItems}
            title="원재료 유통기한 관리"
            onAction={handleExpiryAction}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            완제품 재고 관리 기능 (개발 예정)
          </div>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            매장 간 재고 이동 관리 (개발 예정)
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}