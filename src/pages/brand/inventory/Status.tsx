import { Package } from 'lucide-react';

export default function InventoryStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 현황</h1>
        <p className="text-muted-foreground">실시간 재고 현황을 확인하세요</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">재고 현황 기능이 곧 제공될 예정입니다.</p>
      </div>
    </div>
  );
}