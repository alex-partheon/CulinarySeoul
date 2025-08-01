import React from 'react'
import { 
  Megaphone, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Star,
  Calendar,
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

export default function StoreMarketingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">마케팅 현황</h1>
          <p className="text-muted-foreground">매장 마케팅 성과 및 캠페인 관리</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          캠페인 생성
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">캠페인 ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285%</div>
            <p className="text-xs text-muted-foreground">
              전월 대비 +12.5%
            </p>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">신규 고객</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156명</div>
            <p className="text-xs text-muted-foreground">
              이번 달 신규 유입
            </p>
            <Progress value={65} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              리뷰 324개
            </p>
            <Progress value={96} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SNS 도달</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5K</div>
            <p className="text-xs text-muted-foreground">
              월간 도달 수
            </p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>진행 중인 캠페인</CardTitle>
            <Button variant="outline" size="sm">
              전체 보기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">여름 시즌 프로모션</h3>
                  <p className="text-sm text-muted-foreground">
                    2024.06.01 - 2024.08.31
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">참여: 234명</p>
                <p className="text-sm text-green-600">전환율 18.5%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">단골 고객 리워드</h3>
                  <p className="text-sm text-muted-foreground">
                    2024.01.01 - 2024.12.31
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">참여: 89명</p>
                <p className="text-sm text-green-600">재방문율 82%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">SNS 이벤트</h3>
                  <p className="text-sm text-muted-foreground">
                    2024.07.15 - 2024.07.31
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">참여: 156명</p>
                <p className="text-sm text-green-600">팔로워 +324</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">캠페인 관리</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  진행중인 캠페인 3개
                </p>
              </div>
              <Megaphone className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">리뷰 관리</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  답변 대기 5개
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">SNS 관리</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  예약된 게시물 8개
                </p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}