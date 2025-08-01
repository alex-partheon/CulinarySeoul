import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react'

export default function StoreAlerts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">알림 센터</h1>
          <p className="text-muted-foreground">
            시스템 알림 및 경고 사항을 확인합니다
          </p>
        </div>
        <Badge variant="secondary">
          <Bell className="h-3 w-3 mr-1" />
          3개 알림
        </Badge>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              긴급 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-red-200 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">재고 부족 경고</p>
                  <p className="text-sm text-red-700">밀가루, 토마토 소스, 치즈 재고가 부족합니다.</p>
                  <p className="text-xs text-red-600 mt-1">2분 전</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">대기시간 초과</p>
                  <p className="text-sm text-orange-700">현재 평균 대기시간이 15분을 초과했습니다.</p>
                  <p className="text-xs text-orange-600 mt-1">5분 전</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              일반 알림
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900">배달 주문 증가</p>
                  <p className="text-sm text-blue-700">오늘 배달 주문이 평소보다 30% 증가했습니다.</p>
                  <p className="text-xs text-blue-600 mt-1">30분 전</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 border border-green-200 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900">일일 목표 달성</p>
                  <p className="text-sm text-green-700">오늘 매출 목표를 달성했습니다!</p>
                  <p className="text-xs text-green-600 mt-1">1시간 전</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}