import { Activity } from 'lucide-react';

export default function StoreSystemStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">시스템 상태</h1>
        <p className="text-muted-foreground">시스템 상태를 모니터링합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">서버 상태, 연결 상태, 성능 지표 등을 모니터링할 수 있습니다.</p>
      </div>
    </div>
  );
}