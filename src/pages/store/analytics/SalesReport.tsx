import { FileBarChart } from 'lucide-react';

export default function StoreAnalyticsSalesReport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">매출 리포트</h1>
        <p className="text-muted-foreground">매장의 상세 매출 리포트를 확인합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <FileBarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">시간대별, 요일별, 메뉴별 매출 분석 리포트를 제공할 예정입니다.</p>
      </div>
    </div>
  );
}