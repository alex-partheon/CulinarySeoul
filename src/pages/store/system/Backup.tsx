import { Database } from 'lucide-react';

export default function StoreSystemBackup() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">백업 관리</h1>
        <p className="text-muted-foreground">데이터 백업을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">자동 백업 설정, 복원 기능 등을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}