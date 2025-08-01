import { ShoppingCart } from 'lucide-react';

export default function StoreInventoryPurchasing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">발주 관리</h1>
        <p className="text-muted-foreground">매장의 발주를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">자동 발주, 발주서 작성, 입고 처리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}