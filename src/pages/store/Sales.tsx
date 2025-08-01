import { DollarSign } from 'lucide-react';

export default function StoreSales() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">매출 관리</h1>
        <p className="text-muted-foreground">매장의 매출 현황을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">일별/주별/월별 매출 현황, 결제 수단별 분석 등의 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}