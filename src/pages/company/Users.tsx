import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'

export default function Users() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <p className="text-muted-foreground mt-1">직원 계정 및 권한을 관리합니다</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Button>새 사용자 추가</Button>
        <Button variant="outline">사용자 가져오기</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>사용자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            사용자 목록이 여기에 표시됩니다
          </div>
        </CardContent>
      </Card>
    </div>
  )
}