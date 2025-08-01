import { Activity } from 'lucide-react';

export default function StoreRealtime() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">실시간 모니터링</h1>
        <p className="text-muted-foreground">매장의 실시간 운영 상황을 모니터링합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">실시간 주문 현황, 대기 시간, 테이블 상태 등을 모니터링할 수 있습니다.</p>
      </div>
    </div>
  );
}