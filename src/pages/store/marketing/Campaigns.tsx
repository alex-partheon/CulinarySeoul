import { Target } from 'lucide-react';

export default function StoreMarketingCampaigns() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">캠페인 관리</h1>
        <p className="text-muted-foreground">매장의 마케팅 캠페인을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">매장별 캠페인 기획, 실행, 성과 측정 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}