import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  ShoppingBag, 
  ChefHat, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  MapPin
} from 'lucide-react';

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: string[];
  status: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  type: 'dine-in' | 'takeout' | 'delivery';
  estimatedTime: number; // minutes
  elapsedTime: number; // minutes
  priority?: 'normal' | 'rush' | 'vip';
  location?: string;
  assignedStaff?: string;
}

interface OrderTrackerProps {
  orders: Order[];
  viewMode?: 'grid' | 'list' | 'kanban';
  onOrderClick?: (order: Order) => void;
  showStats?: boolean;
  maxHeight?: string;
}

export function OrderTracker({
  orders,
  viewMode = 'kanban',
  onOrderClick,
  showStats = true,
  maxHeight = '500px'
}: OrderTrackerProps) {
  const statusStages = [
    { key: 'received', label: '접수', icon: ShoppingBag, color: 'bg-blue-100 text-blue-700' },
    { key: 'preparing', label: '준비중', icon: ChefHat, color: 'bg-yellow-100 text-yellow-700' },
    { key: 'ready', label: '완료', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { key: 'delivering', label: '배달중', icon: MapPin, color: 'bg-purple-100 text-purple-700' }
  ];

  const getOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderTypeIcon = (type: Order['type']) => {
    switch (type) {
      case 'dine-in':
        return '🍽️';
      case 'takeout':
        return '🥡';
      case 'delivery':
        return '🚚';
    }
  };

  const getPriorityBadge = (priority?: Order['priority']) => {
    if (!priority || priority === 'normal') return null;
    
    return (
      <Badge 
        variant={priority === 'vip' ? 'default' : 'destructive'}
        className="text-xs"
      >
        {priority === 'vip' ? 'VIP' : '긴급'}
      </Badge>
    );
  };

  const getTimeStatus = (order: Order) => {
    const remaining = order.estimatedTime - order.elapsedTime;
    if (remaining < 0) return { text: '지연', color: 'text-red-600' };
    if (remaining < 5) return { text: '곧 완료', color: 'text-yellow-600' };
    return { text: `${remaining}분 남음`, color: 'text-gray-600' };
  };

  const calculateStats = () => {
    const total = orders.length;
    const delayed = orders.filter(o => o.elapsedTime > o.estimatedTime).length;
    const avgTime = orders.reduce((sum, o) => sum + o.elapsedTime, 0) / total || 0;
    
    return {
      total,
      delayed,
      avgTime: Math.round(avgTime),
      byType: {
        dineIn: orders.filter(o => o.type === 'dine-in').length,
        takeout: orders.filter(o => o.type === 'takeout').length,
        delivery: orders.filter(o => o.type === 'delivery').length
      }
    };
  };

  const stats = calculateStats();

  const OrderCard = ({ order }: { order: Order }) => {
    const timeStatus = getTimeStatus(order);
    const progress = Math.min((order.elapsedTime / order.estimatedTime) * 100, 100);

    return (
      <div
        className={cn(
          "p-3 bg-white rounded-lg border cursor-pointer",
          "hover:shadow-md transition-all duration-200",
          order.priority === 'rush' && "border-red-300",
          order.priority === 'vip' && "border-purple-300"
        )}
        onClick={() => onOrderClick?.(order)}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">#{order.orderNumber}</span>
            <span className="text-xl">{getOrderTypeIcon(order.type)}</span>
            {getPriorityBadge(order.priority)}
          </div>
          <Clock className={cn("h-4 w-4", timeStatus.color)} />
        </div>

        <div className="space-y-1 mb-2">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <User className="h-3 w-3" />
            {order.customer}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1">
            {order.items.join(', ')}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">{order.elapsedTime}분 경과</span>
            <span className={timeStatus.color}>{timeStatus.text}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {order.assignedStaff && (
          <p className="text-xs text-gray-500 mt-2">
            담당: {order.assignedStaff}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">총 주문</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">평균 시간</p>
              <p className="text-xl font-bold">{stats.avgTime}분</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">지연 주문</p>
              <p className="text-xl font-bold text-red-600">{stats.delayed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-xl">🍽️</span>
                <span className="text-sm font-medium">{stats.byType.dineIn}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl">🥡</span>
                <span className="text-sm font-medium">{stats.byType.takeout}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl">🚚</span>
                <span className="text-sm font-medium">{stats.byType.delivery}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ maxHeight }}>
          {statusStages.map((stage) => {
            const Icon = stage.icon;
            const stageOrders = getOrdersByStatus(stage.key);
            
            return (
              <Card key={stage.key} className="overflow-hidden">
                <CardHeader className={cn("py-3", stage.color)}>
                  <CardTitle className="text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {stage.label}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {stageOrders.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
                  {stageOrders.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-4">
                      주문 없음
                    </p>
                  ) : (
                    stageOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}