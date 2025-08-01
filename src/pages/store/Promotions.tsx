import { Megaphone } from 'lucide-react';

export default function StorePromotions() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">프로모션 관리</h1>
        <p className="text-muted-foreground">매장의 프로모션과 이벤트를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Megaphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">매장별 프로모션 실행, 쿠폰 발행, 이벤트 관리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}