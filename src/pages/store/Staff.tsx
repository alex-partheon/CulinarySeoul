import { Users } from 'lucide-react';

export default function StoreStaff() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">직원 관리</h1>
        <p className="text-muted-foreground">매장 직원의 근무 일정과 권한을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">직원 출퇴근, 근무 일정, 권한 관리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}