import { Monitor } from 'lucide-react';

export default function StorePOS() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">POS 관리</h1>
        <p className="text-muted-foreground">매장의 POS 시스템을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Monitor className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">POS 연동, 결제 관리, 영수증 발행 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}