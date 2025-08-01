import { Monitor } from 'lucide-react';

export default function SystemStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">시스템 상태</h1>
        <p className="text-muted-foreground">시스템 상태를 모니터링하세요</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">시스템 상태 기능이 곧 제공될 예정입니다.</p>
      </div>
    </div>
  );
}