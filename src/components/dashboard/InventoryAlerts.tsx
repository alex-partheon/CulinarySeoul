import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface InventoryAlert {
  id: string
  item: string
  currentStock: number
  minStock: number
  unit: string
  category: string
  severity: 'critical' | 'warning' | 'info'
  location: string
  lastUpdated: string
}

const mockAlerts: InventoryAlert[] = [
  {
    id: '1',
    item: '배추',
    currentStock: 5,
    minStock: 20,
    unit: 'kg',
    category: '채소',
    severity: 'critical',
    location: '중앙창고',
    lastUpdated: '10분 전'
  },
  {
    id: '2',
    item: '돼지고기 (삼겹살)',
    currentStock: 15,
    minStock: 30,
    unit: 'kg',
    category: '육류',
    severity: 'warning',
    location: '중앙창고',
    lastUpdated: '30분 전'
  },
  {
    id: '3',
    item: '고춧가루',
    currentStock: 2,
    minStock: 10,
    unit: 'kg',
    category: '양념',
    severity: 'critical',
    location: '강남점',
    lastUpdated: '1시간 전'
  },
  {
    id: '4',
    item: '참기름',
    currentStock: 8,
    minStock: 15,
    unit: 'L',
    category: '기름',
    severity: 'warning',
    location: '홍대점',
    lastUpdated: '2시간 전'
  }
]

const getSeverityColor = (severity: InventoryAlert['severity']) => {
  switch (severity) {
    case 'critical':
      return 'destructive'
    case 'warning':
      return 'secondary'
    case 'info':
      return 'outline'
    default:
      return 'outline'
  }
}

const getSeverityIcon = (severity: InventoryAlert['severity']) => {
  switch (severity) {
    case 'critical':
      return '🚨'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return 'ℹ️'
  }
}

export function InventoryAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">재고 알림</CardTitle>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
          전체 보기 →
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-start space-x-3">
                <div className="text-lg">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{alert.item}</p>
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.severity === 'critical' ? '긴급' : alert.severity === 'warning' ? '경고' : '정보'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    현재: {alert.currentStock}{alert.unit} / 최소: {alert.minStock}{alert.unit}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{alert.location}</span>
                    <span>•</span>
                    <span>{alert.category}</span>
                    <span>•</span>
                    <span>{alert.lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button size="sm" variant="outline" className="text-xs">
                  주문
                </Button>
                <Button size="sm" variant="ghost" className="text-xs">
                  조정
                </Button>
              </div>
            </div>
          ))}
        </div>
        {mockAlerts.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            현재 재고 알림이 없습니다
          </div>
        )}
      </CardContent>
    </Card>
  )
}