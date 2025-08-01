import { CheckSquare } from 'lucide-react';

export default function StoreOperationsTasks() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">작업 관리</h1>
        <p className="text-muted-foreground">매장의 일일 작업을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <CheckSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">체크리스트, 작업 할당, 완료 추적 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}