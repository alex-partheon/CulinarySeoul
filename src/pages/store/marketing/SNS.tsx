import { Share2 } from 'lucide-react';

export default function StoreMarketingSNS() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SNS 마케팅</h1>
        <p className="text-muted-foreground">매장의 소셜미디어 마케팅을 관리합니다</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <Share2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-xl font-semibold mb-2">개발 중</h2>
        <p className="text-muted-foreground">인스타그램, 페이스북 등 SNS 채널 관리 기능을 제공할 예정입니다.</p>
      </div>
    </div>
  );
}