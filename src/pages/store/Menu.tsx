import { Coffee } from 'lucide-react';

export default function StoreMenu() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">메뉴 관리</h1>
        <p className="text-muted-foreground">매장에서 판매하는 메뉴를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">메뉴 재고 확인, 품절 처리, 가격 조정 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}