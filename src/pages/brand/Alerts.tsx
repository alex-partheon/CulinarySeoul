import React from 'react'
import { useParams } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export default function BrandAlerts() {
  const { brandId } = useParams<{ brandId: string }>()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">알림 센터</h1>
        <p className="text-muted-foreground">
          브랜드 {brandId}의 시스템 알림 및 경고를 관리하세요
        </p>
      </div>

      {/* 알림 통계 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">긴급 알림</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">일반 알림</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정보</CardTitle>
            <Info className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">해결됨</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">45</div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 알림 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 알림</CardTitle>
          <CardDescription>
            최신 시스템 알림 및 경고 사항
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">재고 부족 경고</p>
                <p className="text-xs text-muted-foreground">성수점 - 아메리카노 원두 재고 부족</p>
                <p className="text-xs text-muted-foreground">2시간 전</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg bg-blue-50">
              <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">신규 주문</p>
                <p className="text-xs text-muted-foreground">대량 주문이 접수되었습니다</p>
                <p className="text-xs text-muted-foreground">30분 전</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">시스템 업데이트</p>
                <p className="text-xs text-muted-foreground">POS 시스템 업데이트가 완료되었습니다</p>
                <p className="text-xs text-muted-foreground">1시간 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}