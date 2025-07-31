import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

export default function Reports() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">보고서</h1>
        <p className="text-muted-foreground mt-1">비즈니스 현황과 분석 보고서를 확인합니다</p>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">재고 보고서</TabsTrigger>
          <TabsTrigger value="financial">재무 보고서</TabsTrigger>
          <TabsTrigger value="supplier">공급업체 분석</TabsTrigger>
          <TabsTrigger value="custom">사용자 정의</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <div className="mb-4 flex gap-4">
            <Button>보고서 생성</Button>
            <Button variant="outline">PDF 내보내기</Button>
            <Button variant="outline">예약 설정</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>재고 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  재고 현황 요약이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>재고 회전율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  재고 회전율 분석이 여기에 표시됩니다
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>재무 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                구매 내역 및 지출 분석이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card>
            <CardHeader>
              <CardTitle>공급업체 성과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                공급업체별 성과 분석이 여기에 표시됩니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>사용자 정의 보고서</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                사용자 정의 보고서를 생성할 수 있습니다
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}