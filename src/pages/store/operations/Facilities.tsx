import { Wrench } from 'lucide-react';

export default function StoreOperationsFacilities() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">시설 관리</h1>
        <p className="text-muted-foreground">매장의 시설과 장비를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Wrench className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">장비 점검 일정, 유지보수 이력, 고장 신고 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}