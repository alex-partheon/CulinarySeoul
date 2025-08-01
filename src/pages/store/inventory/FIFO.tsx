import { Clock } from 'lucide-react';

export default function StoreInventoryFIFO() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">FIFO 관리</h1>
        <p className="text-muted-foreground">선입선출 방식의 재고 관리를 수행합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">유통기한 관리, 입고일자별 사용 순서, 폐기 예정 품목 알림 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}