import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Suppliers() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">공급업체 관리</h1>
        <p className="text-muted-foreground mt-1">거래처 및 공급업체를 관리합니다</p>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">활성 공급업체</TabsTrigger>
          <TabsTrigger value="pending">승인 대기</TabsTrigger>
          <TabsTrigger value="inactive">비활성</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="mb-4 flex gap-4">
            <Button>새 공급업체 추가</Button>
            <Button variant="outline">일괄 초대</Button>
            <Button variant="outline">내보내기</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>활성 공급업체 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                등록된 공급업체 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>승인 대기 중</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                승인 대기 중인 공급업체가 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>비활성 공급업체</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                비활성화된 공급업체 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}