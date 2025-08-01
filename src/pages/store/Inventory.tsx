import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react'

export default function StoreInventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">재고 현황</h1>
          <p className="text-muted-foreground">
            매장 재고 현황을 실시간으로 확인합니다
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm">재고 조정</Button>
          <Button size="sm" variant="outline">입고 처리</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 품목</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              활성 품목 142개
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고 부족</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">
              즉시 발주 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">재고 가치</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩2,450,000</div>
            <p className="text-xs text-muted-foreground">
              전월 대비 +5.2%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">회전율</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5일</div>
            <p className="text-xs text-muted-foreground">
              평균 재고 회전
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              재고 부족 품목
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-900">밀가루 (중력분)</p>
                  <p className="text-sm text-red-700">현재: 2kg / 최소: 10kg</p>
                </div>
                <Badge variant="destructive">긴급</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 rounded-lg">
                <div>
                  <p className="font-medium text-orange-900">토마토 소스</p>
                  <p className="text-sm text-orange-700">현재: 5병 / 최소: 15병</p>
                </div>
                <Badge variant="secondary">부족</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">모짜렐라 치즈</p>
                  <p className="text-sm text-yellow-700">현재: 3kg / 최소: 8kg</p>
                </div>
                <Badge variant="outline">주의</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>유통기한 임박 품목</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">생크림</p>
                  <p className="text-sm text-muted-foreground">유통기한: 2024-01-15 (2일 남음)</p>
                </div>
                <Badge variant="outline">2일</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">신선한 바질</p>
                  <p className="text-sm text-muted-foreground">유통기한: 2024-01-18 (5일 남음)</p>
                </div>
                <Badge variant="outline">5일</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}