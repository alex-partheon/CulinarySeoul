import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Analytics() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">분석 및 통계</h1>
        <p className="text-muted-foreground mt-1">비즈니스 성과를 분석하고 인사이트를 얻으세요</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="sales">매출 분석 (구현중)</TabsTrigger>
          <TabsTrigger value="menu">메뉴 성과</TabsTrigger>
          <TabsTrigger value="customer">고객 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">이번 달 매출</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₩68.5M</p>
                <p className="text-xs text-green-600">+12.5% 전월 대비</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">평균 주문 가격</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₩15,700</p>
                <p className="text-xs text-green-600">+3.2% 상승</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">총 주문 수</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">4,362</p>
                <p className="text-xs text-green-600">+8.7% 증가</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">재방문율</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-green-600">+5% 향상</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>매출 추이 (구현중)</CardTitle>
              <CardDescription>최근 30일 간의 매출 변화 - 현재 구현 중</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                매출 차트가 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>시간대별 매출 (구현중)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  시간대별 매출 분석이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>요일별 매출 (구현중)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  요일별 매출 패턴이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="menu">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>인기 메뉴 Top 10</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">트러플 파스타</span>
                    <span className="text-sm font-medium">1,234 판매</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">한우 스테이크</span>
                    <span className="text-sm font-medium">982 판매</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">시저 샐러드</span>
                    <span className="text-sm font-medium">876 판매</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>메뉴 카테고리별 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  카테고리별 판매 비율이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>고객 행동 분석</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                고객 구매 패턴 및 행동 분석이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}