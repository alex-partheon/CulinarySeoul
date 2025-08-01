import { Calculator } from 'lucide-react';

export default function StoreAnalyticsFinancial() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재무 분석</h1>
        <p className="text-muted-foreground">매장의 재무 상태를 분석합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">손익계산서, 현금흐름, 원가 분석 등을 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}