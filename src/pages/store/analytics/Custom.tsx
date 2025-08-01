import { FileText } from 'lucide-react';

export default function StoreAnalyticsCustom() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">맞춤 리포트</h1>
        <p className="text-muted-foreground">매장의 맞춤형 리포트를 생성합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">필요한 데이터를 선택하여 맞춤형 리포트를 생성할 수 있습니다.</p>
      </div>
    </div>
  );
}