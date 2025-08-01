import { Calendar } from 'lucide-react';

export default function StoreMarketingEvents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">이벤트 관리</h1>
        <p className="text-muted-foreground">매장의 이벤트를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">매장별 이벤트 기획, 일정 관리, 성과 분석 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}