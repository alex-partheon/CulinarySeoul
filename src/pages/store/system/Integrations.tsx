import { Plug } from 'lucide-react';

export default function StoreSystemIntegrations() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">연동 관리</h1>
        <p className="text-muted-foreground">외부 시스템 연동을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Plug className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">POS, 배달 플랫폼, 결제 시스템 등의 연동을 관리할 수 있습니다.</p>
      </div>
    </div>
  );
}