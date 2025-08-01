import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Store, Users, Bell } from 'lucide-react'

export default function StoreSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">매장 설정</h1>
        <p className="text-muted-foreground">
          매장 운영 환경을 설정합니다
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              매장 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">매장명</label>
              <p className="text-sm text-muted-foreground">성수점</p>
            </div>
            <div>
              <label className="text-sm font-medium">주소</label>
              <p className="text-sm text-muted-foreground">서울시 성동구 성수동1가</p>
            </div>
            <div>
              <label className="text-sm font-medium">영업시간</label>
              <p className="text-sm text-muted-foreground">09:00 - 22:00</p>
            </div>
            <Button size="sm">수정</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              직원 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">등록 직원</label>
              <p className="text-sm text-muted-foreground">8명</p>
            </div>
            <div>
              <label className="text-sm font-medium">근무 직원</label>
              <p className="text-sm text-muted-foreground">6명</p>
            </div>
            <Button size="sm">직원 관리</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">재고 알림</label>
              <p className="text-sm text-muted-foreground">활성화</p>
            </div>
            <div>
              <label className="text-sm font-medium">주문 알림</label>
              <p className="text-sm text-muted-foreground">활성화</p>
            </div>
            <Button size="sm">알림 설정</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              시스템 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">시스템 버전</label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div>
              <label className="text-sm font-medium">마지막 동기화</label>
              <p className="text-sm text-muted-foreground">2024-01-13 14:30</p>
            </div>
            <Button size="sm">동기화</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}