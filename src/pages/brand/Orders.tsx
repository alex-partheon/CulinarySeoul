import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Orders() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <p className="text-muted-foreground mt-1">고객 주문을 확인하고 처리합니다</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">대기 중</TabsTrigger>
          <TabsTrigger value="preparing">준비 중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
          <TabsTrigger value="cancelled">취소</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="mb-4 flex gap-4">
            <Button>일괄 승인</Button>
            <Button variant="outline">주문 필터</Button>
            <Button variant="outline">내보내기</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>대기 중인 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">#2024-001</p>
                    <p className="text-sm text-muted-foreground">2분 전 • 김철수 • ₩15,000</p>
                  </div>
                  <Button size="sm">주문 확인</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">#2024-002</p>
                    <p className="text-sm text-muted-foreground">5분 전 • 이영희 • ₩28,500</p>
                  </div>
                  <Button size="sm">주문 확인</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preparing">
          <Card>
            <CardHeader>
              <CardTitle>준비 중인 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                현재 준비 중인 주문이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>완료된 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                오늘 완료된 주문이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cancelled">
          <Card>
            <CardHeader>
              <CardTitle>취소된 주문</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                취소된 주문 내역이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}