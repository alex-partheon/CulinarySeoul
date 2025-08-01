import { Package } from 'lucide-react';

export default function StoreInventoryStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 현황</h1>
        <p className="text-muted-foreground">매장의 실시간 재고 현황을 확인합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">품목별 재고량, 유통기한, 안전재고 상태 등을 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}