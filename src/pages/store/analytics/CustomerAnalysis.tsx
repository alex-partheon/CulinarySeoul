import { Users } from 'lucide-react';

export default function StoreAnalyticsCustomerAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">고객 분석</h1>
        <p className="text-muted-foreground">매장의 고객 데이터를 분석합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">고객 세그먼트, 구매 패턴, 재방문율 등을 분석할 수 있습니다.</p>
      </div>
    </div>
  );
}