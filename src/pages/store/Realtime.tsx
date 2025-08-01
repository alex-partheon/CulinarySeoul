import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { LiveMetricCard } from '@/components/dashboard/shared/LiveMetricCard';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/shared/ActivityFeed';
import { StatusIndicator } from '@/components/dashboard/shared/StatusIndicator';
import { OrderTracker, type Order } from '@/components/dashboard/shared/OrderTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { 
  Activity,
  ShoppingBag,
  Clock,
  Users,
  ChefHat,
  Table,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Utensils,
  Truck,
  Timer,
  TrendingUp
} from 'lucide-react';

export default function StoreRealtime() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState<'kitchen' | 'hall' | 'delivery'>('kitchen');
  
  // Simulated real-time data
  const [metrics, setMetrics] = useState({
    activeOrders: 12,
    avgWaitTime: 8.5,
    tablesOccupied: 8,
    staffOnDuty: 5
  });

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'order',
      title: '새 주문 접수',
      description: '테이블 5번 - 아메리카노 2, 샌드위치 1',
      timestamp: new Date(Date.now() - 10000),
      value: '₩18,500',
      status: 'success',
      isNew: true
    },
    {
      id: '2',
      type: 'system',
      title: 'POS 연결 복구',
      description: 'POS 시스템이 정상적으로 연결되었습니다',
      timestamp: new Date(Date.now() - 30000),
      status: 'success'
    },
    {
      id: '3',
      type: 'staff',
      title: '직원 휴식 시작',
      description: '김바리스타 15분 휴식',
      timestamp: new Date(Date.now() - 60000),
      status: 'info'
    }
  ]);

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '101',
      customer: '테이블 3',
      items: ['아메리카노 2', '카푸치노 1'],
      status: 'preparing',
      type: 'dine-in',
      estimatedTime: 5,
      elapsedTime: 2,
      assignedStaff: '이바리스타'
    },
    {
      id: '2',
      orderNumber: '102',
      customer: '포장 주문',
      items: ['샌드위치 세트 2'],
      status: 'received',
      type: 'takeout',
      estimatedTime: 10,
      elapsedTime: 1,
      priority: 'rush'
    },
    {
      id: '3',
      orderNumber: '103',
      customer: '배달 주문',
      items: ['라떼 3', '케이크 1'],
      status: 'ready',
      type: 'delivery',
      estimatedTime: 8,
      elapsedTime: 8,
      assignedStaff: '박배달'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeOrders: prev.activeOrders + Math.floor(Math.random() * 3 - 1),
        avgWaitTime: Math.max(5, prev.avgWaitTime + (Math.random() * 0.5 - 0.25)),
        tablesOccupied: Math.min(12, Math.max(0, prev.tablesOccupied + Math.floor(Math.random() * 2 - 1))),
        staffOnDuty: prev.staffOnDuty
      }));

      // Update order elapsed times
      setOrders(prev => prev.map(order => ({
        ...order,
        elapsedTime: Math.min(order.estimatedTime + 2, order.elapsedTime + 0.5)
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const systemStatuses = [
    { name: 'POS 시스템', status: 'online' as const, latency: 15, description: '정상 작동' },
    { name: '주방 디스플레이', status: 'online' as const, latency: 8 },
    { name: '결제 단말기', status: 'online' as const, latency: 32 }
  ];

  const equipmentStatus = [
    { name: '커피 머신 1', status: 'active', usage: 85, temperature: 92 },
    { name: '커피 머신 2', status: 'active', usage: 62, temperature: 91 },
    { name: '오븐', status: 'warning', usage: 95, temperature: 180 },
    { name: '냉장고', status: 'active', usage: 45, temperature: 4 }
  ];

  const tableStatus = [
    { number: 1, status: 'occupied', guests: 2, duration: 25 },
    { number: 2, status: 'occupied', guests: 4, duration: 45 },
    { number: 3, status: 'reserved', guests: 0, duration: 0 },
    { number: 4, status: 'available', guests: 0, duration: 0 },
    { number: 5, status: 'occupied', guests: 3, duration: 15 },
    { number: 6, status: 'cleaning', guests: 0, duration: 0 },
    { number: 7, status: 'available', guests: 0, duration: 0 },
    { number: 8, status: 'occupied', guests: 2, duration: 5 }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('online');
      setIsLoading(false);
      toast.success('데이터가 새로고침되었습니다');
    }, 1500);
  };

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'available':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'cleaning':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTableStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return '사용중';
      case 'reserved':
        return '예약됨';
      case 'available':
        return '이용가능';
      case 'cleaning':
        return '정리중';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매장 실시간 모니터링</h1>
          <p className="text-gray-600 mt-1">{storeId} 매장의 실시간 운영 현황입니다</p>
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
          <Button onClick={() => navigate(`/store/${storeId}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveMetricCard
          title="진행중 주문"
          value={metrics.activeOrders}
          unit="건"
          icon={ShoppingBag}
          iconColor="text-blue-600"
          trend="up"
          description="현재 처리중"
          pulse={true}
        />
        <LiveMetricCard
          title="평균 대기시간"
          value={metrics.avgWaitTime.toFixed(1)}
          unit="분"
          icon={Clock}
          iconColor="text-orange-600"
          status={metrics.avgWaitTime > 10 ? 'warning' : 'active'}
          description="주문 후 제공까지"
          pulse={true}
        />
        <LiveMetricCard
          title="테이블 현황"
          value={`${metrics.tablesOccupied}/12`}
          icon={Table}
          iconColor="text-purple-600"
          description="사용중인 테이블"
          pulse={true}
        />
        <LiveMetricCard
          title="근무 직원"
          value={metrics.staffOnDuty}
          unit="명"
          icon={Users}
          iconColor="text-green-600"
          status="active"
          description="현재 근무중"
          pulse={false}
        />
      </div>

      {/* Department View Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kitchen" className="flex items-center gap-2">
            <ChefHat className="h-4 w-4" />
            주방
          </TabsTrigger>
          <TabsTrigger value="hall" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            홀
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            배달
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kitchen" className="space-y-6 mt-6">
          {/* Kitchen View */}
          <OrderTracker
            orders={orders.filter(o => o.status === 'received' || o.status === 'preparing')}
            viewMode="kanban"
            onOrderClick={(order) => {
              toast.success(`주문 상세: #${order.orderNumber}`);
            }}
            showStats={false}
          />

          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">주방 장비 상태</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {equipmentStatus.map((equipment) => (
                  <div key={equipment.name} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{equipment.name}</span>
                      <Badge
                        variant={equipment.status === 'warning' ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {equipment.status === 'active' ? '정상' : '점검필요'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">사용률</span>
                        <span>{equipment.usage}%</span>
                      </div>
                      <Progress value={equipment.usage} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-gray-600">온도</span>
                        <span>{equipment.temperature}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hall" className="space-y-6 mt-6">
          {/* Table Status Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                테이블 현황
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs bg-green-50">
                    이용가능 {tableStatus.filter(t => t.status === 'available').length}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-red-50">
                    사용중 {tableStatus.filter(t => t.status === 'occupied').length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {tableStatus.map((table) => (
                  <div
                    key={table.number}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      "hover:shadow-md",
                      getTableStatusColor(table.status)
                    )}
                    onClick={() => toast.success(`테이블 ${table.number} 상세 정보`)}
                  >
                    <div className="text-center">
                      <p className="text-lg font-bold">T{table.number}</p>
                      <p className="text-xs mt-1">{getTableStatusText(table.status)}</p>
                      {table.status === 'occupied' && (
                        <>
                          <p className="text-xs mt-1">{table.guests}명</p>
                          <p className="text-xs text-gray-600">{table.duration}분</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hall Orders */}
          <OrderTracker
            orders={orders.filter(o => o.type === 'dine-in')}
            viewMode="list"
            onOrderClick={(order) => {
              toast.success(`주문 상세: #${order.orderNumber}`);
            }}
            showStats={false}
            maxHeight="300px"
          />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6 mt-6">
          {/* Delivery Orders */}
          <OrderTracker
            orders={orders.filter(o => o.type === 'delivery' || o.type === 'takeout')}
            viewMode="kanban"
            onOrderClick={(order) => {
              toast.success(`주문 상세: #${order.orderNumber}`);
            }}
            showStats={true}
          />
        </TabsContent>
      </Tabs>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed
            activities={activities}
            onActivityClick={(activity) => {
              toast.success(`활동 상세: ${activity.title}`);
            }}
            maxHeight="350px"
            autoScroll={true}
            showFilters={false}
            title="매장 활동"
            updateInterval={5000}
          />
        </div>

        {/* System Status */}
        <div>
          <StatusIndicator
            connectionStatus={connectionStatus}
            systemStatuses={systemStatuses}
            showDetails={true}
            variant="detailed"
            onRefresh={handleRefresh}
          />
        </div>
      </div>
    </div>
  );
}