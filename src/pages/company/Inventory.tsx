import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Inventory() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">재고 관리</h1>
        <p className="text-muted-foreground mt-1">원재료 및 상품 재고를 관리합니다</p>
      </div>

      <Tabs defaultValue="raw-materials" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="raw-materials">원재료</TabsTrigger>
          <TabsTrigger value="products">상품</TabsTrigger>
          <TabsTrigger value="low-stock">재고 부족</TabsTrigger>
        </TabsList>

        <TabsContent value="raw-materials">
          <div className="mb-4 flex gap-4">
            <Button>원재료 추가</Button>
            <Button variant="outline">재고 조정</Button>
            <Button variant="outline">일괄 업로드</Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>원재료 재고 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                원재료 재고 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>상품 재고 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                상품 재고 목록이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock">
          <Card>
            <CardHeader>
              <CardTitle>재고 부족 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                재고 부족 항목이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}