import { ArrowRightLeft } from 'lucide-react';

export default function StoreInventoryMovement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 이동</h1>
        <p className="text-muted-foreground">매장 간 재고 이동을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">매장 간 재고 이동 요청, 승인, 이력 관리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}