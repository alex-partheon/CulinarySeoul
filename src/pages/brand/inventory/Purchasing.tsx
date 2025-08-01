import { ShoppingCart } from 'lucide-react';

export default function InventoryPurchasing() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">구매 관리</h1>
        <p className="text-muted-foreground">구매 주문을 관리하세요</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">구매 관리 기능이 곧 제공될 예정입니다.</p>
      </div>
    </div>
  );
}