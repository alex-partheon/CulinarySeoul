import { BarChart } from 'lucide-react';

export default function StoreMarketingStatus() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">마케팅 현황</h1>
        <p className="text-muted-foreground">매장의 마케팅 성과를 확인합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">캠페인 성과, 고객 반응, ROI 분석 등을 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}