import { Package } from 'lucide-react';

export default function StoreAnalyticsInventoryReport() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 리포트</h1>
        <p className="text-muted-foreground">매장의 재고 관련 리포트를 확인합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">재고 회전율, 손실률, 발주 효율성 등을 분석할 수 있습니다.</p>
      </div>
    </div>
  );
}