import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { LiveMetricCard } from '@/components/dashboard/shared/LiveMetricCard';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/shared/ActivityFeed';
import { StatusIndicator } from '@/components/dashboard/shared/StatusIndicator';
import { SummaryChart } from '@/components/dashboard/shared/SummaryChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import {
  Users,
  ShoppingBag,
  DollarSign,
  Store,
  Activity,
  TrendingUp,
  AlertTriangle,
  Wifi,
  RefreshCw,
  BarChart3,
  Globe
} from 'lucide-react';

export default function RealtimePage() {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'connecting'>('online');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulated real-time data updates
  const [metrics, setMetrics] = useState({
    activeUsers: 3842,
    currentOrders: 156,
    revenue: 4250000,
    activeStores: 45
  });

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'order',
      title: '대량 주문 접수',
      description: '밀랍 강남점에서 50잔 단체 주문',
      timestamp: new Date(Date.now() - 30000),
      location: '강남점',
      value: '₩375,000',
      status: 'success',
      isNew: true
    },
    {
      id: '2',
      type: 'alert',
      title: '재고 부족 경고',
      description: '브루잉 성수점 원두 재고 10% 이하',
      timestamp: new Date(Date.now() - 60000),
      location: '성수점',
      status: 'warning',
      isNew: true
    },
    {
      id: '3',
      type: 'staff',
      title: '직원 근무 시작',
      description: '오전 근무조 125명 출근 완료',
      timestamp: new Date(Date.now() - 120000),
      value: '125명',
      status: 'info'
    },
    {
      id: '4',
      type: 'system',
      title: 'POS 시스템 업데이트',
      description: '전 매장 POS v2.5.1 배포 완료',
      timestamp: new Date(Date.now() - 300000),
      status: 'success'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with random variations
      setMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
        currentOrders: prev.currentOrders + Math.floor(Math.random() * 10 - 5),
        revenue: prev.revenue + Math.floor(Math.random() * 50000 - 25000),
        activeStores: prev.activeStores
      }));

      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          type: ['order', 'staff', 'inventory', 'alert', 'system'][Math.floor(Math.random() * 5)] as any,
          title: ['새 주문', '직원 활동', '재고 변동', '시스템 알림', '고객 피드백'][Math.floor(Math.random() * 5)],
          description: '실시간 업데이트된 활동입니다',
          timestamp: new Date(),
          location: ['강남점', '성수점', '판교점', '홍대점'][Math.floor(Math.random() * 4)],
          isNew: true
        };
        
        setActivities(prev => [newActivity, ...prev].slice(0, 20));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const systemStatuses = [
    { name: 'API 서버', status: 'online' as const, latency: 45, description: 'AWS Seoul' },
    { name: '데이터베이스', status: 'online' as const, latency: 12, description: 'RDS Primary' },
    { name: 'POS 연동', status: 'warning' as const, latency: 156, description: '일부 지연' },
    { name: '결제 시스템', status: 'online' as const, latency: 89, description: 'Toss Payments' }
  ];

  const brandRealtimeData = [
    { name: '밀랍', users: 1245, orders: 45, revenue: 1250000, trend: 'up' as const },
    { name: '브루잉', users: 987, orders: 38, revenue: 980000, trend: 'up' as const },
    { name: '로스터리', users: 654, orders: 28, revenue: 720000, trend: 'down' as const },
    { name: '베이커리', users: 543, orders: 22, revenue: 560000, trend: 'stable' as const },
    { name: '델리', users: 413, orders: 23, revenue: 740000, trend: 'up' as const }
  ];

  const realtimeChartData = Array.from({ length: 12 }, (_, i) => ({
    name: `${9 + i}시`,
    주문수: Math.floor(Math.random() * 100 + 50),
    활성사용자: Math.floor(Math.random() * 500 + 200),
    매출: Math.floor(Math.random() * 5000000 + 2000000) / 1000
  }));

  const handleRefresh = () => {
    setIsLoading(true);
    setConnectionStatus('connecting');
    
    setTimeout(() => {
      setConnectionStatus('online');
      setIsLoading(false);
      toast.success('데이터가 새로고침되었습니다');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">실시간 모니터링</h1>
          <p className="text-gray-600 mt-1">전체 시스템의 실시간 현황을 모니터링합니다</p>
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
          <Button onClick={() => navigate('/company/analytics')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveMetricCard
          title="활성 사용자"
          value={metrics.activeUsers.toLocaleString()}
          unit="명"
          icon={Users}
          iconColor="text-blue-600"
          trend="up"
          description="현재 접속 중인 사용자"
          pulse={true}
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
          title="실시간 매출"
          value={`₩${(metrics.revenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          iconColor="text-green-600"
          trend="up"
          description="오늘 누적 매출"
          pulse={true}
        />
        <LiveMetricCard
          title="활성 매장"
          value={`${metrics.activeStores}/48`}
          icon={Store}
          iconColor="text-orange-600"
          status="active"
          description="영업 중인 매장"
          pulse={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Chart */}
          <SummaryChart
            title="실시간 추이"
            data={realtimeChartData}
            type="line"
            dataKeys={['주문수', '활성사용자']}
            colors={['#3B82F6', '#10B981']}
            height={250}
            showLegend={true}
            showGrid={true}
          />

          {/* Brand Real-time Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                브랜드별 실시간 현황
                <Badge variant="secondary" className="animate-pulse">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                  LIVE
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">전체</TabsTrigger>
                  <TabsTrigger value="activity">활동</TabsTrigger>
                  <TabsTrigger value="alerts">알림</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-3 mt-4">
                  {brandRealtimeData.map((brand) => (
                    <div
                      key={brand.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => navigate(`/brand/${brand.name.toLowerCase()}/realtime`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {brand.name[0]}
                        </div>
                        <div>
                          <p className="font-medium">{brand.name}</p>
                          <p className="text-xs text-gray-600">
                            {brand.users}명 활성 · {brand.orders}건 주문
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₩{(brand.revenue / 1000000).toFixed(1)}M</p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            brand.trend === 'up' ? "text-green-600 bg-green-50" :
                            brand.trend === 'down' ? "text-red-600 bg-red-50" :
                            "text-gray-600 bg-gray-100"
                          )}
                        >
                          {brand.trend === 'up' ? '↑' : brand.trend === 'down' ? '↓' : '→'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="activity">
                  <p className="text-center text-gray-500 py-8">
                    브랜드별 활동 내역
                  </p>
                </TabsContent>
                
                <TabsContent value="alerts">
                  <p className="text-center text-gray-500 py-8">
                    브랜드별 알림 내역
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
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
              toast.success(`활동 상세: ${activity.title}`);
            }}
            maxHeight="400px"
            autoScroll={true}
            showFilters={true}
            updateInterval={5000}
          />
        </div>
      </div>

      {/* Global Map Overview (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4" />
            전국 매장 실시간 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">지도 시각화 영역</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}