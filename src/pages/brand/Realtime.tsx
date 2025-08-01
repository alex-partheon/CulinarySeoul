import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { LiveMetricCard } from '@/components/dashboard/shared/LiveMetricCard'
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/shared/ActivityFeed'
import { StatusIndicator } from '@/components/dashboard/shared/StatusIndicator'
import { OrderTracker, type Order } from '@/components/dashboard/shared/OrderTracker'
import { SummaryChart } from '@/components/dashboard/shared/SummaryChart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Store,
  Clock,
  Package,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  ChefHat
} from 'lucide-react'

export default function BrandRealtime() {
  const { brandId } = useParams<{ brandId: string }>()
  const navigate = useNavigate()
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStore, setSelectedStore] = useState<string>('all')
  
  // Simulated real-time data
  const [metrics, setMetrics] = useState({
    activeStores: 12,
    currentOrders: 78,
    activeStaff: 145,
    inventoryAlerts: 3
  })

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'order',
      title: '대량 주문 접수',
      description: '강남점에서 아메리카노 20잔 주문',
      timestamp: new Date(Date.now() - 15000),
      location: '강남점',
      value: '₩90,000',
      status: 'success',
      isNew: true
    },
    {
      id: '2',
      type: 'staff',
      title: '직원 교대 근무',
      description: '성수점 오후 근무조 시작',
      timestamp: new Date(Date.now() - 45000),
      location: '성수점',
      value: '5명',
      status: 'info'
    },
    {
      id: '3',
      type: 'inventory',
      title: '재고 보충 완료',
      description: '판교점 원두 재고 보충',
      timestamp: new Date(Date.now() - 120000),
      location: '판교점',
      status: 'success'
    }
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'B156',
      customer: '김철수',
      items: ['아메리카노 2', '라떼 1'],
      status: 'preparing',
      type: 'takeout',
      estimatedTime: 10,
      elapsedTime: 3,
      location: '강남점',
      assignedStaff: '이바리스타'
    },
    {
      id: '2',
      orderNumber: 'B157',
      customer: '박영희',
      items: ['샌드위치 세트'],
      status: 'received',
      type: 'dine-in',
      estimatedTime: 15,
      elapsedTime: 1,
      location: '성수점',
      priority: 'rush'
    },
    {
      id: '3',
      orderNumber: 'B158',
      customer: '최민수',
      items: ['콜드브루 3'],
      status: 'ready',
      type: 'delivery',
      estimatedTime: 8,
      elapsedTime: 8,
      location: '판교점',
      assignedStaff: '김배달'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeStores: prev.activeStores,
        currentOrders: prev.currentOrders + Math.floor(Math.random() * 3 - 1),
        activeStaff: prev.activeStaff + Math.floor(Math.random() * 2 - 1),
        inventoryAlerts: Math.max(0, prev.inventoryAlerts + Math.floor(Math.random() * 2 - 1))
      }))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const systemStatuses = [
    { name: 'POS 시스템', status: 'online' as const, latency: 23, description: '전 매장 정상' },
    { name: '재고 관리', status: 'online' as const, latency: 45, description: '실시간 동기화' },
    { name: '배달 플랫폼', status: 'warning' as const, latency: 156, description: '일부 지연' }
  ]

  const storeData = [
    { name: '강남점', status: 'active', orders: 25, staff: 12, efficiency: 95 },
    { name: '성수점', status: 'active', orders: 18, staff: 10, efficiency: 88 },
    { name: '판교점', status: 'active', orders: 22, staff: 11, efficiency: 92 },
    { name: '홍대점', status: 'warning', orders: 8, staff: 8, efficiency: 72 },
    { name: '여의도점', status: 'active', orders: 15, staff: 9, efficiency: 85 }
  ]

  const hourlyOrderData = Array.from({ length: 8 }, (_, i) => ({
    name: `${9 + i}시`,
    주문수: Math.floor(Math.random() * 30 + 20),
    완료율: Math.floor(Math.random() * 20 + 80)
  }))

  const handleRefresh = () => {
    setIsLoading(true)
    setConnectionStatus('connecting')
    
    setTimeout(() => {
      setConnectionStatus('online')
      setIsLoading(false)
      toast.success('데이터가 새로고침되었습니다')
    }, 1500)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">브랜드 실시간 모니터링</h1>
          <p className="text-gray-600 mt-1">{brandId} 브랜드의 모든 매장 현황을 실시간으로 확인합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator
            connectionStatus={connectionStatus}
            variant="compact"
            showDetails={false}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            새로고침
          </Button>
          <Button onClick={() => navigate(`/brand/${brandId}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveMetricCard
          title="활성 매장"
          value={`${metrics.activeStores}/15`}
          icon={Store}
          iconColor="text-blue-600"
          status="active"
          description="영업 중인 매장"
          pulse={false}
        />
        <LiveMetricCard
          title="실시간 주문"
          value={metrics.currentOrders}
          unit="건"
          icon={ShoppingBag}
          iconColor="text-purple-600"
          trend="up"
          description="처리 중인 주문"
          pulse={true}
        />
        <LiveMetricCard
          title="근무 직원"
          value={metrics.activeStaff}
          unit="명"
          icon={Users}
          iconColor="text-green-600"
          description="현재 근무 중"
          pulse={true}
        />
        <LiveMetricCard
          title="재고 알림"
          value={metrics.inventoryAlerts}
          unit="건"
          icon={Package}
          iconColor="text-orange-600"
          status={metrics.inventoryAlerts > 5 ? 'warning' : 'active'}
          description="주의 필요"
          pulse={true}
        />
      </div>

      {/* Order Tracker */}
      <OrderTracker
        orders={orders}
        viewMode="kanban"
        onOrderClick={(order) => {
          toast.success(`주문 상세: #${order.orderNumber}`)
        }}
        showStats={true}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                매장별 실시간 현황
                <Tabs value={selectedStore} onValueChange={setSelectedStore}>
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-xs">전체</TabsTrigger>
                    <TabsTrigger value="강남점" className="text-xs">강남</TabsTrigger>
                    <TabsTrigger value="성수점" className="text-xs">성수</TabsTrigger>
                    <TabsTrigger value="판교점" className="text-xs">판교</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(selectedStore === 'all' ? storeData : storeData.filter(s => s.name === selectedStore)).map((store) => (
                  <div
                    key={store.name}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/store/${store.name.toLowerCase()}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-3 w-3 rounded-full",
                          store.status === 'active' ? "bg-green-500" : "bg-yellow-500"
                        )} />
                        <span className="font-medium">{store.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        효율 {store.efficiency}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">주문</p>
                        <p className="font-semibold">{store.orders}건</p>
                      </div>
                      <div>
                        <p className="text-gray-600">직원</p>
                        <p className="font-semibold">{store.staff}명</p>
                      </div>
                      <div>
                        <p className="text-gray-600">상태</p>
                        <p className="font-semibold">
                          {store.status === 'active' ? '정상' : '주의'}
                        </p>
                      </div>
                    </div>
                    <Progress value={store.efficiency} className="mt-2 h-1.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hourly Performance */}
          <SummaryChart
            title="시간별 주문 현황"
            data={hourlyOrderData}
            type="area"
            dataKeys={['주문수', '완료율']}
            colors={['#8B5CF6', '#10B981']}
            height={250}
            showLegend={true}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <StatusIndicator
            connectionStatus={connectionStatus}
            systemStatuses={systemStatuses}
            showDetails={true}
            variant="detailed"
            onRefresh={handleRefresh}
          />

          {/* Activity Feed */}
          <ActivityFeed
            activities={activities}
            onActivityClick={(activity) => {
              toast.success(`활동 상세: ${activity.title}`)
            }}
            maxHeight="400px"
            autoScroll={true}
            showFilters={false}
            title="브랜드 활동"
            updateInterval={5000}
          />

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">실시간 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">평균 주문 처리 시간</span>
                <Badge variant="secondary" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  8.5분
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">시간당 주문량</span>
                <span className="text-sm font-semibold">23.5건</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">직원 생산성</span>
                <span className="text-sm font-semibold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">고객 만족도</span>
                <span className="text-sm font-semibold">4.7/5.0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}