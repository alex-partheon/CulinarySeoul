import { FileCheck } from 'lucide-react';

export default function StoreOperationsCompliance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">규정 준수</h1>
        <p className="text-muted-foreground">매장의 규정 준수 사항을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <FileCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">위생 관리, 안전 규정, 법규 준수 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}