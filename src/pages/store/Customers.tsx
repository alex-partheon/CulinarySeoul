import { UserCheck } from 'lucide-react';

export default function StoreCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">고객 관리</h1>
        <p className="text-muted-foreground">매장을 방문한 고객 정보를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <UserCheck className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">고객 방문 이력, 선호 메뉴, 피드백 관리 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}