import React, { useState, useEffect } from 'react'
import { 
  Package, 
  TrendingDown, 
  AlertTriangle, 
  RotateCw,
  Download,
  Plus,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  InventoryMetricCard,
  InventoryChart,
  StockLevelIndicator,
  ExpiryAlertPanel,
  InventoryHeatmap
} from '@/components/dashboard/inventory'
import { useRealtimeInventory } from '@/hooks/inventory/useRealtimeInventory'
import { toast } from 'react-hot-toast'

// Mock data for demonstration
const mockChartData = [
  { date: '07-25', stockLevel: 85000, usage: 12000, projected: 82000 },
  { date: '07-26', stockLevel: 82000, usage: 13500, projected: 79000 },
  { date: '07-27', stockLevel: 79000, usage: 11000, projected: 77000 },
  { date: '07-28', stockLevel: 77000, usage: 14000, projected: 74000 },
  { date: '07-29', stockLevel: 74000, usage: 12500, projected: 71000 },
  { date: '07-30', stockLevel: 71000, usage: 13000, projected: 68000 },
  { date: '07-31', stockLevel: 68000, usage: 11500, projected: 65000 },
]

const mockStockItems = [
  {
    id: '1',
    name: '돼지고기 삼겹살',
    category: '육류',
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unit: 'kg'
  },
  {
    id: '2',
    name: '소고기 등심',
    category: '육류',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unit: 'kg'
  },
  {
    id: '3',
    name: '상추',
    category: '채소',
    currentStock: 30,
    minStock: 20,
    maxStock: 80,
    unit: 'kg'
  },
  {
    id: '4',
    name: '양파',
    category: '채소',
    currentStock: 60,
    minStock: 30,
    maxStock: 100,
    unit: 'kg'
  },
  {
    id: '5',
    name: '고추장',
    category: '소스/양념',
    currentStock: 12,
    minStock: 10,
    maxStock: 30,
    unit: 'kg'
  }
]

const mockExpiryItems = [
  {
    id: '1',
    productId: 'p1',
    productName: '신선 딸기',
    lotNumber: 'LOT-2025-001',
    quantity: 5,
    unit: 'kg',
    expiryDate: '2025-08-02',
    daysUntilExpiry: 2,
    location: '냉장고 A',
    category: '과일'
  },
  {
    id: '2',
    productId: 'p2',
    productName: '우유',
    lotNumber: 'LOT-2025-002',
    quantity: 20,
    unit: 'L',
    expiryDate: '2025-08-05',
    daysUntilExpiry: 5,
    location: '냉장고 B',
    category: '유제품'
  },
  {
    id: '3',
    productId: 'p3',
    productName: '요거트',
    lotNumber: 'LOT-2025-003',
    quantity: 30,
    unit: '개',
    expiryDate: '2025-08-10',
    daysUntilExpiry: 10,
    location: '냉장고 B',
    category: '유제품'
  }
]

const mockHeatmapItems = [
  // 육류
  { id: '1', name: '돼지고기', category: '육류', location: '성수점', value: 45, maxValue: 100, unit: 'kg' },
  { id: '2', name: '소고기', category: '육류', location: '성수점', value: 15, maxValue: 50, unit: 'kg' },
  { id: '3', name: '닭고기', category: '육류', location: '성수점', value: 30, maxValue: 60, unit: 'kg' },
  { id: '4', name: '돼지고기', category: '육류', location: '강남점', value: 60, maxValue: 100, unit: 'kg' },
  { id: '5', name: '소고기', category: '육류', location: '강남점', value: 35, maxValue: 50, unit: 'kg' },
  
  // 채소
  { id: '6', name: '상추', category: '채소', location: '성수점', value: 30, maxValue: 80, unit: 'kg' },
  { id: '7', name: '양파', category: '채소', location: '성수점', value: 60, maxValue: 100, unit: 'kg' },
  { id: '8', name: '마늘', category: '채소', location: '성수점', value: 20, maxValue: 40, unit: 'kg' },
  { id: '9', name: '상추', category: '채소', location: '강남점', value: 50, maxValue: 80, unit: 'kg' },
  { id: '10', name: '양파', category: '채소', location: '강남점', value: 80, maxValue: 100, unit: 'kg' },
  
  // 소스/양념
  { id: '11', name: '고추장', category: '소스/양념', location: '성수점', value: 12, maxValue: 30, unit: 'kg' },
  { id: '12', name: '된장', category: '소스/양념', location: '성수점', value: 15, maxValue: 25, unit: 'kg' },
  { id: '13', name: '간장', category: '소스/양념', location: '강남점', value: 20, maxValue: 30, unit: 'L' },
]

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Use realtime inventory hook
  const { isConnected, lastUpdate, refresh } = useRealtimeInventory({
    companyId: 'company-1', // This would come from auth context
    onUpdate: (update) => {
      console.log('Inventory update:', update)
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
          <h1 className="text-2xl font-bold">재고 관리</h1>
          <p className="text-muted-foreground mt-1">
            실시간 재고 현황 및 관리
            {isConnected && (
              <span className="ml-2 text-xs text-secondary">● 실시간 연결됨</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            보고서 다운로드
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            재고 추가
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InventoryMetricCard
          title="총 재고 가치"
          value="₩125,420,000"
          change={12.5}
          changeLabel="지난 달 대비"
          icon={<Package className="h-5 w-5" />}
          status="success"
          description="전체 브랜드 합계"
        />
        <InventoryMetricCard
          title="재고 부족 품목"
          value="8개"
          change={-20}
          changeLabel="지난 주 대비"
          icon={<TrendingDown className="h-5 w-5" />}
          status="warning"
          trend="down"
        />
        <InventoryMetricCard
          title="유통기한 임박"
          value="12개"
          change={33}
          changeLabel="지난 주 대비"
          icon={<AlertTriangle className="h-5 w-5" />}
          status="danger"
          trend="up"
        />
        <InventoryMetricCard
          title="재고 회전율"
          value="4.2회"
          change={5}
          changeLabel="목표 대비"
          icon={<RotateCw className="h-5 w-5" />}
          status="info"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">전체 현황</TabsTrigger>
          <TabsTrigger value="stock-levels">재고 수준</TabsTrigger>
          <TabsTrigger value="expiry">유통기한 관리</TabsTrigger>
          <TabsTrigger value="distribution">재고 분포</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <InventoryChart
              data={mockChartData}
              title="재고 추이 분석"
              description="최근 7일간 재고 변화 추이"
              height={350}
            />
            <StockLevelIndicator
              items={mockStockItems}
              title="주요 품목 재고 현황"
              onItemClick={handleStockItemClick}
            />
          </div>
          <ExpiryAlertPanel
            items={mockExpiryItems}
            onAction={handleExpiryAction}
          />
        </TabsContent>

        <TabsContent value="stock-levels" className="space-y-4">
          <StockLevelIndicator
            items={mockStockItems}
            title="전체 재고 수준"
            onItemClick={handleStockItemClick}
          />
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <ExpiryAlertPanel
            items={mockExpiryItems}
            title="유통기한 관리"
            onAction={handleExpiryAction}
          />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <InventoryHeatmap
            items={mockHeatmapItems}
            title="매장별 재고 분포"
            onCellClick={handleHeatmapCellClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}