import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Database, Wifi, Bell } from 'lucide-react'

export default function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">시스템 설정</h1>
        <p className="text-muted-foreground">
          매장 시스템 환경 설정
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              데이터베이스 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">데이터베이스 상태</label>
              <p className="text-sm text-muted-foreground text-green-600">연결됨</p>
            </div>
            <div>
              <label className="text-sm font-medium">마지막 백업</label>
              <p className="text-sm text-muted-foreground">2024-01-13 02:00</p>
            </div>
            <Button size="sm">백업 실행</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              네트워크 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">인터넷 연결</label>
              <p className="text-sm text-muted-foreground text-green-600">정상</p>
            </div>
            <div>
              <label className="text-sm font-medium">POS 연동</label>
              <p className="text-sm text-muted-foreground text-green-600">연결됨</p>
            </div>
            <Button size="sm">네트워크 테스트</Button>
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
              <label className="text-sm font-medium">시스템 알림</label>
              <p className="text-sm text-muted-foreground">활성화</p>
            </div>
            <Button size="sm">알림 설정</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              일반 설정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">시스템 버전</label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div>
              <label className="text-sm font-medium">업데이트 확인</label>
              <p className="text-sm text-muted-foreground">최신 버전</p>
            </div>
            <Button size="sm">시스템 업데이트</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}