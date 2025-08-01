import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { EnhancedMetricCard } from '@/components/dashboard/shared/EnhancedMetricCard';
import { AlertsFeed, type Alert } from '@/components/dashboard/shared/AlertsFeed';
import { RecentChanges, type Change } from '@/components/dashboard/shared/RecentChanges';
import { SummaryChart } from '@/components/dashboard/shared/SummaryChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-hot-toast';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Package,
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ChefHat,
  Utensils,
  Truck,
  BarChart3,
  Bell,
  ClipboardList,
  UserPlus,
  Package2,
  Star,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function StoreDashboard() {
  const navigate = useNavigate();
  const { storeId } = useParams<{ storeId: string }>();
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | 'kitchen' | 'hall' | 'delivery'>('all');
  const [isOnline, setIsOnline] = useState(true);

  // Simulated data - replace with actual API calls
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const storeName = '밀랍 성수점'; // This should come from API based on storeId

  const metrics = [
    {
      title: '오늘 매출',
      value: '₩4,250,000',
      change: { value: 12.5, type: 'increase' as const },
      subtitle: '어제 대비',
      icon: DollarSign,
      iconColor: 'text-green-600',
      trend: { data: [3.2, 3.5, 3.8, 3.9, 4.0, 4.1, 4.25], color: '#10B981' }
    },
    {
      title: '주문 수',
      value: 156,
      change: { value: 8.3, type: 'increase' as const },
      subtitle: '진행중 12건',
      icon: ShoppingBag,
      iconColor: 'text-blue-600',
      trend: { data: [120, 135, 142, 148, 150, 153, 156] }
    },
    {
      title: '근무 직원',
      value: '8/12',
      change: { value: 0, type: 'neutral' as const },
      subtitle: '휴게 중 2명',
      icon: Users,
      iconColor: 'text-purple-600'
    },
    {
      title: '재고 알림',
      value: 3,
      change: { value: -25, type: 'decrease' as const },
      subtitle: '긴급 1건',
      icon: Package,
      iconColor: 'text-orange-600'
    }
  ];

  const departmentStats = {
    kitchen: { orders: 45, staff: 3, efficiency: 92 },
    hall: { orders: 78, staff: 4, efficiency: 88 },
    delivery: { orders: 33, staff: 1, efficiency: 95 }
  };

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: '원두 재고 부족',
      message: '시그니처 블렌드 원두가 1일분만 남았습니다',
      timestamp: new Date(Date.now() - 5 * 60000),
      category: '재고관리',
      read: false,
      actionLabel: '긴급 발주',
      onAction: () => navigate(`/store/${storeId}/inventory/orders`)
    },
    {
      id: '2',
      type: 'warning',
      title: '직원 지각',
      message: '홀 담당 김서현님이 15분 지각 중입니다',
      timestamp: new Date(Date.now() - 20 * 60000),
      category: '인사관리',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: '배달 지연',
      message: '우천으로 인한 배달 지연이 예상됩니다',
      timestamp: new Date(Date.now() - 45 * 60000),
      category: '운영',
      read: true
    },
    {
      id: '4',
      type: 'success',
      title: '목표 달성',
      message: '오전 매출 목표를 115% 달성했습니다',
      timestamp: new Date(Date.now() - 2 * 3600000),
      category: '매출',
      read: true
    }
  ];

  const recentChanges: Change[] = [
    {
      id: '1',
      type: 'update',
      category: 'inventory',
      title: '재고 입고 완료',
      description: '우유 20L, 시럽 10병이 입고되었습니다',
      user: { name: '박재고', role: '재고 담당' },
      timestamp: new Date(Date.now() - 10 * 60000),
      metadata: { location: '냉장 창고' }
    },
    {
      id: '2',
      type: 'create',
      category: 'sales',
      title: '대량 주문 접수',
      description: '인근 회사에서 30잔 주문이 들어왔습니다',
      user: { name: '이캐셔', role: '캐셔' },
      timestamp: new Date(Date.now() - 30 * 60000),
      metadata: { count: 30 }
    },
    {
      id: '3',
      type: 'config',
      category: 'system',
      title: 'POS 업데이트',
      description: 'POS 시스템이 v2.5.1로 업데이트되었습니다',
      user: { name: '시스템', role: '자동' },
      timestamp: new Date(Date.now() - 1 * 3600000)
    }
  ];

  const hourlyData = [
    { time: '09시', 주문: 8, 매출: 120 },
    { time: '10시', 주문: 12, 매출: 180 },
    { time: '11시', 주문: 15, 매출: 225 },
    { time: '12시', 주문: 28, 매출: 420 },
    { time: '13시', 주문: 32, 매출: 480 },
    { time: '14시', 주문: 25, 매출: 375 },
    { time: '15시', 주문: 18, 매출: 270 },
    { time: '16시', 주문: 22, 매출: 330 }
  ];

  const quickActions = [
    {
      title: '주문 접수',
      description: '새 주문',
      icon: ShoppingBag,
      onClick: () => navigate(`/store/${storeId}/orders/new`),
      color: 'primary' as const
    },
    {
      title: '재고 확인',
      description: '현재 재고',
      icon: Package2,
      onClick: () => navigate(`/store/${storeId}/inventory`),
      color: 'secondary' as const
    },
    {
      title: '직원 호출',
      description: '지원 요청',
      icon: UserPlus,
      onClick: () => toast.success('직원 호출 완료'),
      color: 'default' as const
    },
    {
      title: '업무 확인',
      description: '할 일 목록',
      icon: ClipboardList,
      onClick: () => navigate(`/store/${storeId}/operations/tasks`),
      color: 'secondary' as const
    },
    {
      title: '일일 마감',
      description: '영업 종료',
      icon: Clock,
      onClick: () => navigate(`/store/${storeId}/sales/closing`),
      color: 'default' as const
    },
    {
      title: '긴급 알림',
      description: '본사 연락',
      icon: Bell,
      onClick: () => toast.success('알림 전송됨'),
      color: 'primary' as const
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {!isOnline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">오프라인 모드</p>
            <p className="text-xs text-yellow-700">인터넷 연결이 끊어졌습니다. 로컬 모드로 작동 중입니다.</p>
          </div>
          <Badge variant="outline" className="text-yellow-700 border-yellow-300">
            동기화 대기 중
          </Badge>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{storeName} 운영 현황</h1>
          <p className="text-gray-600 mt-1">실시간 매장 운영 상태를 확인하세요</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? "default" : "secondary"} className="flex items-center gap-1">
            {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isOnline ? '온라인' : '오프라인'}
          </Badge>
          <Button onClick={() => navigate(`/store/${storeId}/analytics`)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            상세 분석
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <EnhancedMetricCard
            key={index}
            {...metric}
            onClick={() => {
              toast.success(`${metric.title} 상세 보기`);
            }}
          />
        ))}
      </div>

      {/* Department Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">부서별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">전체</TabsTrigger>
              <TabsTrigger value="kitchen" className="text-xs">
                <ChefHat className="h-3 w-3 mr-1" />
                주방
              </TabsTrigger>
              <TabsTrigger value="hall" className="text-xs">
                <Utensils className="h-3 w-3 mr-1" />
                홀
              </TabsTrigger>
              <TabsTrigger value="delivery" className="text-xs">
                <Truck className="h-3 w-3 mr-1" />
                배달
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedDepartment} className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {selectedDepartment === 'all' ? (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{Object.values(departmentStats).reduce((sum, d) => sum + d.orders, 0)}</p>
                      <p className="text-xs text-gray-600">총 주문</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{Object.values(departmentStats).reduce((sum, d) => sum + d.staff, 0)}</p>
                      <p className="text-xs text-gray-600">근무 인원</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {Math.round(Object.values(departmentStats).reduce((sum, d) => sum + d.efficiency, 0) / 3)}%
                      </p>
                      <p className="text-xs text-gray-600">평균 효율</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{departmentStats[selectedDepartment].orders}</p>
                      <p className="text-xs text-gray-600">처리 주문</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{departmentStats[selectedDepartment].staff}</p>
                      <p className="text-xs text-gray-600">근무 인원</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{departmentStats[selectedDepartment].efficiency}%</p>
                      <p className="text-xs text-gray-600">운영 효율</p>
                    </div>
                  </>
                )}
              </div>
              <Progress 
                value={selectedDepartment === 'all' 
                  ? Math.round(Object.values(departmentStats).reduce((sum, d) => sum + d.efficiency, 0) / 3)
                  : departmentStats[selectedDepartment].efficiency
                } 
                className="mt-3" 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hourly Performance */}
          <SummaryChart
            title="시간별 실적"
            data={hourlyData}
            type="bar"
            dataKeys={['주문']}
            colors={['#3B82F6']}
            height={250}
            showLegend={false}
            summary={{
              total: 156,
              change: 8.3,
              changeType: 'increase'
            }}
          />

          {/* Real-time Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                실시간 주문 현황
                <Badge variant="outline" className="ml-2">
                  진행중 12건
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: '156', items: '아메리카노 2, 라떼 1', time: '2분 전', status: 'preparing' },
                  { id: '155', items: '시그니처 라떼 1', time: '5분 전', status: 'ready' },
                  { id: '154', items: '샌드위치 세트 2', time: '8분 전', status: 'completed' },
                  { id: '153', items: '아이스티 3', time: '12분 전', status: 'completed' }
                ].map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">#{order.id}</span>
                      <span className="text-sm text-gray-600">{order.items}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{order.time}</span>
                      <Badge 
                        variant={
                          order.status === 'preparing' ? 'default' : 
                          order.status === 'ready' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {order.status === 'preparing' ? '준비중' : 
                         order.status === 'ready' ? '완료' : 
                         '전달완료'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Alerts Feed */}
          <AlertsFeed
            alerts={alerts}
            onMarkAsRead={(id) => {
              toast.success('읽음으로 표시됨');
            }}
            onDismiss={(id) => {
              toast.success('알림 삭제됨');
            }}
            onViewAll={() => navigate(`/store/${storeId}/alerts`)}
            maxHeight="300px"
          />

          {/* Recent Changes */}
          <RecentChanges
            changes={recentChanges}
            onViewDetails={(change) => {
              toast.success(`상세 보기: ${change.title}`);
            }}
            onViewAll={() => navigate(`/store/${storeId}/system/audit-log`)}
            maxHeight="300px"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">빠른 작업</h2>
        <QuickActions
          actions={quickActions}
          columns={6}
          variant="card"
        />
      </div>
    </div>
  );
}