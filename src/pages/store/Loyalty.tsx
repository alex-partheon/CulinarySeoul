import { Award } from 'lucide-react';

export default function StoreLoyalty() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">로열티 프로그램</h1>
        <p className="text-muted-foreground">매장의 고객 로열티 프로그램을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">포인트 적립, 등급 관리, 혜택 제공 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}