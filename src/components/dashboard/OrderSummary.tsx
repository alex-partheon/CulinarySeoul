import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface OrderStats {
  label: string
  value: number
  unit: string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
}

interface RecentOrder {
  id: string
  brandName: string
  orderNumber: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  timestamp: string
}

const mockStats: OrderStats[] = [
  {
    label: '오늘 주문',
    value: 47,
    unit: '건',
    change: 12,
    changeType: 'increase'
  },
  {
    label: '오늘 매출',
    value: 2840000,
    unit: '원',
    change: 8.5,
    changeType: 'increase'
  },
  {
    label: '평균 주문액',
    value: 60426,
    unit: '원',
    change: -2.1,
    changeType: 'decrease'
  },
  {
    label: '처리 대기',
    value: 8,
    unit: '건',
    change: 0,
    changeType: 'neutral'
  }
]

const mockRecentOrders: RecentOrder[] = [
  {
    id: '1',
    brandName: '강남 김치찌개',
    orderNumber: 'ORD-2024-001',
    items: 3,
    total: 45000,
    status: 'processing',
    timestamp: '5분 전'
  },
  {
    id: '2',
    brandName: '홍대 불고기',
    orderNumber: 'ORD-2024-002',
    items: 7,
    total: 89000,
    status: 'completed',
    timestamp: '12분 전'
  },
  {
    id: '3',
    brandName: '명동 비빔밥',
    orderNumber: 'ORD-2024-003',
    items: 2,
    total: 28000,
    status: 'pending',
    timestamp: '18분 전'
  }
]

const getStatusColor = (status: RecentOrder['status']) => {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'processing':
      return 'default'
    case 'completed':
      return 'outline'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

const getStatusText = (status: RecentOrder['status']) => {
  switch (status) {
    case 'pending':
      return '대기'
    case 'processing':
      return '처리중'
    case 'completed':
      return '완료'
    case 'cancelled':
      return '취소'
    default:
      return '알 수 없음'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('ko-KR').format(num)
}

const getChangeIcon = (changeType: OrderStats['changeType']) => {
  switch (changeType) {
    case 'increase':
      return '↗️'
    case 'decrease':
      return '↘️'
    case 'neutral':
      return '➡️'
    default:
      return '➡️'
  }
}

const getChangeColor = (changeType: OrderStats['changeType']) => {
  switch (changeType) {
    case 'increase':
      return 'text-green-600'
    case 'decrease':
      return 'text-red-600'
    case 'neutral':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

export function OrderSummary() {
  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">주문 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">
                    {stat.unit === '원' ? formatCurrency(stat.value) : `${formatNumber(stat.value)}${stat.unit}`}
                  </p>
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center space-x-1 text-xs ${getChangeColor(stat.changeType)}`}>
                    <span>{getChangeIcon(stat.changeType)}</span>
                    <span>{Math.abs(stat.change)}% (전일 대비)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-semibold">최근 주문</CardTitle>
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
            전체 보기 →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{order.brandName}</p>
                    <Badge variant={getStatusColor(order.status)} className="text-xs">
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.orderNumber} • {order.items}개 상품
                  </p>
                  <p className="text-xs text-muted-foreground">{order.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
                  <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                    상세
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}