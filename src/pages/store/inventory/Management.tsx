import { Settings } from 'lucide-react';

export default function StoreInventoryManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">재고 관리</h1>
        <p className="text-muted-foreground">매장의 재고를 체계적으로 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">재고 조정, 손실 처리, 재고 이동 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}