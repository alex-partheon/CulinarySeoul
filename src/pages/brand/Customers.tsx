import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Customers() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">고객 관리</h1>
        <p className="text-muted-foreground mt-1">고객 정보와 가치를 관리합니다</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">전체 고객</TabsTrigger>
          <TabsTrigger value="vip">VIP 고객</TabsTrigger>
          <TabsTrigger value="new">신규 고객</TabsTrigger>
          <TabsTrigger value="inactive">휴면 고객</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="mb-4 flex gap-4">
            <Button>고객 추가</Button>
            <Button variant="outline">세그먼트 생성</Button>
            <Button variant="outline">내보내기</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>고객 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">김철</span>
                    </div>
                    <div>
                      <p className="font-medium">김철수</p>
                      <p className="text-sm text-muted-foreground">총 주문: 45회 • ₩680,000</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">상세 보기</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">이영</span>
                    </div>
                    <div>
                      <p className="font-medium">이영희 <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">VIP</span></p>
                      <p className="text-sm text-muted-foreground">총 주문: 128회 • ₩2,340,000</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">상세 보기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP 고객 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-sm text-muted-foreground">VIP 고객 수</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold">₩25.4M</p>
                  <p className="text-sm text-muted-foreground">월 평균 매출</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold">82%</p>
                  <p className="text-sm text-muted-foreground">재방문율</p>
                </div>
              </div>
              <div className="text-center py-8 text-muted-foreground">
                VIP 고객 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>신규 고객</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                최근 30일 내 가입한 고객이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>휴면 고객</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                90일 이상 주문하지 않은 고객이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}