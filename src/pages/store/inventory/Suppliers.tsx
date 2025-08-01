import { Truck } from 'lucide-react';

export default function StoreInventorySuppliers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">공급업체 관리</h1>
        <p className="text-muted-foreground">매장의 공급업체 정보를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Truck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">공급업체 연락처, 거래 조건, 배송 일정 등을 관리할 수 있습니다.</p>
      </div>
    </div>
  );
}