import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'react-hot-toast'
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  Users,
  Package,
  Utensils,
  UserCheck,
  Truck,
  ChevronRight,
  BellOff,
  Activity,
  Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Alert {
  id: string
  type: 'critical' | 'warning' | 'info' | 'success'
  category: 'inventory' | 'staff' | 'operations' | 'customer' | 'equipment' | 'delivery'
  department?: 'kitchen' | 'hall' | 'delivery' | 'all'
  title: string
  description: string
  timestamp: Date
  isRead: boolean
  isResolved: boolean
  priority: 'high' | 'medium' | 'low'
  actionRequired: boolean
  relatedData?: {
    type: string
    value: string | number
  }
}

export default function StoreAlerts() {
  const { storeId } = useParams<{ storeId: string }>()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showResolved, setShowResolved] = useState(false)
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])

  // Mock store-specific alert data
  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      category: 'inventory',
      department: 'kitchen',
      title: '주방 재료 긴급 부족',
      description: '밀가루와 토마토 소스가 30분 이내 소진 예상입니다',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      isResolved: false,
      priority: 'high',
      actionRequired: true,
      relatedData: { type: '잔여량', value: '2kg' }
    },
    {
      id: '2',
      type: 'warning',
      category: 'staff',
      department: 'hall',
      title: '홀 직원 부족',
      description: '점심 피크 시간 홀 직원이 1명 부족합니다',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      isResolved: false,
      priority: 'medium',
      actionRequired: true,
      relatedData: { type: '현재/필요', value: '2/3' }
    },
    {
      id: '3',
      type: 'warning',
      category: 'operations',
      department: 'kitchen',
      title: '평균 조리시간 초과',
      description: '현재 평균 조리시간이 12분으로 목표 8분을 초과했습니다',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      isResolved: false,
      priority: 'high',
      actionRequired: true,
      relatedData: { type: '평균 시간', value: '12분' }
    },
    {
      id: '4',
      type: 'info',
      category: 'equipment',
      department: 'kitchen',
      title: '커피 머신 정기 점검',
      description: '내일 오후 2시 커피 머신 정기 점검 예정입니다',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      isResolved: false,
      priority: 'low',
      actionRequired: false
    },
    {
      id: '5',
      type: 'critical',
      category: 'delivery',
      department: 'delivery',
      title: '배달 지연 경고',
      description: '3건의 배달이 30분 이상 지연되고 있습니다',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      isResolved: false,
      priority: 'high',
      actionRequired: true,
      relatedData: { type: '지연 건수', value: '3건' }
    },
    {
      id: '6',
      type: 'success',
      category: 'customer',
      department: 'all',
      title: '고객 만족도 상승',
      description: '오늘 고객 만족도가 4.9/5.0으로 최고 기록을 달성했습니다',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: true,
      isResolved: false,
      priority: 'low',
      actionRequired: false,
      relatedData: { type: '평점', value: '4.9/5.0' }
    }
  ]

  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (!showResolved && alert.isResolved) return false
    if (selectedCategory !== 'all' && alert.category !== selectedCategory) return false
    if (selectedType !== 'all' && alert.type !== selectedType) return false
    if (selectedDepartment !== 'all' && alert.department !== selectedDepartment && alert.department !== 'all') return false
    if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Alert statistics
  const alertStats = {
    total: alerts.length,
    unread: alerts.filter(a => !a.isRead).length,
    critical: alerts.filter(a => a.type === 'critical' && !a.isResolved).length,
    actionRequired: alerts.filter(a => a.actionRequired && !a.isResolved).length
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
    }
  }

  const getCategoryIcon = (category: Alert['category']) => {
    switch (category) {
      case 'inventory':
        return <Package className="h-4 w-4" />
      case 'staff':
        return <Users className="h-4 w-4" />
      case 'operations':
        return <Activity className="h-4 w-4" />
      case 'customer':
        return <Users className="h-4 w-4" />
      case 'equipment':
        return <Wrench className="h-4 w-4" />
      case 'delivery':
        return <Truck className="h-4 w-4" />
    }
  }

  const getDepartmentIcon = (department?: Alert['department']) => {
    switch (department) {
      case 'kitchen':
        return <Utensils className="h-3 w-3" />
      case 'hall':
        return <UserCheck className="h-3 w-3" />
      case 'delivery':
        return <Truck className="h-3 w-3" />
      default:
        return null
    }
  }

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ))
  }

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isResolved: true } : alert
    ))
    toast.success('알림이 해결됨으로 표시되었습니다')
  }

  const handleBulkAction = (action: 'read' | 'resolve' | 'delete') => {
    if (selectedAlerts.length === 0) {
      toast.error('선택된 알림이 없습니다')
      return
    }

    switch (action) {
      case 'read':
        setAlerts(prev => prev.map(alert => 
          selectedAlerts.includes(alert.id) ? { ...alert, isRead: true } : alert
        ))
        toast.success(`${selectedAlerts.length}개 알림을 읽음으로 표시했습니다`)
        break
      case 'resolve':
        setAlerts(prev => prev.map(alert => 
          selectedAlerts.includes(alert.id) ? { ...alert, isResolved: true } : alert
        ))
        toast.success(`${selectedAlerts.length}개 알림을 해결됨으로 표시했습니다`)
        break
      case 'delete':
        setAlerts(prev => prev.filter(alert => !selectedAlerts.includes(alert.id)))
        toast.success(`${selectedAlerts.length}개 알림을 삭제했습니다`)
        break
    }
    setSelectedAlerts([])
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매장 알림 센터</h1>
          <p className="text-gray-600 mt-1">{storeId} 매장의 운영 알림 및 경고를 관리합니다</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setAlerts([...mockAlerts])}>
            <RefreshCw className="h-4 w-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" onClick={() => toast.success('알림 보고서가 다운로드되었습니다')}>
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" />
              전체 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{alertStats.total}</p>
            <p className="text-xs text-gray-600 mt-1">활성 알림</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              읽지 않음
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{alertStats.unread}</p>
            <p className="text-xs text-gray-600 mt-1">새로운 알림</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              긴급 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{alertStats.critical}</p>
            <p className="text-xs text-gray-600 mt-1">즉시 확인 필요</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              조치 필요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{alertStats.actionRequired}</p>
            <p className="text-xs text-gray-600 mt-1">대응 필요</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">알림 필터</CardTitle>
            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{selectedAlerts.length}개 선택됨</span>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('read')}>
                  읽음 표시
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('resolve')}>
                  해결됨 표시
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                  삭제
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="알림 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-resolved"
                checked={showResolved}
                onCheckedChange={setShowResolved}
              />
              <label htmlFor="show-resolved" className="text-sm text-gray-600 cursor-pointer">
                해결된 알림 표시
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">부서:</span>
            {['all', 'kitchen', 'hall', 'delivery'].map((dept) => (
              <Badge
                key={dept}
                variant={selectedDepartment === dept ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedDepartment(dept)}
              >
                {dept === 'all' ? '전체' : 
                 dept === 'kitchen' ? '주방' :
                 dept === 'hall' ? '홀' : '배달'}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">카테고리:</span>
            {['all', 'inventory', 'staff', 'operations', 'customer', 'equipment', 'delivery'].map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? '전체' : 
                 category === 'inventory' ? '재고' :
                 category === 'staff' ? '직원' :
                 category === 'operations' ? '운영' :
                 category === 'customer' ? '고객' :
                 category === 'equipment' ? '장비' : '배달'}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">유형:</span>
            {['all', 'critical', 'warning', 'info', 'success'].map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedType(type)}
              >
                {type === 'all' ? '전체' : 
                 type === 'critical' ? '긴급' :
                 type === 'warning' ? '경고' :
                 type === 'info' ? '정보' : '성공'}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BellOff className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">해당하는 알림이 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "transition-all duration-200",
                !alert.isRead && "border-l-4",
                alert.type === 'critical' && !alert.isRead && "border-l-red-500",
                alert.type === 'warning' && !alert.isRead && "border-l-yellow-500",
                alert.type === 'info' && !alert.isRead && "border-l-blue-500",
                alert.type === 'success' && !alert.isRead && "border-l-green-500",
                alert.isResolved && "opacity-60"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedAlerts.includes(alert.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedAlerts([...selectedAlerts, alert.id])
                      } else {
                        setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id))
                      }
                    }}
                  />
                  {getAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className={cn(
                          "text-sm font-medium",
                          !alert.isRead && "text-gray-900",
                          alert.isRead && "text-gray-600"
                        )}>
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {alert.actionRequired && !alert.isResolved && (
                          <Badge variant="destructive" className="text-xs">
                            조치 필요
                          </Badge>
                        )}
                        {alert.isResolved && (
                          <Badge variant="secondary" className="text-xs">
                            해결됨
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(alert.category)}
                        <span>
                          {alert.category === 'inventory' ? '재고' :
                           alert.category === 'staff' ? '직원' :
                           alert.category === 'operations' ? '운영' :
                           alert.category === 'customer' ? '고객' :
                           alert.category === 'equipment' ? '장비' : '배달'}
                        </span>
                      </div>
                      {alert.department && alert.department !== 'all' && (
                        <div className="flex items-center gap-1">
                          {getDepartmentIcon(alert.department)}
                          <span>
                            {alert.department === 'kitchen' ? '주방' :
                             alert.department === 'hall' ? '홀' : '배달'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(alert.timestamp)}</span>
                      </div>
                      {alert.relatedData && (
                        <div className="flex items-center gap-1">
                          <span>{alert.relatedData.type}:</span>
                          <span className="font-medium">{alert.relatedData.value}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(alert.id)}
                      >
                        읽음
                      </Button>
                    )}
                    {!alert.isResolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                      >
                        해결
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success('상세 페이지로 이동')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}