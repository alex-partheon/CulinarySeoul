import { AlertTriangle } from 'lucide-react';

export default function StoreInventoryShortage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 부족</h1>
        <p className="text-muted-foreground">재고 부족 현황을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">안전재고 미달 품목, 긴급 발주 필요 품목 등을 관리할 수 있습니다.</p>
      </div>
    </div>
  );
}