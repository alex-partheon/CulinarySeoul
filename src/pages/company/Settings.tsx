import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">회사 설정</h1>
        <p className="text-muted-foreground mt-1">회사 정보와 시스템 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">일반</TabsTrigger>
          <TabsTrigger value="billing">청구 및 결제</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="security">보안</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>회사 정보</CardTitle>
              <CardDescription>기본 회사 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">회사명</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="CulinarySeoul Co., Ltd."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">사업자 등록번호</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="123-45-67890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">주소</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="서울특별시 강남구..."
                  />
                </div>
                <Button type="submit">변경사항 저장</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>결제 설정</CardTitle>
              <CardDescription>결제 방법 및 청구 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                결제 설정 옵션이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>이메일 및 시스템 알림을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">주문 알림</p>
                    <p className="text-sm text-muted-foreground">새 주문이 들어왔을 때 알림</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">재고 부족 알림</p>
                    <p className="text-sm text-muted-foreground">재고가 임계치 이하일 때 알림</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">보고서 알림</p>
                    <p className="text-sm text-muted-foreground">주간/월간 보고서 생성 알림</p>
                  </div>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>보안 설정</CardTitle>
              <CardDescription>계정 보안 및 액세스 관리</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">비밀번호 변경</Button>
                <Button variant="outline" className="w-full">2단계 인증 설정</Button>
                <Button variant="outline" className="w-full">접근 로그 보기</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}