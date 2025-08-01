import { History } from 'lucide-react';

export default function StoreSystemAuditLog() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">감사 로그</h1>
        <p className="text-muted-foreground">시스템 활동 로그를 확인합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">사용자 활동, 시스템 변경사항, 보안 이벤트 등을 추적할 수 있습니다.</p>
      </div>
    </div>
  );
}