import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">브랜드 설정</h1>
        <p className="text-muted-foreground mt-1">브랜드 정보와 운영 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">기본 정보</TabsTrigger>
          <TabsTrigger value="operation">운영 설정</TabsTrigger>
          <TabsTrigger value="payment">결제 설정</TabsTrigger>
          <TabsTrigger value="delivery">배달 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>브랜드 정보</CardTitle>
              <CardDescription>기본 브랜드 정보를 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">브랜드명</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="CulinarySeoul"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">브랜드 설명</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md h-24"
                    placeholder="프리미엄 한식 레스토랑..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">대표 이미지</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Button variant="outline">이미지 업로드</Button>
                    <p className="text-sm text-muted-foreground mt-2">권장: 1200x630px, JPG/PNG</p>
                  </div>
                </div>
                <Button type="submit">저장</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation">
          <Card>
            <CardHeader>
              <CardTitle>운영 시간</CardTitle>
              <CardDescription>브랜드 운영 시간을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">요일</label>
                    <select className="w-full px-3 py-2 border rounded-md">
                      <option>월요일</option>
                      <option>화요일</option>
                      <option>수요일</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">오픈 시간</label>
                    <input type="time" className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">마감 시간</label>
                    <input type="time" className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </div>
                <Button variant="outline">운영 시간 추가</Button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">휴무일 설정</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>공휴일 휴무</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span>주말 휴무</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>결제 수단</CardTitle>
              <CardDescription>허용할 결제 수단을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>신용카드 / 체크카드</span>
                  </div>
                  <span className="text-sm text-muted-foreground">수수료 2.5%</span>
                </label>
                
                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span>카카오페이</span>
                  </div>
                  <span className="text-sm text-muted-foreground">수수료 2.2%</span>
                </label>
                
                <label className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span>현금 (만남 결제)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">수수료 없음</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>배달 설정</CardTitle>
              <CardDescription>배달 옵션과 비용을 설정합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">최소 주문 금액</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">기본 배달료</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="3000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">무료 배달 기준</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="30000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">배달 반경 (km)</label>
                  <input 
                    type="number" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="5"
                  />
                </div>
                <Button>배달 설정 저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}