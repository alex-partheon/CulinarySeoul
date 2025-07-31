import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Marketing() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">마케팅</h1>
        <p className="text-muted-foreground mt-1">프로모션과 캔페인을 관리합니다</p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">캔페인</TabsTrigger>
          <TabsTrigger value="promotions">프로모션</TabsTrigger>
          <TabsTrigger value="coupons">쿠폰</TabsTrigger>
          <TabsTrigger value="social">소셜 미디어</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <div className="mb-4 flex gap-4">
            <Button>새 캔페인 만들기</Button>
            <Button variant="outline">템플릿 사용</Button>
            <Button variant="outline">성과 보고서</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>현재 진행 중</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">여름 특별 할인 이벤트</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">활성</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">6/1 - 8/31 • 선택 메뉴 20% 할인</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">수정</Button>
                      <Button size="sm" variant="outline">통계</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">신규 고객 환영</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">활성</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">상시 • 첫 주문 15% 할인</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">수정</Button>
                      <Button size="sm" variant="outline">통계</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>캔페인 성과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">이번 달 총 매출 (구현중)</p>
                    <p className="text-2xl font-bold">₩12.3M</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">캔페인 ROI</p>
                    <p className="text-2xl font-bold">245%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">신규 고객 유치</p>
                    <p className="text-2xl font-bold">432명</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="promotions">
          <Card>
            <CardHeader>
              <CardTitle>프로모션 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                프로모션 목록과 설정이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coupons">
          <Card>
            <CardHeader>
              <CardTitle>쿠폰 관리</CardTitle>
              <CardDescription>할인 쿠폰을 생성하고 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                쿠폰 생성 및 관리 기능이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 통합</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="font-medium">Instagram</p>
                  <p className="text-sm text-muted-foreground">12.5K 팔로워</p>
                  <Button size="sm" className="mt-2" variant="outline">연결</Button>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl mb-2">📘</div>
                  <p className="font-medium">Facebook</p>
                  <p className="text-sm text-muted-foreground">8.2K 판로워</p>
                  <Button size="sm" className="mt-2" variant="outline">연결</Button>
                </div>
                
                <div className="p-4 border rounded-lg text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <p className="font-medium">Naver Blog</p>
                  <p className="text-sm text-muted-foreground">미연결</p>
                  <Button size="sm" className="mt-2">연결하기</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}