import { MessageSquare } from 'lucide-react';

export default function StoreMarketingReviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">리뷰 관리</h1>
        <p className="text-muted-foreground">매장의 고객 리뷰를 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">네이버, 카카오맵 등의 리뷰 통합 관리 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}