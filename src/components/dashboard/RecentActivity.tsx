import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { Button } from "../ui/button"

interface Activity {
  id: string
  type: 'login' | 'inventory' | 'order' | 'user' | 'system'
  title: string
  description: string
  timestamp: string
  user: string
  icon: string
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: '새 주문 접수',
    description: '강남점에서 김치찌개 세트 5개 주문',
    timestamp: '2분 전',
    user: '강남점 관리자',
    icon: '📋'
  },
  {
    id: '2',
    type: 'inventory',
    title: '재고 부족 알림',
    description: '배추 재고가 임계치 이하로 떨어졌습니다',
    timestamp: '15분 전',
    user: '시스템',
    icon: '⚠️'
  },
  {
    id: '3',
    type: 'user',
    title: '새 직원 등록',
    description: '홍대점에 새로운 직원이 등록되었습니다',
    timestamp: '1시간 전',
    user: '홍대점 매니저',
    icon: '👤'
  },
  {
    id: '4',
    type: 'system',
    title: '일일 보고서 생성',
    description: '어제 매출 보고서가 생성되었습니다',
    timestamp: '2시간 전',
    user: '시스템',
    icon: '📊'
  },
  {
    id: '5',
    type: 'login',
    title: '관리자 로그인',
    description: '본사 관리자가 시스템에 로그인했습니다',
    timestamp: '3시간 전',
    user: '본사 관리자',
    icon: '🔐'
  }
]

const getActivityTypeColor = (type: Activity['type']) => {
  switch (type) {
    case 'order':
      return 'text-blue-600 bg-blue-50'
    case 'inventory':
      return 'text-orange-600 bg-orange-50'
    case 'user':
      return 'text-green-600 bg-green-50'
    case 'system':
      return 'text-purple-600 bg-purple-50'
    case 'login':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-semibold">최근 활동</CardTitle>
        <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
          전체 보기 →
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${getActivityTypeColor(activity.type)}`}>
                {activity.icon}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}